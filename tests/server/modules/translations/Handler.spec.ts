import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { mock, MockProxy, mockDeep } from 'jest-mock-extended';
import TranslationsHandler from '~/server/modules/translations/Handler';
import { prismaMock } from 'tests/utils/prisma.mock';

type HandlerParams = Parameters<TranslationsHandler['listTranslations']>;

type Request = HandlerParams[0];
type Response = HandlerParams[1];

describe('TranslationHandler', () => {
  let getTranslationsMethod: jest.MockedFunction<
    typeof prismaMock.translation.findMany
  >;
  let translationsHandler: TranslationsHandler;
  let mockRequest: MockProxy<Request>;
  let mockResponse: MockProxy<Response>;

  beforeEach(() => {
    getTranslationsMethod = prismaMock.translation
      .findMany as jest.MockedFunction<typeof prismaMock.translation.findMany>;

    getTranslationsMethod.mockResolvedValue([
      {
        id: 1,
        languageCode: 'en',
        messageText: 'Olá Mundo!',
        text: 'Hello World',
      },
      {
        id: 1,
        languageCode: 'en',
        messageText: 'Tudo bem?',
        text: 'How are you?',
      },
    ]);

    translationsHandler = new TranslationsHandler(prismaMock);
    mockRequest = mockDeep<Request>();
    mockResponse = mockDeep<Response>();

    mockResponse.json = jest.fn((object) => {
      return JSON.stringify(object);
    }) as unknown as jest.MockedFunction<typeof mockResponse.json>;
  });

  test('Should call prisma client with no filters', () => {
    mockRequest.query = {};

    translationsHandler.listTranslations(mockRequest, mockResponse);

    expect(getTranslationsMethod).toBeCalledWith({
      where: {},
    });
  });

  test('Should call prisma client with languageCode filter', () => {
    mockRequest.query.languageCode = 'pt';

    translationsHandler.listTranslations(mockRequest, mockResponse);

    expect(getTranslationsMethod).toBeCalledWith({
      where: {
        languageCode: 'pt',
      },
    });
  });

  test('Should return converted translations', async () => {
    const response = await translationsHandler.listTranslations(
      mockRequest,
      mockResponse
    );

    const responseBody = {
      'Olá Mundo!': 'Hello World',
      'Tudo bem?': 'How are you?',
    };

    const responseJson = JSON.stringify(responseBody);

    expect(response).toMatch(responseJson);
  });
});
