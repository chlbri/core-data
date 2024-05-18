import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
  SUPER_ADMIN_ID,
  generateSeed,
  testColl,
  testsActorNotExists,
  testsDBisEmpty,
  testsRequestEmpty,
} from './arrayDB.fixtures';

const USER1_ID = 'user1';

const COLLECTION = testColl({
  actorID: USER1_ID,
  permissions: ['read'],
  privateKey: 'privateUser1',
});

describe('#1 => ReadAll', () => {
  afterAll(() => {
    COLLECTION._rinitDB();
  });

  describe('#0 => Not superAdmin', () => {
    describe('#1 => Actor not exists', async () => {
      testsActorNotExists(
        620,
        () => COLLECTION.readAll('not exists'),
        'Only SuperAdmin can read all data',
      );
    });

    describe('#2 => User exists', async () => {
      testsActorNotExists(
        620,
        () => COLLECTION.readAll(USER1_ID),
        'Only SuperAdmin can read all data',
      );
    });
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(520, () => COLLECTION.readAll(SUPER_ADMIN_ID));
  });

  describe('#2 => Workflows', () => {
    test('#0 => Add 20 DATA', async () => {
      const seed = generateSeed(20);
      await COLLECTION.__seed(...seed);
    });

    describe('#1 => With Options', () => {
      test('#1 => Limit exceed data available', async () => {
        const rd = await COLLECTION.readAll(SUPER_ADMIN_ID, {
          limit: 50,
        });
        rd.maybeMap({
          else: () => {
            throw 'not defined';
          },
          redirect: (status, payload, messages) => {
            const len = payload?.length;

            expect(status).toBe(320);
            expect(len).toBe(20);
            expect(messages?.[0]).toBe('Limit exceed data available');
          },
        });
      });

      test('#2 => Limit not exceed data available', async () => {
        const rd = await COLLECTION.readAll(SUPER_ADMIN_ID, {
          limit: 10,
        });
        rd.successMap({
          success: (status, payload) => {
            const len = payload?.length;

            expect(status).toBe(220);
            expect(len).toBe(10);
          },
        });
      });

      test('#3 => With Projection #1', async () => {
        const rd = await COLLECTION.readAll(SUPER_ADMIN_ID, {
          limit: 10,
          projection: ['age'],
        });

        rd.successMap({
          success: (_, payload) => {
            return payload.forEach(data => {
              const keys = Object.keys(data);
              expect(keys.length).toBe(1);
              expect(keys[0]).toBe('age');
            });
          },
        });
      });

      test('#4 => With Projection and limit is reached', async () => {
        const rd = await COLLECTION.readAll(SUPER_ADMIN_ID, {
          limit: 50,
          projection: ['_id'],
        });

        rd.maybeMap({
          redirect: (_, payload, messages) => {
            payload?.forEach(data => {
              const keys = Object.keys(data);
              expect(keys.length).toBe(1);
              expect(keys[0]).toBe('_id');
            });
            expect(messages?.[0]).toBe('Limit exceed data available');
          },
          else: () => {
            throw 'not defined';
          },
        });
      });
    });

    test('#2 => Without options', async () => {
      const rd = await COLLECTION.readAll(SUPER_ADMIN_ID);

      rd.successMap({
        success: (status, payload) => {
          expect(status).toBe(220);
          expect(payload.length).toBe(20);
          payload.forEach(({ _id }) => {
            expect(_id).toContain('existed@');
          });
        },
      });
    });
  });
});

describe('#2 => ReadMany', () => {
  beforeAll(() => {
    COLLECTION._rinitDB();
  });

  afterAll(() => {
    COLLECTION._rinitDB();
  });

  describe('#0 => Actor not exists', async () => {
    testsActorNotExists(
      621,
      () =>
        COLLECTION.readMany({
          actorID: 'not exists',
          filters: {},
        }),
      "This actor (not exists) doesn't exists",
    );
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(521, () =>
      COLLECTION.readMany({
        actorID: USER1_ID,
        filters: {},
      }),
    );
  });

  describe('#2 => Workflows', () => {
    test('#0 => Add 20 DATA', async () => {
      const seed = generateSeed(20);
      await COLLECTION.__seed(...seed);
    });

    describe('#1 => Request that returns empty', async () => {
      testsRequestEmpty(
        321,
        () =>
          COLLECTION.readMany({
            actorID: USER1_ID,
            filters: { age: { $lt: 12 } },
          }),
        'Query return Empty',
      );
    });

    test('#2 => success', async () => {
      const rd = await COLLECTION.readMany({
        actorID: USER1_ID,
        filters: { age: { $gt: 32 } },
      });

      rd.successMap({
        success: (status, payload) => {
          expect(status).toBe(221);
          expect(payload.length).toBe(2);
        },
      });
    });
  });
});

