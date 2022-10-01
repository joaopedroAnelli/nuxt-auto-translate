import { Message } from '@prisma/client';
import { Request, Response } from 'express';
import MessageCreator from '~/services/MessageCreator';

type ResponseBody = Partial<Message> | string;
type Body = Partial<Message>;
interface Params {}

export default class MessagesHandler {
  messageCreator: MessageCreator;

  constructor(messageCreator: MessageCreator) {
    this.messageCreator = messageCreator;
  }

  async createMessage(req: Request<Params, ResponseBody, Body>, res: Response) {
    if (!req.body?.text) {
      return res.status(422).json('Text is required');
    }

    const { text } = req.body;

    const response = await this.messageCreator.create(text);

    return res.status(201).json(response);
  }
}
