import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import TranslationService from '../src/services/TranslationService';
import { prismaMock } from './utils/prisma.mock';

describe('TranslationService', () => {
  let createTranslation: jest.MockedFunction<
    typeof prismaMock.translation.create
  >;

  beforeEach(() => {
    createTranslation = prismaMock.translation.create as jest.MockedFunction<
      typeof prismaMock.translation.create
    >;

    createTranslation.mockResolvedValue({
      id: 1,
      languageCode: 'en',
      messageText: 'Olá Mundo',
      text: 'Hello World',
    });
  });

  test('should create a translation', async () => {
    const translationService = new TranslationService(prismaMock);
    const result = await translationService.create({
      languageCode: 'en',
      messageText: 'Olá Mundo',
      text: 'Hello World',
    });

    expect(result).toEqual({
      id: 1,
      languageCode: 'en',
      messageText: 'Olá Mundo',
      text: 'Hello World',
    });
  });

  test('should create a many translations', async () => {
    const translationService = new TranslationService(prismaMock);
    const result = await translationService.bulkCreate([
      {
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
      {
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
      {
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
    ]);

    expect(result).toMatchObject([
      {
        id: 1,
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
      {
        id: 1,
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
      {
        id: 1,
        languageCode: 'en',
        messageText: 'Olá Mundo',
        text: 'Hello World',
      },
    ]);
  });
});
