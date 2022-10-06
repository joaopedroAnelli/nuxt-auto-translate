import { describe, test, expect, jest } from '@jest/globals';
import { mock } from 'jest-mock-extended';
import Router from '~/server/builders/Router';
import ServerBuilder from '~/server/contracts/ServerBuilder';
import MessageRouter from '~/server/modules/messages/Router';
import TranslationRouter from '~/server/modules/translations/Router';

describe('Router', () => {
  test('Should call every route method inside routers', () => {
    const moduleRouterMock = mock<MessageRouter>();
    const translationRouterMock = mock<TranslationRouter>();

    const router = new Router([moduleRouterMock, translationRouterMock]);

    router.build();

    expect(moduleRouterMock.route).toBeCalled();
    expect(moduleRouterMock.route).toBeCalled();
  });
  test('Should work with no routers at all', () => {
    const router = new Router();

    expect(() => {
      router.build();
    }).not.toThrow();
  });
  test('Should call next if it exists', () => {
    const moduleRouterMock = mock<MessageRouter>();
    const translationRouterMock = mock<TranslationRouter>();

    const router = new Router([moduleRouterMock, translationRouterMock]);

    const otherBuilder: ServerBuilder = {
      build: jest.fn(),
      setNext: jest.fn(),
    };

    router.setNext(otherBuilder);

    router.build();

    expect(otherBuilder.build).toBeCalled();
    expect(otherBuilder.setNext).not.toBeCalled();
  });
});
