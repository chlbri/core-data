import tsd, { formatter } from 'tsd';
import { expect, test } from 'vitest';

test('#1 => typings', async () => {
  const _tsd = await tsd({
    cwd: process.cwd(),
    testFiles: ['./src/types/repo.test-d.ts'],
    typingsFile: './src/types/repo.ts',
  });
  const _fd = formatter(_tsd);
  expect(_fd).toBe('');
}, 10000);