describe('#3 => ReadManyByIds', () => {
  beforeAll(() => {
    COLLECTION._rinitDB();
  });

  afterAll(() => {
    COLLECTION._rinitDB();
  });

  describe('#0 => Actor not exists', async () => {
    testsActorNotExists(
      622,
      () =>
        COLLECTION.readManyByIds({
          actorID: 'not exists',
          ids: [],
        }),
      "This actor (not exists) doesn't exists",
    );
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(522, () =>
      COLLECTION.readManyByIds({
        actorID: USER1_ID,
        ids: [],
      }),
    );
  });

  describe('#2 => Workflows', () => {
    test('#0 => Add 20 DATA', async () => {
      const seed = generateSeed(20);
      await COLLECTION.__seed(...seed);
    });

    describe('#1 => Request that returns empty', () => {
      testsRequestEmpty(
        322,
        () =>
          COLLECTION.readManyByIds({
            actorID: USER1_ID,
            ids: [],
          }),
        'Query return Empty',
      );
    });

    test('#2 => success', async () => {
      const rd = await COLLECTION.readManyByIds({
        actorID: USER1_ID,
        ids: ['existed@18'],
      });

      rd.successMap({
        success: (status, payload) => {
          expect(status).toBe(222);
          expect(payload.length).toBe(1);
        },
      });
    });
  });
});

describe('#4 => ReadOne', () => {
  // #region Config
  beforeAll(() => {
    COLLECTION._rinitDB();
  });

  afterAll(() => {
    COLLECTION._rinitDB();
  });
  // #endregion

  describe('#0 => Actor not exists', async () => {
    testsActorNotExists(
      623,
      () =>
        COLLECTION.readOne({
          actorID: 'not exists',
          filters: {},
        }),
      "This actor (not exists) doesn't exists",
    );
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(523, () =>
      COLLECTION.readOne({
        actorID: USER1_ID,
        filters: {},
      }),
    );
  });

  describe('#2 => Workflows', () => {
    test('#0 => Add 20 DATA', async () => {
      const seed = generateSeed(20);
      await COLLECTION.__seed(...seed);
    });

    describe('#1 => Request that returns empty', () => {
      testsRequestEmpty(
        323,
        () =>
          COLLECTION.readOne({
            actorID: USER1_ID,
            filters: { age: 100 },
          }),
        'Not found',
      );
    });

    test('#2 => success', async () => {
      const rd = await COLLECTION.readOne({
        actorID: USER1_ID,
        filters: { age: 18 },
      });

      rd.successMap({
        success: (status, { _id, age }) => {
          expect(status).toBe(223);
          expect(age).toBe(18);
          expect(_id).toBe('existed@3');
        },
      });
    });
  });
});

describe('#5 => ReadOneById', () => {
  // #region Config
  beforeAll(() => {
    COLLECTION._rinitDB();
  });

  afterAll(() => {
    COLLECTION._rinitDB();
  });
  // #endregion

  describe('#0 => Actor not exists', async () => {
    testsActorNotExists(
      624,
      () =>
        COLLECTION.readOneById({
          actorID: 'not exists',
          id: '',
        }),
      "This actor (not exists) doesn't exists",
    );
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(524, () =>
      COLLECTION.readOneById({
        actorID: USER1_ID,
        id: '',
      }),
    );
  });

  describe('#2 => Workflows', () => {
    test('#0 => Add 20 DATA', async () => {
      const seed = generateSeed(20);
      await COLLECTION.__seed(...seed);
    });

    describe('#1 => Request that returns empty', () => {
      testsRequestEmpty(
        324,
        () =>
          COLLECTION.readOneById({
            actorID: USER1_ID,
            id: 'not',
          }),
        'Not found',
      );
    });

    test('#2 => success', async () => {
      const rd = await COLLECTION.readOneById({
        actorID: USER1_ID,
        id: 'existed@3',
      });

      rd.successMap({
        success: (status, { _id, age }) => {
          expect(status).toBe(224);
          expect(age).toBe(18);
          expect(_id).toBe('existed@3');
        },
      });
    });
  });
});
