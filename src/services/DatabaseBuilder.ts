import { exec } from 'node:child_process';
import { access } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import Logger from './Logger';

export default class DatabaseBuilder {
  static async build(path: string): Promise<void> {
    const exists = await new Promise<boolean>((resolve) => {
      access(path, (err) => {
        resolve(!err);
      });
    });

    if (exists) {
      return;
    }

    const schemaFolder = resolvePath(__dirname, '..', 'prisma');

    const parsedPath = path.replaceAll(
      '\\',
      Buffer.from('/').toString('ascii')
    );
    const schemaPrisma = resolvePath(schemaFolder, 'schema.prisma');

    Logger.log(`Creating translations db`);
    return new Promise((resolve, reject) => {
      exec(
        `npx dotenv -v DATABASE_URL=file:${parsedPath} -- npx prisma migrate dev --schema ${schemaPrisma}`,
        (exception) => {
          if (exception) reject(exception);

          resolve();
        }
      );
    });
  }
}
