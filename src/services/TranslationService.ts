import { PrismaClient, Translation, Prisma } from '@prisma/client';
import Logger from './Logger';

export default class {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  bulkCreate(translations: Omit<Translation, 'id'>[]) {
    return Promise.all(
      translations.map((translation) => this.create(translation))
    );
  }

  create(
    translation: Omit<Translation, 'id'>
  ): Prisma.Prisma__TranslationClient<Translation> {
    Logger.log(
      `Saving translation: ${translation.messageText} > ${translation.text}`
    );
    return this.prismaClient.translation.create({
      data: translation,
    });
  }
}
