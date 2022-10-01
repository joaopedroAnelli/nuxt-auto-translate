import { PrismaClient, Translation } from '@prisma/client';
import { Request, Response } from 'express';

type NuxtI18nTranslation = Record<string, string>;

interface Params {}
type ResponseBody = NuxtI18nTranslation;
type RequestBody = never;
type Query = Partial<Translation>;

export default class TranslationsHandler {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  async listTranslations(
    req: Request<Params, ResponseBody, RequestBody, Query>,
    res: Response
  ) {
    const { languageCode } = req.query;

    const translations = await this.prismaClient.translation.findMany({
      where: {
        languageCode,
      },
    });

    const nuxtI18nTranslations =
      this.convertTranslationsInNuxtI18n(translations);

    return res.json(nuxtI18nTranslations);
  }

  private convertTranslationsInNuxtI18n(translations: Translation[]) {
    return translations.reduce<{ [key: string]: string }>(
      (translationObject, translation) => {
        translationObject[translation.messageText] = translation.text;
        return translationObject;
      },
      {}
    );
  }
}
