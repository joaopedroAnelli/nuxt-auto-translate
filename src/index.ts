import 'module-alias/register';
import { resolve } from 'node:path';
import { Module } from '@nuxt/types';
import { BaseOptions as I18nOptions } from '@nuxtjs/i18n';
import TranslationsBuilder from './services/TranslationsBuilder';
import ServerInitializer from '~/server/ServerInitializer';
import NuxtAutoTranslateServerApp from '~/server/NuxtAutoTranslateExpress';

export interface ModuleOptions {
  i18n: I18nOptions;
  googleTranslate?: {
    key: string;
    glossary: string[];
  };
  databasePath: string;
}

const translateMessagesModule: Module<ModuleOptions> = function (options) {
  const treatedI18nOptions: I18nOptions = { ...options.i18n };
  // const i18nOptions = this.nuxt.options.modules.find(
  //   (module: [string, object] | string) => Array.isArray(module) && !!module[1]
  // );

  // if (!i18nOptions) {
  //   console.error(
  //     '[nuxt/auto-translate] - nuxt/auto-translate require @nuxtjs/i18n module installed and configured. No i18n options found in Nuxt Options '
  //   );
  //   return;
  // }

  this.options.modules.push(['@nuxtjs/i18n', treatedI18nOptions]);

  this.nuxt.hook('build:before', TranslationsBuilder.build(options));

  this.addPlugin(resolve(__dirname, 'plugins/registerComponent.ts'));

  const app = new ServerInitializer();

  app.init();

  this.addServerMiddleware({
    path: '/nuxt-auto-translate',
    handler: NuxtAutoTranslateServerApp.getInstance(),
  });
};

export default translateMessagesModule;
