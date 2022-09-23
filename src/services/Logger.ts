/* eslint-disable no-console */
export enum LogLevel {
  Off = 'off',
  On = 'on',
}
export default class Logger {
  static log(message: string, logLevelParam: LogLevel = LogLevel.Off): void {
    let logLevel: LogLevel = process.env.NUXT_AUTO_TRANSLATE_LOG_LEVEL;

    if (logLevelParam) {
      logLevel = logLevelParam;
    }

    if (logLevel === LogLevel.On) {
      console.info(`[nuxt/auto-translate] - ${message}`);
    }
  }
}
