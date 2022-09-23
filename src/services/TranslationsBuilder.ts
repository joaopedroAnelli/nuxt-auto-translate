import { resolve } from 'node:path';
import DatabaseBuilder from './DatabaseBuilder';
import LanguagesUpdater from './LanguagesUpdater';
import TranslationCreator from './TranslationCreator';
import { ModuleOptions } from '~/index';

class TranslationsBuilder {
  languagesUpdater: LanguagesUpdater;
  translationCreator: TranslationCreator;

  constructor(
    languagesUpdater: LanguagesUpdater,
    translationCreator: TranslationCreator
  ) {
    this.languagesUpdater = languagesUpdater;
    this.translationCreator = translationCreator;
  }

  getBuildCallback(options: ModuleOptions) {
    return async () => {
      const databaseRelativePath = resolve(process.cwd(), options.databasePath);

      await DatabaseBuilder.build(databaseRelativePath);

      await this.languagesUpdater.update();

      await this.translationCreator.create();
    };
  }
}

export default TranslationsBuilder;
