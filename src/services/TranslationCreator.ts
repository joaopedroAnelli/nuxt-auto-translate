import { PrismaClient, Translation } from '@prisma/client';
import { Translate } from '@google-cloud/translate/build/src/v2';
import LanguageGrouper, {
  ILangMessages,
  IMessagesMissingTranslation,
} from './LanguageGrouper';
import TranslationService from './TranslationService';

type TranslationDTO = Omit<Translation, 'id'>;

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
    const leftMessages = await this.getMessagesWithoutTranslation();

    const languages = LanguageGrouper.group(leftMessages);

    const byLocale = (l: ILangMessages) => l.langCode === this.defaultLocale;

    const defaultLang = languages.find(byLocale);

    if (defaultLang) {
      this.createDefaultLocaleMessages(defaultLang);
    }

    const translationsToCreate: TranslationDTO[] =
      await this.getTranslationsToCreate(languages);

    await this.translationService.bulkCreate(translationsToCreate);
  }

  private getMessagesWithoutTranslation() {
    return this.prismaClient.$queryRaw<IMessagesMissingTranslation[]>`
      SELECT m."text", l.code as "langCode"
      from Message m
      join "Language" l
      left join "Translation" t on t.messageText = m."text" and l.code = t.languageCode
      WHERE t."text" is null;
    `;
  }

  private createDefaultLocaleMessages(defaultLocaleMessages: ILangMessages) {
    const translations = defaultLocaleMessages.messages.map((message) => ({
      languageCode: defaultLocaleMessages.langCode,
      messageText: message,
      text: message,
    }));

    return this.translationService.bulkCreate(translations);
  }

  private async getTranslationsToCreate(languages: ILangMessages[]) {
    const byLangCode = (l: ILangMessages) => l.langCode !== this.defaultLocale;

    const foreignLanguages = languages.filter(byLangCode);

    const translationsPromises: Promise<TranslationDTO[]>[] =
      this.buildTranslationsPromises(foreignLanguages);

    const translationsLists: TranslationDTO[][] = await Promise.all(
      translationsPromises
    );

    const translationsToCreate: TranslationDTO[] = translationsLists.reduce(
      (translations, translationList) => translations.concat(translationList),
      []
    );
    return translationsToCreate;
  }

  private buildTranslationsByGoogleResponse(
    lang: ILangMessages,
    googleResponse: [string[], any]
  ): TranslationDTO[] {
    const [googleTranslations] = googleResponse;

    const translations: TranslationDTO[] = googleTranslations.map(
      (googleTranslation, index) => ({
        languageCode: lang.langCode,
        messageText: lang.messages[index],
        text: googleTranslation,
      })
    );

    return translations;
  }

  private buildTranslationsPromises(
    foreignLanguages: ILangMessages[]
  ): Promise<TranslationDTO[]>[] {
    return foreignLanguages.map((lang) => {
      const googleCall = this.googleTranslateApi.translate(lang.messages, {
        to: lang.langCode,
      });

      const translationsPromise = googleCall.then((googleResponse) => {
        return this.buildTranslationsByGoogleResponse(lang, googleResponse);
      });

      return translationsPromise;
    });
  }
}
