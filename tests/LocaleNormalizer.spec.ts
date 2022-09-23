import { describe, test, expect } from '@jest/globals';
import LocaleNormalizer from '~/services/LocaleNormalizer';

describe('LocaleNormalizer', () => {
  test('should string be { code: <string>, name: <string>}', () => {
    expect(LocaleNormalizer.normalize(['pt'])).toEqual([
      { code: 'pt', name: 'pt' },
    ]);
  });

  test('should object without name to get name = code', () => {
    expect(LocaleNormalizer.normalize([{ code: 'pt' }])).toEqual([
      { code: 'pt', name: 'pt' },
    ]);
  });

  test('should not overide name written by user', () => {
    expect(
      LocaleNormalizer.normalize([{ code: 'pt', name: 'Portuguese' }])
    ).toEqual([{ code: 'pt', name: 'Portuguese' }]);
  });
});
