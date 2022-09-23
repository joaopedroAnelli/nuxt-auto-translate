import { describe, test, expect } from '@jest/globals';
import { Language } from '@prisma/client';
import { AutoTranslateLocaleObject } from '../src/services/LocaleNormalizer';
import SyncLanguagesFinder from '../src/services/SyncLanguagesFinder';

describe('SyncLocalesFinder', () => {
  test('should find a missing locale and no one to remove', () => {
    const supportedLanguages: AutoTranslateLocaleObject[] = [
      {
        name: 'Portuguese',
        code: 'pt',
      },
      {
        name: 'English',
        code: 'en',
      },
    ];

    const currentLanguages: Language[] = [{ code: 'pt', name: 'Portuguese' }];

    const syncLanguagesOperations = SyncLanguagesFinder.find(
      currentLanguages,
      supportedLanguages
    );

    const missingLocales = syncLanguagesOperations.languagesToCreate;

    expect(missingLocales.length).toBe(1);
    expect(missingLocales[0].code).toBe('en');
    expect(missingLocales[0].name).toBe('English');

    const deprecatedLocales = syncLanguagesOperations.languagesToDelete;

    expect(deprecatedLocales.length).toBe(0);
  });

  test('should find nothing to create and nothing to remove', () => {
    const supportedLanguages: AutoTranslateLocaleObject[] = [
      {
        name: 'Portuguese',
        code: 'pt',
      },
    ];

    const currentLanguages: Language[] = [{ code: 'pt', name: 'Portuguese' }];

    const syncLanguagesOperations = SyncLanguagesFinder.find(
      currentLanguages,
      supportedLanguages
    );

    const missingLocales = syncLanguagesOperations.languagesToCreate;

    expect(missingLocales.length).toBe(0);

    const deprecatedLocales = syncLanguagesOperations.languagesToDelete;

    expect(deprecatedLocales.length).toBe(0);
  });

  test('should find nothing to create and english to remove', () => {
    const supportedLanguages: AutoTranslateLocaleObject[] = [
      {
        name: 'Portuguese',
        code: 'pt',
      },
    ];

    const currentLanguages: Language[] = [
      { code: 'pt', name: 'Portuguese' },
      {
        name: 'English',
        code: 'en',
      },
    ];

    const syncLanguagesOperations = SyncLanguagesFinder.find(
      currentLanguages,
      supportedLanguages
    );

    const missingLocales = syncLanguagesOperations.languagesToCreate;

    expect(missingLocales.length).toBe(0);

    const deprecatedLocales = syncLanguagesOperations.languagesToDelete;

    expect(deprecatedLocales.length).toBe(1);
    expect(deprecatedLocales[0].code).toBe('en');
    expect(deprecatedLocales[0].name).toBe('English');
  });

  test('should create both', () => {
    const supportedLanguages: AutoTranslateLocaleObject[] = [
      {
        name: 'Portuguese',
        code: 'pt',
      },
      {
        name: 'English',
        code: 'en',
      },
    ];

    const currentLanguages: Language[] = [];

    const syncLanguagesOperations = SyncLanguagesFinder.find(
      currentLanguages,
      supportedLanguages
    );

    const missingLocales = syncLanguagesOperations.languagesToCreate;

    expect(missingLocales.length).toBe(2);
  });

  test('should remove both', () => {
    const supportedLanguages: AutoTranslateLocaleObject[] = [];

    const currentLanguages: Language[] = [
      {
        name: 'Portuguese',
        code: 'pt',
      },
      {
        name: 'English',
        code: 'en',
      },
    ];

    const syncLanguagesOperations = SyncLanguagesFinder.find(
      currentLanguages,
      supportedLanguages
    );

    const deprecatedLocales = syncLanguagesOperations.languagesToDelete;

    expect(deprecatedLocales.length).toBe(2);
  });
});
