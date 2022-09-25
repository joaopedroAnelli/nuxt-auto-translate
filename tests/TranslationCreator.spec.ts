import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { prismaMock } from './utils/prisma.mock';
import { googleApiMock } from './utils/googleApi.mock';
import TranslationCreator from '~/services/TranslationCreator';
import TranslationService from '~/services/TranslationService';
import LanguageGrouper, {
  IMessagesMissingTranslation,
} from '~/services/LanguageGrouper';

type GoogleTranslateFn = (input: string[], to: string) => Promise<unknown>;

describe('TranslationCreator', () => {
  let translationCreator: TranslationCreator;
  let mockTranslationService: MockProxy<TranslationService>;
  let getMissingTranslations: jest.MockedFunction<typeof prismaMock.$queryRaw>;
  let groupMessage: jest.MockedFunction<typeof LanguageGrouper.group>;
  let googleTranslate: jest.MockedFunction<typeof googleApiMock.translate>;

  const messagesMissingTranslations: IMessagesMissingTranslation[] = [
    {
      langCode: 'en',
      text: 'Olá Mundo!',
    },
    { langCode: 'es', text: 'Obrigado!' },
    { langCode: 'en', text: 'Obrigado!' },
  ];

  beforeEach(() => {
    mockTranslationService = mockDeep<TranslationService>();
    translationCreator = new TranslationCreator(
      prismaMock,
      'pt',
      mockTranslationService,
      googleApiMock
    );

    getMissingTranslations = <jest.MockedFunction<typeof prismaMock.$queryRaw>>(
      prismaMock.$queryRaw
    );
    getMissingTranslations.mockResolvedValue(messagesMissingTranslations);

    groupMessage = jest.fn((_) => [
      { langCode: 'en', messages: ['Olá Mundo!', 'Obrigado!'] },
      { langCode: 'es', messages: ['Obrigado!'] },
    ]);

    LanguageGrouper.group = groupMessage;

    (googleApiMock.translate as GoogleTranslateFn) = jest.fn(
      (input: string[], to: string) => {
        return new Promise((resolve) => resolve([input, to]));
      }
    );
  });

  test('Should find messages without translation', async () => {
    await translationCreator.create();
    expect(getMissingTranslations).toBeCalled();
  });

  test('Should group messages', async () => {
    await translationCreator.create();
    expect(groupMessage).toBeCalledWith(messagesMissingTranslations);
  });
});
