import {
  mockDeep,
  mockReset,
  DeepMockProxy,
  MockProxy,
} from 'jest-mock-extended';
import { beforeEach } from '@jest/globals';
import { Translate } from '@google-cloud/translate/build/src/v2';

const googleApi: MockProxy<Translate> = mockDeep<Translate>();

beforeEach(() => {
  mockReset(googleApi);
});

export const googleApiMock = googleApi as unknown as DeepMockProxy<Translate>;
