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

describe('#2 => functions', () => {
  describe('#1 => Recompose', () => {
    describe('#1 => URL for coverage', () => {
      const useTests = createTests(recomposeObjectUrl);
      const value = 10;

      useTests(['Empty string', ['', value], {}]);
    });

    describe('#2 => Object', () => {
      const useTests = createTests(recompose);

      useTests(
        ['Empty object', [{}], {}],
        [
          'Object with simple keys',
          [{ age: 10, login: 'login' }],
          { age: 10, login: 'login' },
        ],
        [
          'Object with keys, recursive order 1',
          [{ 'data.age': 10, 'human.login': 'login' }],
          {
            data: {
              age: 10,
            },
            human: {
              login: 'login',
            },
          },
        ],
        [
          'Object with mergeable keys, recursive order 1',
          [{ 'data.age': 10, 'data.login': 'login' }],
          {
            data: {
              age: 10,
              login: 'login',
            },
          },
        ],
        [
          'Object with keys, recursive order 4',
          [
            {
              'db1.collection.entity.data.age': 10,
              'db2.collection.entity.data.login': 'login',
            },
          ],
          {
            db1: {
              collection: {
                entity: {
                  data: {
                    age: 10,
                  },
                },
              },
            },
            db2: {
              collection: {
                entity: {
                  data: {
                    login: 'login',
                  },
                },
              },
            },
          },
        ],
        [
          'Object with mergeable keys, recursive order 4',
          [
            {
              'db1.collection.entity.data.age': 10,
              'db1.collection.entity.data.login': 'login',
              'db1.collection.entity.data.password': 'password',
            },
          ],
          {
            db1: {
              collection: {
                entity: {
                  data: {
                    age: 10,
                    login: 'login',
                    password: 'password',
                  },
                },
              },
            },
          },
        ],
        [
          'Very complex',
          [
            {
              'db1.collection.entity.data.age': 10,
              'db1.collection.entity2.data.login': 'login',
              'db1.collection.entity.data.password': 'password',
              'db3.collection.entity.data.password': 'password',
              'db3.collection.entity.data.login': 'login',
              statistics: 1000,
              'remainData.owner': 'admin',
              id: 'id',
            },
          ],
          {
            db1: {
              collection: {
                entity: {
                  data: {
                    age: 10,
                    password: 'password',
                  },
                },
                entity2: {
                  data: {
                    login: 'login',
                  },
                },
              },
            },
            db3: {
              collection: {
                entity: {
                  data: {
                    password: 'password',
                    login: 'login',
                  },
                },
              },
            },
            statistics: 1000,
            remainData: {
              owner: 'admin',
            },
            id: 'id',
          },
        ],
        [
          'Conflicts',
          [
            {
              statistics: 1000,
              'statistics.owner': 'super',
              'statistics.owner.website': 'www.supper.com',
            },
          ],
          {
            statistics: {
              owner: {
                website: 'www.supper.com',
              },
            },
          },
        ],
      );
    });
  });
});
