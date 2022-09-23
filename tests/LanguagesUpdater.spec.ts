import { describe, test, expect, jest } from '@jest/globals';
import LanguagesUpdater from '../src/services/LanguagesUpdater';
import { prismaMock } from './prisma.mock';

describe('LanguagesUpdater', () => {
  test('should create languages', async () => {
    const createLanguage = prismaMock.language.create as jest.MockedFunction<
      typeof prismaMock.language.create
    >;

    const getLanguages = prismaMock.language.findMany as jest.MockedFunction<
      typeof prismaMock.language.findMany
    >;

    createLanguage.mockResolvedValue({
      code: 'c',
      name: 'created',
    });

    getLanguages.mockResolvedValue([]);

    const languagesUpdater = new LanguagesUpdater(prismaMock, ['pt']);

    const updateResponse = await languagesUpdater.update();
    expect(updateResponse).toMatchObject([{ code: 'c', name: 'created' }]);
    expect(createLanguage.mock.calls.length).toBe(1);
    expect(createLanguage.mock.calls[0][0].data).toEqual({
      code: 'pt',
      name: 'pt',
    });
  });

  test('should delete deprecated languages', async () => {
    const deleteLanguage = prismaMock.language.delete as jest.MockedFunction<
      typeof prismaMock.language.delete
    >;

    const getLanguages = prismaMock.language.findMany as jest.MockedFunction<
      typeof prismaMock.language.findMany
    >;

    deleteLanguage.mockResolvedValue({
      code: 'd',
      name: 'deleted',
    });

    getLanguages.mockResolvedValue([
      { code: 'en', name: 'English' },
      { code: 'pt', name: 'Portuguese' },
    ]);

    const languagesUpdater = new LanguagesUpdater(prismaMock, ['pt']);

    const updateResponse = await languagesUpdater.update();
    expect(updateResponse).toMatchObject([{ code: 'd', name: 'deleted' }]);
    expect(deleteLanguage.mock.calls.length).toBe(1);
    expect(deleteLanguage.mock.calls[0][0].where).toEqual({
      code: 'en',
    });
  });

  test('should create new ones, delete old ones and keep unchanged', async () => {
    const createLanguage = prismaMock.language.create as jest.MockedFunction<
      typeof prismaMock.language.create
    >;

    const deleteLanguage = prismaMock.language.delete as jest.MockedFunction<
      typeof prismaMock.language.delete
    >;

    const getLanguages = prismaMock.language.findMany as jest.MockedFunction<
      typeof prismaMock.language.findMany
    >;

    createLanguage.mockResolvedValue({
      code: 'c',
      name: 'created',
    });

    deleteLanguage.mockResolvedValue({
      code: 'd',
      name: 'deleted',
    });

    getLanguages.mockResolvedValue([
      { code: 'pt', name: 'Portuguese' },
      { code: 'en', name: 'English' },
    ]);

    const languagesUpdater = new LanguagesUpdater(prismaMock, ['pt', 'jp']);

    const updateResponse = await languagesUpdater.update();
    expect(updateResponse).toMatchObject([
      { code: 'd', name: 'deleted' },
      { code: 'c', name: 'created' },
    ]);
    expect(createLanguage.mock.calls.length).toBe(1);
    expect(createLanguage.mock.calls[0][0].data).toEqual({
      code: 'jp',
      name: 'jp',
    });
    expect(deleteLanguage.mock.calls.length).toBe(1);
    expect(deleteLanguage.mock.calls[0][0].where).toEqual({ code: 'en' });
  });
});
