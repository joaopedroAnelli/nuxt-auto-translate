import { PrismaClient, Translation } from '@prisma/client';
import { Translate } from '@google-cloud/translate/build/src/v2';
import LanguageGrouper, {
  ILangMessages,
  IMessagesMissingTranslation,
} from './LanguageGrouper';
import TranslationService from './TranslationService';

export default class TranslationCreator {
  prismaClient: PrismaClient;
  defaultLocale: string;
  translationService: TranslationService;
  googleTranslateApi: Translate;

  constructor(
    prismaClient: PrismaClient,
    defaultLocale: string,
    translationService: TranslationService,
    googleTranslateApi: Translate
  ) {
    this.prismaClient = prismaClient;
    this.defaultLocale = defaultLocale;
    this.translationService = translationService;
    this.googleTranslateApi = googleTranslateApi;
  }

  async create() {
    const messagesMissingTranslation = await this.prismaClient.$queryRaw<
      IMessagesMissingTranslation[]
    >`
    SELECT m."text", l.code as "langCode"
    from Message m
    join "Language" l
    left join "Translation" t on t.messageText = m."text" and l.code = t.languageCode
    WHERE t."text" is null;
  `;

    const languagesWithMessages = LanguageGrouper.group(
      messagesMissingTranslation
    );

    const defaultLocaleMessages = languagesWithMessages.find(
      (language) => language.langCode === this.defaultLocale
    );

    if (defaultLocaleMessages) {
      this.translationService.bulkCreate(
        defaultLocaleMessages.messages.map((message) => ({
          languageCode: defaultLocaleMessages.langCode,
          messageText: message,
          text: message,
        }))
      );
    }

    const foreignLanguages = languagesWithMessages.filter(
      (language) => language.langCode !== this.defaultLocale
    );

    const convertGoogleTranslationInTranslation =
      (lang: ILangMessages) =>
      (googleTranslation: string, index: number): Omit<Translation, 'id'> => ({
        languageCode: lang.langCode,
        messageText: lang.messages[index],
        text: googleTranslation,
      });

    const getGoogleTranslations = (
      lang: ILangMessages
    ): Promise<Omit<Translation, 'id'>[]> =>
      this.googleTranslateApi
        .translate(lang.messages, { to: lang.langCode })
        .then((googleResponse) =>
          googleResponse[0].map(convertGoogleTranslationInTranslation(lang))
        );

    const foreignLanguagesTranslationsPromises = foreignLanguages.map(
      (foreign) => getGoogleTranslations(foreign)
    );

    const translationsByLanguages = await Promise.all(
      foreignLanguagesTranslationsPromises
    );

    const translations: Omit<Translation, 'id'>[] =
      translationsByLanguages.reduce(
        (translations, currentTranslations) =>
          translations.concat(currentTranslations),
        []
      );

    await this.translationService.bulkCreate(translations);
  }
}
