import { LogLevel } from '~/services/Logger';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NUXT_AUTO_TRANSLATE_LOG_LEVEL: LogLevel;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
