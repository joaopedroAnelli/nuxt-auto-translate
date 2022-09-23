import { PrismaClient } from '@prisma/client';
import Logger from '~/services/Logger';

export default class {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(message: string) {
    const exists = await this.prismaClient.message.findFirst({
      where: {
        text: message,
      },
    });

    if (!exists) {
      Logger.log(`Saving message: ${message}`);
      return this.prismaClient.message.create({
        data: {
          text: message,
        },
      });
    }
  }
}
