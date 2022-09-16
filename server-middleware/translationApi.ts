import express, { Request } from 'express';
import prismaClient from '../prismaClient';
import { Translation } from '@prisma/client';

const app = express();

app.post('/nuxt-auto-translate/messages', async (req, res) => {
  const { text } = req.body;

  const response = await prismaClient.message.create({
    data: {
      text,
    },
  });

  return res.status(201).json(response);
});

app.get(
  '/nuxt-auto-translate/translations',
  async (req: Request<{}, any, any, any, { languageCode: string }>, res) => {
    const { languageCode } = req.query;

    const translations = await new Promise<Translation[]>(async (resolve) => {
      const translations = await prismaClient.translation.findMany({
        where: {
          languageCode,
        },
      });

      resolve(translations);
    });

    return translations.reduce<{ [key: string]: string }>(
      (translationObject, translation) => {
        translationObject[translation.messageText] = translation.text;
        return translationObject;
      },
      {}
    );
  }
);

export default app;
