/* eslint-disable no-console */
import { expect, describe, test, jest } from '@jest/globals';
import Logger, { LogLevel } from '~/services/Logger';

describe('Logger', () => {
  test('should log a message', () => {
    const message = `From test!`;

    console.info = jest.fn();

    Logger.log(message, LogLevel.On);

    expect(console.info).toHaveBeenCalledWith(
      `[nuxt/auto-translate] - ${message}`
    );
  });
});
