import { Language } from '@prisma/client';
import { AutoTranslateLocaleObject } from './LocaleNormalizer';

interface SyncLanguagesOperations {
  languagesToCreate: AutoTranslateLocaleObject[];
  languagesToDelete: AutoTranslateLocaleObject[];
}

export default class {
  static find(
    currentLanguages: Language[],
    supportedLanguages: AutoTranslateLocaleObject[]
  ): SyncLanguagesOperations {
    return {
      languagesToCreate: supportedLanguages.filter(
        (supportedLanguage) =>
          !currentLanguages
            .map((language) => language.code)
            .includes(supportedLanguage.code)
      ),
      languagesToDelete: currentLanguages.filter(
        (currentLanguage) =>
          !supportedLanguages
            .map((language) => language.code)
            .includes(currentLanguage.code)
      ),
    };
  }
}
