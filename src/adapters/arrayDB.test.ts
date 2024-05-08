import { ReturnData } from '@bemedev/return-data';
import { createTests } from '@bemedev/vitest-extended';
import tsd, { formatter } from 'tsd';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { CollectionDB } from './arrayDB';
import { zodDecomposeKeys } from './arrayDB.functions';

test('#0 => types', async () => {
  const _tsd = await tsd({
    cwd: process.cwd(),
    testFiles: ['./src/adapters/arrayDB.test-d.ts'],
    typingsFile: './src/adapters/arrayDB.ts',
  });

  const _fd = formatter(_tsd, true);
  expect(_fd).toBe('');
}, 10000);

describe('#1 => zodDecomposeKeys', () => {
  const useTests = createTests<any>(zodDecomposeKeys);

  useTests(
    ['Empty shape', [{}], []],
    [
      'simple shape',
      [{ age: z.number(), name: z.string() }],
      ['age', 'name'],
    ],
    [
      'complex shape #1, the object is empty',
      [{ age: z.number(), name: z.string(), data: z.object({}) }],
      ['age', 'data', 'name'],
    ],
    [
      'complex shape #2, the object is simple',
      [
        {
          age: z.number(),
          login: z.string(),
          password: z.string(),
          data: z.object({
            firstName: z.string(),
            lastName: z.string(),
            age: z.number(),
          }),
        },
      ],
      [
        'age',
        'data',
        'data.age',
        'data.firstName',
        'data.lastName',
        'login',
        'password',
      ],
    ],
    [
      'complex shape #3, the object is recurscive',
      [
        {
          age: z.number(),
          login: z.string(),
          password: z.string(),
          data: z.object({
            firstName: z.string(),
            lastName: z.string(),
            age: z.number(),
            phoneNumber: z.object({
              country: z.number(),
              number: z.number(),
            }),
          }),
        },
      ],
      [
        'age',
        'data',
        'data.age',
        'data.firstName',
        'data.lastName',
        'data.phoneNumber',
        'data.phoneNumber.country',
        'data.phoneNumber.number',
        'login',
        'password',
      ],
    ],
  );
});

