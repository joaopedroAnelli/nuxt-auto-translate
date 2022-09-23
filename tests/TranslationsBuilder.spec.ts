import { resolve } from 'node:path';
import {
  test,
  describe,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { MockProxy, mockDeep } from 'jest-mock-extended';
import TranslationsBuilder from '~/services/TranslationsBuilder';
import DatabaseBuilder from '~/services/DatabaseBuilder';
import LanguagesUpdater from '~/services/LanguagesUpdater';
import TranslationCreator from '~/services/TranslationCreator';

describe('TranslationsBuilder', () => {
  let mockLanguagesUpdater: MockProxy<LanguagesUpdater>;
  let mockTranslationCreator: MockProxy<TranslationCreator>;
  const mockBuildDatabase = jest.fn<(path: string) => Promise<void>>();
  let translationBuilder: TranslationsBuilder;

  beforeEach(() => {
    DatabaseBuilder.build = mockBuildDatabase;
    mockLanguagesUpdater = mockDeep<LanguagesUpdater>();
    mockTranslationCreator = mockDeep<TranslationCreator>();
    translationBuilder = new TranslationsBuilder(
      mockLanguagesUpdater,
      mockTranslationCreator
    );
  });

  afterEach(() => {
    mockBuildDatabase.mockClear();
  });

  test('Should call DatabaseBuilder to create db', async () => {
    await translationBuilder.getBuildCallback({
      databasePath: 'test',
      i18n: {},
    })();

    const databaseBuildPath = resolve(process.cwd(), 'test');

    expect(mockBuildDatabase).toHaveBeenCalled();
    expect(mockBuildDatabase).toBeCalledWith(databaseBuildPath);
  });

  test('Should call LanguagesUpdater to update all languages', async () => {
    await translationBuilder.getBuildCallback({
      databasePath: 'test',
      i18n: {},
    })();

    expect(mockLanguagesUpdater.update).toHaveBeenCalled();
  });

  test('Should call TranslationsCreator to create all new translations', async () => {
    await translationBuilder.getBuildCallback({
      databasePath: 'test',
      i18n: {},
    })();

    expect(mockTranslationCreator.create).toHaveBeenCalled();
  });
});
