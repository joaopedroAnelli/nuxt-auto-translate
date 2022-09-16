import { PrismaClient, Language } from '@prisma/client';
import { LocaleObject, Locale } from '@nuxtjs/i18n';
import LocaleNormalizer from './LocaleNormalizer';
import SyncLanguagesFinder from './SyncLanguagesFinder';

export default class {
  prisma: PrismaClient;
  currentLanguages: Promise<Language[]>;
  normalizedLocales: ReturnType<typeof LocaleNormalizer.normalize>;

  constructor(
    prisma: PrismaClient,
    nuxtI18nOptionsLocales: LocaleObject[] | Locale[]
  ) {
    this.prisma = prisma;

    this.normalizedLocales = LocaleNormalizer.normalize(nuxtI18nOptionsLocales);

    this.currentLanguages = prisma.language.findMany();
  }

  async update(): Promise<any[]> {
    const { languagesToCreate, languagesToDelete } = SyncLanguagesFinder.find(
      await this.currentLanguages,
      this.normalizedLocales
    );

    const languageCreations: Promise<any>[] = [];

    languagesToCreate.forEach((language) => {
      // TODO: logger
      // eslint-disable-next-line no-console
      console.info(
        `[nuxt/auto-translate] - Saving ${language.name}(${language.code}) language`
      );
      languageCreations.push(
        this.prisma.language.create({
          data: {
            code: language.code,
            name: language.name,
          },
        })
      );
    });

    const languageDeletes: Promise<any>[] = [];

    languagesToDelete.forEach((language) => {
      // eslint-disable-next-line no-console
      console.info(
        `[nuxt/auto-translate] - Deleting ${language.name}(${language.code}) language`
      );
      languageDeletes.push(
        this.prisma.language.delete({
          where: {
            code: language.code,
          },
        })
      );
    });

    return Promise.all([...languageDeletes, ...languageCreations]);
  }
}
