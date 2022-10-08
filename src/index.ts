import 'module-alias/register';
import { resolve } from 'node:path';
import { Module } from '@nuxt/types';
import { BaseOptions as I18nOptions } from '@nuxtjs/i18n';
import TranslationsBuilder from './services/TranslationsBuilder';
import ServerInitializer from '~/server/ServerInitializer';
import NuxtAutoTranslateServerApp from '~/server/NuxtAutoTranslateExpress';
import LanguagesUpdater from '~/services/LanguagesUpdater';
import prisma from '~/prisma.client';
import TranslationCreator from '~/services/TranslationCreator';
import TranslationService from '~/services/TranslationService';
import googleTranslateApi from '~/googleTranslateApi';

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

  this.options.modules.push(['@nuxtjs/i18n', treatedI18nOptions]);

  const languagesUpdater = new LanguagesUpdater(
    prisma,
    treatedI18nOptions.locales || []
  );

  const translationService = new TranslationService(prisma);

  const translationCreator = new TranslationCreator(
    prisma,
    treatedI18nOptions.defaultLocale || 'en',
    translationService,
    googleTranslateApi
  );

  const translationsBuilder = new TranslationsBuilder(
    languagesUpdater,
    translationCreator
  );

  this.nuxt.hook('build:before', translationsBuilder.getBuildCallback(options));

  this.addPlugin(resolve(__dirname, 'plugins/registerComponent.ts'));

  const app = new ServerInitializer();

  app.init();

  this.addServerMiddleware({
    path: '/nuxt-auto-translate',
    handler: NuxtAutoTranslateServerApp.getInstance(),
  });
};

export default translateMessagesModule;
