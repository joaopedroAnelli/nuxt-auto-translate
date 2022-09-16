import { BaseOptions as i18nBaseOptions } from '@nuxtjs/i18n';
import googleTranslateApi from '../googleTranslateApi';
import prismaClient from '../client.prisma';
import { ModuleOptions } from '../index';
import LanguagesUpdater from './LanguagesUpdater';
import TranslationService from './TranslationService';
import TranslationCreator from './TranslationCreator';

export default class {
  static build(options: ModuleOptions) {
    return async () => {
      const i18nOptions: i18nBaseOptions = options.i18n;
      const translationService = new TranslationService(prismaClient);
      const languagesUpdater = new LanguagesUpdater(
        prismaClient,
        i18nOptions.locales || []
      );
      const translationCreator = new TranslationCreator(
        prismaClient,
        i18nOptions.defaultLocale || '',
        translationService,
        googleTranslateApi
      );

      await languagesUpdater.update();
      await translationCreator.create();
    };
  }
}
