import prismaClient from '../prismaClient';

export default async (message: string) => {
  const exists = await prismaClient.message.findFirst({
    where: {
      text: message,
    },
  });

  if (!exists) {
    console.info(`[nuxt/auto-translate] - Saving message: ${message}`);
    prismaClient.message.create({
      data: {
        text: message,
      },
    });
  }
};
