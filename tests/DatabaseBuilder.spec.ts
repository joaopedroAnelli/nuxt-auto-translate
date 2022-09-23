import {
  access,
  constants,
  rmSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test, afterAll } from '@jest/globals';
import DatabaseBuilder from '~/services/DatabaseBuilder';

describe('DatabaseBuilder', () => {
  afterAll(() => {
    rmSync(resolve(__dirname, 'tmp'), {
      recursive: true,
      force: true,
    });
  });

  test('should create a db file in path', async () => {
    const path = resolve(__dirname, 'tmp', 'translations.db');

    await DatabaseBuilder.build(path);

    const exists = await new Promise<boolean>((resolve) => {
      access(path, constants.R_OK, (err) => {
        resolve(!err);
      });
    });

    expect(exists).toBeTruthy();
  }, 10000);

  test('should do nothing when db already exists', async () => {
    const path = resolve(__dirname, 'tmp', 'exists.db');

    const fixedContent = "I'm Real";

    writeFileSync(path, fixedContent);

    await DatabaseBuilder.build(path);

    const exists = await new Promise<boolean>((resolve) => {
      access(path, constants.R_OK, (err) => {
        resolve(!err);
      });
    });

    expect(exists).toBeTruthy();
    expect(readFileSync(path, { encoding: 'utf8' })).toBe(fixedContent);
  });

  test('should return nothing when everything is ok', async () => {
    const path = resolve(__dirname, 'tmp', 'translations.db');

    const nothing = await DatabaseBuilder.build(path);

    expect(nothing).toBeUndefined();
  });

  test('should explode when path is invalid', async () => {
    const path = 'MyCr4zinéss/P4th*/\\ç';

    await expect(DatabaseBuilder.build(path)).rejects.toThrow();
  });
});
