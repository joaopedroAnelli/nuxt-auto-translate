import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import TranslationsHandler from '~/server/modules/translations/Handler';
import TranslationsRouter from '~/server/modules/translations/Router';
import { Express } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Translations Router', () => {
  let app: MockProxy<Express>;
  let translationHandler: MockProxy<TranslationsHandler>;

  beforeEach(() => {
    app = mock<Express>();
    translationHandler = mock<TranslationsHandler>();
  });

  test('Should register a GET -> /translations route', () => {
    const translationRouter = new TranslationsRouter(app, translationHandler);

    const useMethod = app.use as jest.MockedFunction<typeof app.use>;

    const spy = jest.spyOn(translationRouter.getRouter(), 'get');

    translationRouter.route();

    expect(spy).toBeCalledWith('', translationHandler.listTranslations);
    expect(useMethod).toBeCalledWith(
      '/translations',
      translationRouter.getRouter()
    );
  });
});
