import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import MessagesHandler from '~/server/modules/messages/Handler';
import MessagesRouter from '~/server/modules/messages/Router';
import { Express } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Messages Router', () => {
  let app: MockProxy<Express>;
  let messageHandler: MockProxy<MessagesHandler>;

  beforeEach(() => {
    app = mock<Express>();
    messageHandler = mock<MessagesHandler>();
  });

  test('Should register a POST -> /messages route', () => {
    const messageRouter = new MessagesRouter(app, messageHandler);

    const useMethod = app.use as jest.MockedFunction<typeof app.use>;

    const spy = jest.spyOn(messageRouter.getRouter(), 'post');

    messageRouter.route();

    expect(spy).toBeCalledWith('', messageHandler.createMessage);
    expect(useMethod).toBeCalledWith('/messages', messageRouter.getRouter());
  });
});
