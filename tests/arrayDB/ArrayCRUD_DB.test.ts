/* eslint-disable @typescript-eslint/no-empty-function */

import { asyncTest } from 'core-test';
import { ArrayCRUD_DB, Entity } from '../../src';
import { checkFileElement, checkProperties } from '../config';

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
  function createHook() {
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
  }
  function upsertForReadHook() {
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
    return upserts;
  }

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
    const upserts = upsertForReadHook();
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
      expecteds: [518, 218, 218, 218, 518, 218, 518, 518, 218, 518] as any,
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

  describe(updateAll, () => {
    createHook();
    asyncTest({
      func: crud.updateAll,
      actuals: [
        [{ data: { login: 'same' } }],
        [{ data: { login: 'same' }, options: { limit: 3 } }],
        [{ data: { login: 'same' } }],
        [{ data: { login: 'same' } }],
      ],
      expecteds: [221, 121, 221, 221] as any,
      compare: (rec, status) => {
        return rec.status === status;
      },
      uuid: true,
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      asyncTest({
        func: crud.updateAll,
        actuals: [[{ data: { login: 'same' } }]],
        expecteds: [521] as any,
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
    });
  });

  describe(updateMany, () => {
    createHook();
    asyncTest({
      func: crud.updateMany,
      actuals: [
        [
          {
            filters: { login: { $exists: true } },
            data: { login: 'same' },
          },
        ],
        [
          {
            filters: { login: { $exists: true } },
            data: { login: 'same' },
            options: { limit: 3 },
          },
        ],
        [
          {
            filters: { login: { $cts: 'z' } },
            data: { login: 'same' },
          },
        ],
        [
          {
            filters: { login: { $cts: 'e' } },
            data: { login: 'same' },
          },
        ],
      ],
      expecteds: [222, 122, 522, 222] as any,
      compare: (rec, status) => {
        return rec.status === status;
      },
      uuid: true,
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      asyncTest({
        func: crud.updateMany,
        actuals: [
          [
            {
              filters: { login: { $exists: true } },
              data: { login: 'same' },
              options: { limit: 3 },
            },
          ],
        ],
        expecteds: [522] as any,
        compare: (rec, status) => {
          console.log(crud.length);

          return rec.status === status;
        },
        uuid: true,
      });
    });
  });

  /*TODO*/ describe(updateManyByIds, () => {
    const upserts = [
      { _id: 'first', data: { login: 'lewis' } },
      { _id: 'second', data: { login: 'Joel' } },
      { _id: 'third', data: { login: 'Sarah' } },
      { _id: 'fourth', data: { login: 'Keren' } },
    ];

    beforeEach(() => {
      crud.rinitDB();
      crud.upsertMany({
        upserts,
      });
    });
    afterAll(() => crud.rinitDB());
    const data = { login: 'same' };
    asyncTest({
      func: crud.updateManyByIds,
      actuals: [
        [
          {
            ids: [],
            data,
          },
        ],
        [
          {
            ids: ['notExist1', 'notExists2'],
            data,
          },
        ],
        [
          {
            ids: ['first', 'third'],
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'e' } },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'z' } },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 3 },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 4 },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 4 },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 2 },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            options: { limit: 3 },
            data,
          },
        ],
        [
          {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 3 },
            data,
          },
        ],
      ],
      expecteds: [
        523, 523, 223, 223, 323, 523, 323, 123, 223, 323, 123, 123, 323,
      ] as any,
      compare: (rec, status) => rec.status === status,
      uuid: true,
    });
    describe('DB is empty', () => {
      beforeEach(() => crud.rinitDB());
      asyncTest({
        func: crud.updateManyByIds,
        actuals: [
          [
            {
              ids: upserts.map(upsert => upsert._id),
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
              options: { limit: 2 },
              data,
            },
          ],
        ],
        expecteds: [523] as any,
        compare: (rec, status) => {
          console.log(crud.length);
          return rec.status === status;
        },
        uuid: true,
      });
    });
  });
  /*TODO*/ describe(updateOne, () => {});
  /*TODO*/ describe(updateOneById, () => {});

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
