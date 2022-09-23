import express, { Request } from 'express';
import prismaClient from '~/prisma.client';
import MessageCreator from '~/services/MessageCreator';

const app = express();

app.post('/messages', async (req, res) => {
  const { text } = req.body;

  const messageCreator = new MessageCreator(prismaClient);

  const response = await messageCreator.create(text);

  return res.status(201).json(response);
});

app.get(
  '/translations',
  async (req: Request<{}, any, any, any, { languageCode: string }>, res) => {
    const { languageCode } = req.query;

    const translations = await prismaClient.translation.findMany({
      where: {
        languageCode,
      },
    });

    return res.json(
      translations.reduce<{ [key: string]: string }>(
        (translationObject, translation) => {
          translationObject[translation.messageText] = translation.text;
          return translationObject;
        },
        {}
      )
    );
  }
);

export default app;
