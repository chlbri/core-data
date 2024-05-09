import { createTests } from '@bemedev/vitest-extended';
import tsd, { formatter } from 'tsd';
import { describe, expect, test } from 'vitest';
import { recompose, recomposeObjectUrl } from './entities.functions';

test('#0 => types', async () => {
  const _tsd = await tsd({
    cwd: process.cwd(),
    testFiles: ['./src/entities.test-d.ts'],
    typingsFile: './src/entities.ts',
  });
  const _fd = formatter(_tsd, true);
  expect(_fd).toBe('');
}, 10000);


