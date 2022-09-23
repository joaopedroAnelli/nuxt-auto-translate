import { resolve } from 'path';
import { exec } from 'child_process';

const url = resolve(__dirname, '../coverage/lcov-report/index.html');
const start =
  process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
    ? 'start'
    : 'xdg-open';
exec(`${start} ${url}`);
