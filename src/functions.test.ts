import tsd, { formatter } from 'tsd';
import { expect, test } from 'vitest';

test('typings', async () => {
  const _tsd = await tsd({
    cwd: process.cwd(),
    testFiles: ['./src/functions.test-d.ts'],
    typingsFile: './src/functions.ts',
  });
  const _fd = formatter(_tsd, true);
  expect(_fd).toBe('');
}, 10000);