/* eslint-disable @typescript-eslint/no-empty-function */
import { asyncTest, syncTest } from 'core-test';
import {
  ArrayCRUD_DB,
  inStreamSearchAdapterKey,
} from '../src/adapters/arrayDB';
import { SearchOperation } from '../src/types/dso';
import { Entity } from './../src/entities';

function checkProperty(obj: Record<string, any>, property: string) {
  it(property, () => {
    expect(obj).toHaveProperty(property);
  });
}

function checkProperties(
  obj: Record<string, any>,
  ...properties: string[]
) {
  properties.forEach(prop => checkProperty(obj, prop));
}

function checkFileElement(requirePath: string, request: string) {
  it(`Element (${request}) shoulds exist in path : ${requirePath}`, () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(require(requirePath)).toHaveProperty(request);
  });
}

describe('Clauses', () => {
  // #region Object

  describe('$exists - true clause', () => {
    const op: SearchOperation<any> = { $exists: true };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = undefined;
    const actual3 = null;
    const actual4 = 'eggplant';
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$exists - false clause', () => {
    const op: SearchOperation<any> = { $exists: false };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = undefined;
    const actual3 = null;
    const actual4 = 'eggplant';
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$eq clause', () => {
    const op: SearchOperation<number> = { $eq: 3 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$ne clause', () => {
    const op: SearchOperation<number> = { $ne: 3 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$in clause', () => {
    const op: SearchOperation<number> = { $in: [3, 7] };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$nin clause', () => {
    const op: SearchOperation<number> = { $nin: [3, 7] };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  // #endregion

  // #region Number

  describe('$gt clause', () => {
    const op: SearchOperation<number> = { $gt: 0 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = false;
    const expected2 = false;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$gte clause', () => {
    const op: SearchOperation<number> = { $gte: 0 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$lt clause', () => {
    const op: SearchOperation<number> = { $lt: 0 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$lte clause', () => {
    const op: SearchOperation<number> = { $lte: 0 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = true;
    const expected2 = true;
    const expected3 = false;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$mod clause', () => {
    const op: SearchOperation<number> = { $mod: 2 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 0;
    const actual3 = 16;
    const actual4 = -7;
    const actual5 = 17;
    const expected1 = true;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    const expected5 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  // #endregion

  // #region String

  describe('$cts clause', () => {
    const op: SearchOperation<string> = { $cts: 'on' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 'ert';
    const actual2 = 'mont';
    const actual3 = 'montagne';
    const actual4 = 'aliase';
    const actual5 = 'ok';
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    const expected5 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  describe('$sw clause', () => {
    const op: SearchOperation<string> = { $sw: 'a' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 'ert';
    const actual2 = 'mont';
    const actual3 = 'montagne';
    const actual4 = 'aliase';
    const actual5 = 'ok';
    const expected1 = false;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    const expected5 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  describe('$ew clause', () => {
    const op: SearchOperation<string> = { $ew: 'e' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 'ert';
    const actual2 = 'mont';
    const actual3 = 'montagne';
    const actual4 = 'aliase';
    const actual5 = 'ok';
    const expected1 = false;
    const expected2 = false;
    const expected3 = true;
    const expected4 = true;
    const expected5 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  // #endregion

  // #region Array

  describe('$all clause', () => {
    const op: SearchOperation<string[]> = { $all: 'ok' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = ['ert', 'ok'];
    const actual2 = ['mont'];
    const actual3 = ['montagne', 'ok'];
    const actual4 = ['aliase'];
    const actual5 = ['ok', 'ok'];
    const expected1 = false;
    const expected2 = false;
    const expected3 = false;
    const expected4 = false;
    const expected5 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  describe('$em clause', () => {
    const op: SearchOperation<string[]> = { $em: 'ok' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = ['ert', 'ok'];
    const actual2 = ['mont'];
    const actual3 = ['montagne', 'ok'];
    const actual4 = ['aliase'];
    const actual5 = ['ok', 'ok'];
    const expected1 = true;
    const expected2 = false;
    const expected3 = true;
    const expected4 = false;
    const expected5 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  describe('$size', () => {
    const op: SearchOperation<string[]> = { $size: 1 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = ['ert', 'ok'];
    const actual2 = ['mont'];
    const actual3 = ['montagne', 'ok'];
    const actual4 = ['aliase'];
    const actual5 = ['ok', 'ok'];
    const expected1 = false;
    const expected2 = true;
    const expected3 = false;
    const expected4 = true;
    const expected5 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
      expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
  });

  // #endregion

  // #region Logical

  describe('$and clause', () => {
    const op: SearchOperation<number> = { $and: [1, 1] };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = false;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$nor clause', () => {
    const op: SearchOperation<number> = { $nor: [1, 3] };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = true;
    const expected2 = false;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$or clause', () => {
    const op: SearchOperation<number> = { $or: [1, 7] };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = false;
    const expected2 = false;
    const expected3 = true;
    const expected4 = true;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  describe('$not clause', () => {
    const op: SearchOperation<number> = { $not: 6 };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 6;
    const expected1 = true;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3], [actual4]],
      expecteds: [expected1, expected2, expected3, expected4],
    });
  });

  // #endregion

  // #region Others

  describe('Exact clause', () => {
    const op: SearchOperation<{ key: string }> = { key: 'ok' };
    const func = inStreamSearchAdapterKey(op);
    const actual1 = { key: 'ok' };
    const actual2 = { key: 'nok' };
    const actual3 = { key: 'ok', oth: 'other' };
    const expected1 = true;
    const expected2 = false;
    const expected3 = true;

    syncTest({
      func,
      actuals: [[actual1], [actual2], [actual3]],
      expecteds: [expected1, expected2, expected3],
    });
  });

  // #endregion
});

// #region Class

describe('ArrayCRUD_DB', () => {
  // #region Variables for properties

  // #region Variables

  const createMany = 'createMany';
  const createOne = 'createOne';
  const upsertOne = 'upsertOne';
  const upsertMany = 'upsertMany';
  const readAll = 'readAll';
  const readMany = 'readMany';
  const readManyByIds = 'readManyByIds';
  const readOne = 'readOne';
  const readOneById = 'readOneById';
  const countAll = 'countAll';
  const count = 'count';
  const updateAll = 'updateAll';
  const updateMany = 'updateMany';
  const updateManyByIds = 'updateManyByIds';
  const updateOne = 'updateOne';
  const updateOneById = 'updateOneById';
  const setAll = 'setAll';
  const setMany = 'setMany';
  const setManyByIds = 'setManyByIds';
  const setOne = 'setOne';
  const setOneById = 'setOneById';
  const deleteAll = 'deleteAll';
  const deleteMany = 'deleteMany';
  const deleteManyByIds = 'deleteManyByIds';
  const deleteOne = 'deleteOne';
  const deleteOneById = 'deleteOneById';
  const removeAll = 'removeAll';
  const removeMany = 'removeMany';
  const removeManyByIds = 'removeManyByIds';
  const removeOne = 'removeOne';
  const removeOneById = 'removeOneById';
  const retrieveAll = 'retrieveAll';
  const retrieveMany = 'retrieveMany';
  const retrieveManyByIds = 'retrieveManyByIds';
  const retrieveOne = 'retrieveOne';
  const retrieveOneById = 'retrieveOneById';

  // #endregion

  const PROPERTIES = [
    createMany,
    createOne,
    upsertOne,
    upsertMany,
    readAll,
    readMany,
    readManyByIds,
    readOne,
    readOneById,
    countAll,
    count,
    updateAll,
    updateMany,
    updateManyByIds,
    updateOne,
    updateOneById,
    setAll,
    setMany,
    setManyByIds,
    setOne,
    setOneById,
    deleteAll,
    deleteMany,
    deleteManyByIds,
    deleteOne,
    deleteOneById,
    removeAll,
    removeMany,
    removeManyByIds,
    removeOne,
    removeOneById,
    retrieveAll,
    retrieveMany,
    retrieveManyByIds,
    retrieveOne,
    retrieveOneById,
  ] as const;

  // #endregion

  const crud = new ArrayCRUD_DB<Entity & { login: string }>([], {
    __create: [],
    __read: [],
    __remove: [],
    __write: [],
  });

  describe('Existence', () => {
    checkFileElement('../src/adapters/arrayDB', 'ArrayCRUD_DB');
    describe('Check properties', () => {
      checkProperties(crud, ...PROPERTIES);
    });
  });

  describe('Functions', () => {
    // #region Create

    describe(createMany, () => {
      beforeEach(() => crud.rinitDB());

      asyncTest({
        func: crud.createMany,
        actuals: [
          [{ data: [{ login: 'lewis' }, { login: 'lewis' }] }],
          [
            {
              data: [
                { login: 'lewis' },
                { login: 'lewis' },
                { login: 'lewis' },
              ],
              options: {
                limit: 2,
              },
            },
          ],
        ],
        expecteds: [{}, {}],
        compare: () => {
          return crud.length === 2;
        },
        uuid: true,
      });
    });

    describe(createOne, () => {
      beforeEach(() => crud.rinitDB());
      afterAll(() => crud.rinitDB());

      asyncTest({
        func: crud.createOne,
        actuals: [
          [{ data: { login: 'lewis' } }],
          [{ data: { login: 'lewis' } }],
        ],
        expecteds: [{}, {}],
        compare: () => {
          return crud.length === 1;
        },
        uuid: true,
      });
    });

    describe(upsertOne, () => {
      beforeAll(() => {
        crud.createOne({ data: { login: 'lewis' } });
      });
      afterAll(() => crud.rinitDB());

      asyncTest({
        func: crud.upsertOne,
        actuals: [
          [{ data: { login: 'lewis' } }],
          [{ data: { login: 'lewis' } }],
          [{ data: { login: 'lewis2' } }],
          [{ _id: 'custom', data: { login: 'lewis' } }],
          [{ _id: 'custom', data: { login: 'lewis' } }],
          [{ _id: 'custom2', data: { login: 'lewis' } }],
        ],
        expecteds: [
          312 as any,
          312 as any,
          212 as any,
          212 as any,
          312 as any,
          212 as any,
        ],
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
    });

    describe(upsertMany, () => {
      beforeAll(() => {
        crud.createOne({ data: { login: 'lewis' } });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.upsertMany,
        actuals: [
          [{ upserts: [{ data: { login: 'lewis' } }] }],
          [
            {
              upserts: [
                { data: { login: 'lewis2' } },
                { data: { login: 'lewis2' } },
              ],
            },
          ],
          [
            {
              upserts: [
                { _id: 'der', data: { login: 'lewis3' } },
                { _id: 'der2', data: { login: 'lewis4' } },
              ],
            },
          ],
          [
            {
              upserts: [
                { data: { login: 'lewis13' } },
                { data: { login: 'lewis14' } },
              ],
            },
          ],
          [
            {
              upserts: [
                { data: { login: 'lewis6' } },
                { data: { login: 'lewis7' } },
              ],
              options: {
                limit: 1,
              },
            },
          ],
          [
            {
              upserts: [
                { data: { login: 'lewis8' } },
                { data: { login: 'lewis8' } },
                { data: { login: 'lewis8' } },
              ],
              options: {
                limit: 2,
              },
            },
          ],
          [
            {
              upserts: [
                { _id: 'same', data: { login: 'lewis8' } },
                { _id: 'same', data: { login: 'lewis8' } },
                { data: { login: 'lewis8' } },
              ],
              options: {
                limit: 2,
              },
            },
          ],
        ],
        expecteds: [313, 313, 213, 213, 113, 313, 313] as any[],
        compare: (rec, status) => {
          return rec.status === status;
        },
        uuid: true,
      });
    });

    // #endregion

    // #region Read

    describe(readAll, () => {
      beforeAll(() => {
        crud.createMany({
          data: [
            { login: 'lewis' },
            { login: 'Joel' },
            { login: 'Keren' },
            { login: 'Sarah' },
          ],
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.readAll,
        actuals: [
          [],
          [{ limit: 5 }],
          [{ limit: 4 }],
          [{ limit: 3 }],
          [],
          [],
        ],
        expecteds: [
          214 as any,
          214 as any,
          214 as any,
          314 as any,
          214 as any,
          214 as any,
        ],
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.readAll,
          actuals: [[]],
          expecteds: [514 as any],
          compare: (rec, status) => {
            console.log(crud.length);

            return rec.status === status;
          },
          uuid: true,
        });
      });
    });

    describe(readMany, () => {
      beforeAll(() => {
        crud.createMany({
          data: [
            { login: 'lewis' },
            { login: 'Joel' },
            { login: 'Keren' },
            { login: 'Sarah' },
          ],
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.readMany,
        actuals: [
          [{ filters: { login: { $exists: true } } }],
          [{ filters: { login: { $cts: 'e' } } }],
          [{ filters: { login: { $cts: 'z' } } }],
          [
            {
              filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 3 },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 4 },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 5 },
            },
          ],
        ],
        expecteds: [215, 215, 515, 215, 115, 215, 215] as any[],
        compare: (rec, status) => {
          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.readMany,
          actuals: [
            [
              {
                filters: { login: { $exists: true } },
                options: { limit: 3 },
              },
            ],
          ],
          expecteds: [515] as any,
          compare: (rec, status) => {
            console.log(crud.length);

            return rec.status === status;
          },
          uuid: true,
        });
      });
    });

    describe(readManyByIds, () => {
      const upserts = [
        { _id: 'first', data: { login: 'lewis' } },
        { _id: 'second', data: { login: 'Joel' } },
        { _id: 'third', data: { login: 'Sarah' } },
        { _id: 'fourth', data: { login: 'Keren' } },
      ];
      beforeAll(() => {
        crud.upsertMany({
          upserts,
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.readManyByIds,
        actuals: [
          [
            {
              ids: [],
            },
          ],
          [
            {
              ids: ['notExist1', 'notExists2'],
            },
          ],
          [
            {
              ids: ['first', 'third'],
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $exists: true } },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $cts: 'e' } },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $cts: 'z' } },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $exists: true } },
              options: { limit: 3 },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $exists: true } },
              options: { limit: 4 },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
              options: { limit: 4 },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
              options: { limit: 2 },
            },
          ],
          [
            {
              ids: upserts.map(upsert => upsert._id),
              options: { limit: 3 },
            },
          ],
        ],
        expecteds: [
          516, 516, 216, 216, 316, 516, 316, 116, 216, 316, 116, 116,
        ] as any,
        compare: (rec, status) => {
          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.readManyByIds,
          actuals: [
            [
              {
                ids: upserts.map(upsert => upsert._id),
                filters: {
                  login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
                },
                options: { limit: 2 },
              },
            ],
          ],
          expecteds: [516] as any,
          compare: (rec, status) => rec.status === status,
          uuid: true,
        });
      });
    });

    describe(readOne, () => {
      beforeAll(() => {
        crud.createMany({
          data: [
            { login: 'lewis' },
            { login: 'Joel' },
            { login: 'Keren' },
            { login: 'Sarah' },
          ],
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.readOne,
        actuals: [
          [{ filters: { login: { $exists: true } } }],
          [{ filters: { login: { $cts: 'e' } } }],
          [{ filters: { login: { $cts: 'z' } } }],
          [
            {
              filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
            },
          ],
        ],
        expecteds: [217, 217, 517, 217] as any,
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.readOne,
          actuals: [
            [
              {
                filters: {
                  login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
                },
              },
            ],
          ],
          expecteds: [517] as any,
          compare: (rec, status) => {
            console.log(crud.length);

            return rec.status === status;
          },
          uuid: true,
        });
      });
    });

    describe(readOneById, () => {
      const upserts = [
        { _id: 'first', data: { login: 'lewis' } },
        { _id: 'second', data: { login: 'Joel' } },
        { _id: 'third', data: { login: 'Sarah' } },
        { _id: 'fourth', data: { login: 'Keren' } },
      ];
      beforeAll(() => {
        crud.upsertMany({
          upserts,
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.readOneById,
        actuals: [
          [
            {
              _id: 'notExist1',
            },
          ],
          [
            {
              _id: 'first',
            },
          ],
          [
            {
              _id: 'second',
              filters: { login: { $exists: true } },
            },
          ],
          [
            {
              _id: 'second',
              filters: { login: { $cts: 'e' } },
            },
          ],
          [
            {
              _id: 'third',
              filters: { login: { $cts: 'e' } },
            },
          ],
          [
            {
              _id: 'third',
              filters: { login: { $cts: 'a' } },
            },
          ],
          [
            {
              _id: 'third',
              filters: { login: { $cts: 'z' } },
            },
          ],
          [
            {
              _id: 'first',
              filters: { login: { $cts: 'z' } },
            },
          ],
          [
            {
              _id: 'first',
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
            },
          ],
          [
            {
              _id: 'notExisted',
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
            },
          ],
        ],
        expecteds: [
          518, 218, 218, 218, 518, 218, 518, 518, 218, 518,
        ] as any,
        compare: (rec, status) => {
          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.readManyByIds,
          actuals: [
            [
              {
                ids: upserts.map(upsert => upsert._id),
                filters: {
                  login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
                },
                options: { limit: 2 },
              },
            ],
          ],
          expecteds: [516] as any,
          compare: (rec, status) => rec.status === status,
          uuid: true,
        });
      });
    });

    describe(countAll, () => {
      beforeAll(() => {
        crud.createMany({
          data: [
            { login: 'lewis' },
            { login: 'Joel' },
            { login: 'Keren' },
            { login: 'Sarah' },
          ],
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.countAll,
        actuals: [[]],
        expecteds: [219] as any,
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.countAll,
          actuals: [[]],
          expecteds: [519 as any],
          compare: (rec, status) => {
            console.log(crud.length);

            return rec.status === status;
          },
          uuid: true,
        });
      });
    });

    describe(count, () => {
      beforeAll(() => {
        crud.createMany({
          data: [
            { login: 'lewis' },
            { login: 'Joel' },
            { login: 'Keren' },
            { login: 'Sarah' },
          ],
        });
      });
      afterAll(() => crud.rinitDB());
      asyncTest({
        func: crud.count,
        actuals: [
          [{ filters: { login: { $exists: true } } }],
          [{ filters: { login: { $cts: 'e' } } }],
          [{ filters: { login: { $cts: 'z' } } }],
          [
            {
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 3 },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 4 },
            },
          ],
          [
            {
              filters: { login: { $exists: true } },
              options: { limit: 5 },
            },
          ],
        ],
        expecteds: [220, 220, 520, 220, 120, 220, 220] as any[],
        compare: (rec, status) => {
          return rec.status === status;
        },
        uuid: true,
      });
      describe('DB is empty', () => {
        beforeAll(() => crud.rinitDB());
        asyncTest({
          func: crud.count,
          actuals: [
            [
              {
                filters: { login: { $exists: true } },
                options: { limit: 3 },
              },
            ],
          ],
          expecteds: [520] as any,
          compare: (rec, status) => {
            return rec.status === status;
          },
          uuid: true,
        });
      });
    });

    // #endregion

    // #region Update

    /*TODO*/ describe('updateAll', () => {});
    /*TODO*/ describe('updateMany', () => {});
    /*TODO*/ describe('updateManyByIds', () => {});
    /*TODO*/ describe('updateOne', () => {});
    /*TODO*/ describe('updateOneById', () => {});

    // #endregion

    // #region Set

    /*TODO*/ describe('setAll', () => {});
    /*TODO*/ describe('setMany', () => {});
    /*TODO*/ describe('setManyByIds', () => {});
    /*TODO*/ describe('setOne', () => {});
    /*TODO*/ describe('setOneById', () => {});

    // #endregion

    // #region Delete

    /*TODO*/ describe('deleteAll', () => {});
    /*TODO*/ describe('deleteMany', () => {});
    /*TODO*/ describe('deleteManyByIds', () => {});
    /*TODO*/ describe('deleteOne', () => {});
    /*TODO*/ describe('deleteOneById', () => {});

    // #endregion

    // #region Retrieve

    /*TODO*/ describe('retrieveAll', () => {});
    /*TODO*/ describe('retrieveMany', () => {});
    /*TODO*/ describe('retrieveManyByIds', () => {});
    /*TODO*/ describe('retrieveOne', () => {});
    /*TODO*/ describe('retrieveOneById', () => {});

    // #endregion

    // #region Remove

    /*TODO*/ describe('removeAll', () => {});
    /*TODO*/ describe('removeMany', () => {});
    /*TODO*/ describe('removeManyByIds', () => {});
    /*TODO*/ describe('removeOne', () => {});
    /*TODO*/ describe('removeOneById', () => {});

    // #endregion
  });
});

// #endregion
