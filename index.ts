import { Module } from '@nuxt/types';
import { BaseOptions as I18nOptions } from '@nuxtjs/i18n';
import TranslationsBuilder from './services/TranslationsBuilder';

export interface ModuleOptions {
  i18n: I18nOptions;
  googleTranslate?: {
    key: string;
    glossary: string[];
  };
}

const translateMessagesModule: Module<ModuleOptions> = function (options) {
  const i18nOptions = this.nuxt.options.modules.find(
    (module: [string, object] | string) => Array.isArray(module) && !!module[1]
  );

  if (!i18nOptions) {
    console.error(
      '[nuxt/auto-translate] - nuxt/auto-translate require @nuxtjs/i18n module installed and configured. No i18n options found in Nuxt Options '
    );
    return;
  }

  this.nuxt.hook('build:before', TranslationsBuilder.build(options));

  // addServerMiddleware({
  //   path: '/api',
  //   handler: serverMiddleware,
  // });
};

export default translateMessagesModule;
