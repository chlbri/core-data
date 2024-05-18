import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
  SUPER_ADMIN_ID,
  assignUndefined,
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

describe('#1 => CountAll', () => {
  describe('#0 => Not superAdmin', () => {
    describe('#1 => Actor not exists', async () => {
      testsActorNotExists(
        625,
        () => COLLECTION.countAll('not exists'),
        'Only SuperAdmin can read all data',
      );
    });

    describe('#2 => User exists', async () => {
      testsActorNotExists(
        625,
        () => COLLECTION.countAll(USER1_ID),
        'Only SuperAdmin can read all data',
      );
    });
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(525, () => COLLECTION.countAll(SUPER_ADMIN_ID));
  });

  test('#2 => Add 20 DATA', async () => {
    const seed = generateSeed(20);
    await COLLECTION.__seed(...seed);
  });

  describe('#2 => success', async () => {
    let status = assignUndefined();
    let payload = assignUndefined();

    beforeAll(async () => {
      const rd = await COLLECTION.countAll(SUPER_ADMIN_ID);
      rd.successMap({
        success: (_status, _payload) => {
          status = _status;
          payload = _payload;
        },
      });
    });

    test('#1 => Status is 225', () => {
      expect(status).toBe(225);
    });

    test('#1 => Payload is 20', () => {
      expect(payload).toBe(20);
    });
  });

  afterAll(() => {
    COLLECTION._rinitDB();
  });
});

describe('#1 => Count', () => {
  describe('#0 => Actor not exists', async () => {
    testsActorNotExists(
      626,
      () => COLLECTION.count({ actorID: 'not exists', filters: {} }),
      "This actor (not exists) doesn't exists",
    );
  });

  describe('#1 => DB is empty', async () => {
    testsDBisEmpty(526, () =>
      COLLECTION.count({ actorID: SUPER_ADMIN_ID, filters: {} }),
    );
  });

  test('#2 => Add 20 DATA', async () => {
    const seed = generateSeed(20);
    await COLLECTION.__seed(...seed);
  });

  describe('#3 => success', async () => {
    describe('#1 => Empty filters', () => {
      let status = assignUndefined();
      let payload = assignUndefined();

      beforeAll(async () => {
        const rd = await COLLECTION.count({
          actorID: USER1_ID,
        });
        rd.successMap({
          success: (_status, _payload) => {
            status = _status;
            payload = _payload;
          },
        });
      });

      test('#1 => Status is 226', () => {
        expect(status).toBe(226);
      });

      test('#1 => Payload is 20', () => {
        expect(payload).toBe(20);
      });
    });

    describe('#2 => With filters', () => {
      let status = assignUndefined();
      let payload = assignUndefined();

      beforeAll(async () => {
        const rd = await COLLECTION.count({
          actorID: USER1_ID,
          filters: { age: { $gte: 26 } },
        });
        rd.successMap({
          success: (_status, _payload) => {
            status = _status;
            payload = _payload;
          },
        });
      });

      test('#1 => Status is 226', () => {
        expect(status).toBe(226);
      });

      test('#1 => Payload is 9', () => {
        expect(payload).toBe(9);
      });
    });
  });

  describe('#4 => Request that returns empty', () => {
    testsRequestEmpty(
      326,
      () =>
        COLLECTION.count({
          actorID: USER1_ID,
          filters: { age: 100 },
        }),
      'Query return Empty',
    );
  });
});