describe('#7 => DB', () => {
  const SUPER_ADMIN_ID = 'super-admin';

  const _schema1 = z.object({
    age: z.number(),
  });

  const permissions1 = {
    __create: 'create',
    __read: 'read',
    __update: 'update',
    __remove: 'remove',
  };

  const COLLECTION = new CollectionDB({
    _schema: _schema1,
    _actors: [
      {
        actorID: SUPER_ADMIN_ID,
        superAdmin: true,
      },
    ],
    checkPermissions: true,
    permissions: permissions1,
  });

  const generateData = (len = 10) => {
    const array = [];
    for (let index = 0; index < len; index++) {
      const data = {
        age: index + 15,
      };
      array.push(data);
    }
    return array;
  };

  const generateSeed = (len = 10) => {
    return generateData(len).map((data, index) => {
      return CollectionDB.generateCreateData<{ age: number }>(
        SUPER_ADMIN_ID,
        data,
        `existed@${index}`,
      );
    });
  };

  describe('#1 => Create', () => {
    describe('#1 => Cannot create with wrong user', () => {
      test('#1 => CreateOne ', async () => {
        await COLLECTION.createOne({
          actorID: 'not-admin',
          data: {
            age: 23,
          },
        });
        const rd = await COLLECTION.createOne({
          actorID: 'simple-user1',
          data: {
            age: 23,
          },
        });

        expect(COLLECTION.collection.length).toBe(0);
        expect(rd.isServerError).toBe(true);
      });

      test('#1 => CreateMany ', async () => {
        const rd = await COLLECTION.createMany({
          actorID: 'simple-user2',
          data: generateData(),
        });
        expect(COLLECTION.collection.length).toBe(0);
        const result = rd.maybeMap({
          else: () => {
            throw 'not';
          },
          server: (_, messages) => messages?.[0],
        });
        expect(result).toBe('This actor cannot create elements');
      });
    });

    describe('#2 => Super admin', () => {
      test('#1 => CreateOne ', async () => {
        const rd = await COLLECTION.createOne({
          actorID: SUPER_ADMIN_ID,
          data: {
            age: 23,
          },
        });

        expect(COLLECTION.collection.length).toBe(1);

        const doc1 = COLLECTION.collection[0];
        expect(doc1._created.by).toBe(SUPER_ADMIN_ID);
        expect(doc1._updated.by).toBe(SUPER_ADMIN_ID);
        expect(doc1._updated.at.getSeconds()).toEqual(
          new Date().getSeconds(),
        );
        expect(doc1._deleted).toBe(false);
        expect(doc1.age).toBe(23);
        expect(rd.isSuccess).toBe(true);
        const result = rd.successMap({
          success: (_, payload) => payload,
        });
        expect(result).toBeTypeOf('string');
      });

      test('#2 => CreateMany ', async () => {
        const rd = await COLLECTION.createMany({
          actorID: SUPER_ADMIN_ID,
          data: generateData(20),
        });

        expect(COLLECTION.collection.length).toBe(21);

        expect(rd.isSuccess).toBe(true);
        const result = rd.successMap({
          success: (_, payload) => payload,
        });
        expect(result.length).toBe(20);
      });

      describe('#3 => UpsertMany', () => {
        beforeAll(() => {
          COLLECTION._rinitDB();
        });

        describe('#1 => UpsertMany with Existed data', () => {
          let rd: ReturnData;
          let result: any;
          const __seed = generateSeed();
          const _id = 'existed@5';
          beforeAll(() => {
            return COLLECTION.__seed(...__seed);
          });

          test('#0 => Upsert with one id existed', async () => {
            rd = await COLLECTION.upsertMany({
              actorID: SUPER_ADMIN_ID,
              upserts: [{ data: generateData(1)[0], _id: __seed[5]._id }],
            });
          });

          test('#1 => The return is a redirect data', () => {
            expect(rd.isRedirect).toBe(true);
            result = rd.maybeMap({
              else: () => {
                throw 'not';
              },
              redirect: (_, payload, messages) => ({
                message: messages?.[0],
                payload: payload?.[0],
              }),
            });
          });

          test('#2 => Check the return message', () => {
            expect(result.message).toBe('1 already exist');
          });

          test('#3 => Check the return payload,', () => {
            expect(result.payload).toBe(_id);
          });

          describe('#4 => The database is not set', () => {
            const finder = (data: { _id: string }) => _id === data._id;

            test('#1 => The age remains same', () => {
              const valueFromCol = COLLECTION.collection.find(finder)?.age;
              const valueFromSeed = __seed.find(finder)?.age;

              expect(valueFromCol).toBe(valueFromSeed);
            });
          });
        });

        describe('#2 => UpsertMany with new data', () => {
          beforeAll(() => {
            COLLECTION._rinitDB();
          });

          test('#0 => the db is empty', () => {
            const len = COLLECTION.collection.length;
            expect(len).toBe(0);
          });

          describe('#1 => With ids', () => {
            const __seed = generateData().map((data, index) => ({
              data,
              _id: `existed${index + 1}`,
            }));
            let results: any;
            let rd: ReturnData;

            test('#0 => Upsert data', async () => {
              rd = await COLLECTION.upsertMany({
                actorID: SUPER_ADMIN_ID,
                upserts: __seed,
              });
            });

            test('#1 => the return is a success', () => {
              expect(rd.isSuccess).toBe(true);
              results = rd.successMap({
                success: (...args) => ({ ...args }),
              });
            });

            describe('#2 => Datas are registered', () => {
              const CASES = __seed.map(({ _id }) => [_id]);

              test.each(CASES)(
                '#%#=> %s is registered inside the DB',
                _id => {
                  const check = COLLECTION.collection.some(
                    data => data._id === _id,
                  );
                  expect(check).toBe(true);
                },
              );
            });

            test('#3 => the DB returns 10 elements', () => {
              const len = COLLECTION.collection.length;
              expect(len).toBe(10);
            });
          });

          describe('#2 => Without ids', () => {
            let rd: ReturnData;
            const __seed = generateData().map(data => ({
              data,
            }));
            let results: { status: number; payload: string[] };

            test('#0 => Upsert data', async () => {
              rd = await COLLECTION.upsertMany({
                actorID: SUPER_ADMIN_ID,
                upserts: __seed,
              });
            });

            test('#1 => the return is a success', () => {
              expect(rd.isSuccess).toBe(true);
              results = rd.successMap({
                success: (status, payload) => ({ status, payload }),
              });
            });

            describe('#2 => Datas are registered', () => {
              test('#1 => Database is set', () => {
                const len = COLLECTION.collection.length;
                expect(len).toBe(20);
              });

              test('#2 => 10 elements are added', () => {
                const len = results.payload.length;
                expect(len).toBe(10);
              });

              test('#3 => These 10 elements have ID', () => {
                const check = results.payload.every(
                  id => !!id && id !== '',
                );
                expect(check).toBe(true);
              });
            });
          });
        });
      });
    });
  });

  describe('#2 => Read', () => {
    beforeAll(() => {
      COLLECTION._rinitDB();
    });

    describe('#1 => ReadAll', () => {
      test('#0 => Not superAdmin', () => {});

      describe('#1 => With Options', () => {
        test('#1 => Options limit data', () => {});
      });
    });
  });
});
