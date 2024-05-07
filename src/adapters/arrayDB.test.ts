import { ReturnData } from '@bemedev/return-data';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { CollectionDB } from './arrayDB';

const SUPER_ADMIN_ID = 'super-admin';

const generateCol1 = () =>
  new CollectionDB({
    _schema: z.object({
      age: z.number(),
    }),
    _actors: [
      {
        actorID: SUPER_ADMIN_ID,
        superAdmin: true,
      },
    ],
    checkPermissions: true,
    permissions: {
      __create: 'create',
      __read: 'read',
      __update: 'update',
      __remove: 'remove',
    },
  });

describe('#1 => Create', () => {
  const col = generateCol1();
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
      return CollectionDB.generateCreate<{ age: number }>(
        SUPER_ADMIN_ID,
        data,
        `existed@${index}`,
      );
    });
  };
  describe('#1 => Cannot create with wrong user', () => {
    test('#1 => CreateOne ', async () => {
      await col.createOne({
        actorID: 'not-admin',
        data: {
          age: 23,
        },
      });
      const rd = await col.createOne({
        actorID: 'simple-user1',
        data: {
          age: 23,
        },
      });

      expect(col.collection.length).toBe(0);
      expect(rd.isServerError).toBe(true);
    });

    test('#1 => CreateMany ', async () => {
      const rd = await col.createMany({
        actorID: 'simple-user2',
        data: generateData(),
      });
      expect(col.collection.length).toBe(0);
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
      const rd = await col.createOne({
        actorID: SUPER_ADMIN_ID,
        data: {
          age: 23,
        },
      });

      expect(col.collection.length).toBe(1);

      const doc1 = col.collection[0];
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
      const rd = await col.createMany({
        actorID: SUPER_ADMIN_ID,
        data: generateData(20),
      });

      expect(col.collection.length).toBe(21);

      expect(rd.isSuccess).toBe(true);
      const result = rd.successMap({
        success: (_, payload) => payload,
      });
      expect(result.length).toBe(20);
    });

    describe('#3 => UpsertMany', () => {
      beforeAll(() => {
        col.rinitDB();
      });

      describe('#1 => UpsertMany with Existed data', () => {
        let rd: ReturnData;
        let result: any;
        const __seed = generateSeed();
        const _id = 'existed@5';
        beforeAll(() => {
          return col.__seed(...__seed);
        });

        test('#0 => Upsert with one id existed', async () => {
          rd = await col.upsertMany({
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
            const valueFromCol = col.collection.find(finder)?.age;
            const valueFromSeed = __seed.find(finder)?.age;

            expect(valueFromCol).toBe(valueFromSeed);
          });
        });
      });

      describe('#2 => UpsertMany with new data', () => {
        beforeAll(() => {
          col.rinitDB();
        });

        test('#0 => the db is empty', () => {
          const len = col.collection.length;
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
            rd = await col.upsertMany({
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
                const check = col.collection.some(
                  data => data._id === _id,
                );
                expect(check).toBe(true);
              },
            );
          });

          test('#3 => the DB returns 10 elements', () => {
            const len = col.collection.length;
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
            rd = await col.upsertMany({
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
              const len = col.collection.length;
              expect(len).toBe(20);
            });

            test('#2 => 10 elements are added', () => {
              const len = results.payload.length;
              expect(len).toBe(10);
            });

            test('#3 => These 10 elements have ID', () => {
              const check = results.payload.every(id => !!id && id !== '');
              expect(check).toBe(true);
            });
          });
        });
      });
    });
  });
});
