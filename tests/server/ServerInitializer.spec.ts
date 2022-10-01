import { expect, test, describe, beforeEach, jest } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';
import ServerInitializer from '~/server/ServerInitializer';
import Router from '~/server/builders/Router';
import NuxtAutoTranslateExpress from '~/server/NuxtAutoTranslateExpress';

describe('Server Initializer', () => {
  let serverInitializer: ServerInitializer;
  let routerMock: MockProxy<Router>;
  let app: ReturnType<typeof NuxtAutoTranslateExpress.getInstance>;

  beforeEach(() => {
    routerMock = mock<Router>();
    serverInitializer = new ServerInitializer([routerMock]);
    app = NuxtAutoTranslateExpress.getInstance();
  });

  test('Should mount chain of responsability to mutate app server', () => {
    const routerBuild = routerMock.build as jest.MockedFunction<
      typeof routerMock.build
    >;

    serverInitializer.init();

    expect(routerBuild).toBeCalled();
  });

  test('Should work with no chain too', () => {
    const otherServerInitializer = new ServerInitializer();

    otherServerInitializer.init();

    expect(NuxtAutoTranslateExpress.getInstance()).toBeTruthy();
  });

  test('Should work with a plural chain', () => {
    const secondBuild = jest.fn();
    const secondSetNext = jest.fn();
    const firstSetNext = routerMock.setNext as jest.MockedFunction<
      typeof routerMock.setNext
    >;

    const secondBuilder = {
      build: secondBuild,
      setNext: secondSetNext,
    };

    const otherServerInitializer = new ServerInitializer([
      routerMock,
      secondBuilder,
    ]);

    otherServerInitializer.init();

    expect(firstSetNext).toBeCalled();
    expect(firstSetNext).toBeCalledWith(secondBuilder);
    expect(secondSetNext).not.toBeCalled();
  });
});
