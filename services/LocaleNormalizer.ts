import { LocaleObject, Locale } from '@nuxtjs/i18n';

export interface AutoTranslateLocaleObject extends LocaleObject {
  name: string;
}

export default class LocaleNormalizer {
  static normalize(
    locales: LocaleObject[] | Locale[]
  ): AutoTranslateLocaleObject[] {
    return locales.map((locale: LocaleObject | Locale) => {
      if (typeof locale === 'string') {
        return {
          code: locale,
          name: locale,
        };
      }

      return { name: locale.code, ...locale };
    });
  }
}
