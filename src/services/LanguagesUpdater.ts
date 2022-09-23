import { PrismaClient, Language, Prisma } from '@prisma/client';
import { LocaleObject, Locale } from '@nuxtjs/i18n';
import LocaleNormalizer from './LocaleNormalizer';
import SyncLanguagesFinder from './SyncLanguagesFinder';
import Logger from './Logger';

export default class LanguagesUpdater {
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

  async update(): Promise<Prisma.Prisma__LanguageClient<Language>[]> {
    const { languagesToCreate, languagesToDelete } = SyncLanguagesFinder.find(
      await this.currentLanguages,
      this.normalizedLocales
    );

    const languageCreations: Prisma.Prisma__LanguageClient<Language>[] = [];

    languagesToCreate.forEach((language) => {
      Logger.log(`Saving ${language.name}(${language.code}) language`);
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
      Logger.log(`Deleting ${language.name}(${language.code}) language`);
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
