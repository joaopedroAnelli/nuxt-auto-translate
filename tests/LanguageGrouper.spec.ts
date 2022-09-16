import { describe, test, expect } from '@jest/globals';
import LanguageGrouper, {
  IMessagesMissingTranslation,
} from '../services/LanguageGrouper';

describe('LanguageGrouper', () => {
  test('should group languages', () => {
    const messages: IMessagesMissingTranslation[] = [
      {
        langCode: 'en',
        text: 'Olá Mundo',
      },
      {
        langCode: 'en',
        text: 'Tudo bem?',
      },
      {
        langCode: 'es',
        text: 'Olá Mundo',
      },
      {
        langCode: 'jp',
        text: 'Olá Mundo',
      },
    ];

    const result = LanguageGrouper.group(messages);

    expect(result).toMatchObject([
      {
        langCode: 'en',
        messages: ['Olá Mundo', 'Tudo bem?'],
      },
      {
        langCode: 'es',
        messages: ['Olá Mundo'],
      },
      {
        langCode: 'jp',
        messages: ['Olá Mundo'],
      },
    ]);
  });
});
