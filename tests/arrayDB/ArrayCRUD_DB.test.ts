/* eslint-disable @typescript-eslint/no-empty-function */
import { ttestRD } from 'core-test';
import { ArrayCRUD_DB, Entity } from '../../src';
import { checkFileElement, checkProperties, testWrite } from '../config';

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
  function upsertHookMany() {
    const upserts = [
      { _id: 'first', data: { login: 'lewis' } },
      { _id: 'second', data: { login: 'Joel' } },
      { _id: 'third', data: { login: 'Sarah' } },
      { _id: 'fourth', data: { login: 'Keren' } },
    ];
    beforeEach(() => {
      crud.upsertMany({
        upserts,
      });
    });
    afterEach(() => crud.rinitDB());
    return upserts;
  }
  function upsertHookMOne() {
    const upserts = [
      { _id: 'first', data: { login: 'lewis' } },
      { _id: 'second', data: { login: 'Joel' } },
      { _id: 'third', data: { login: 'Sarah' } },
      { _id: 'fourth', data: { login: 'Keren' } },
    ];
    beforeEach(() => {
      crud.upsertMany({
        upserts,
      });
    });
    afterAll(() => crud.rinitDB());
    return upserts;
  }

  function rinitHook() {
    beforeEach(() => crud.rinitDB());
    afterAll(() => crud.rinitDB());
  }

  // #region Create

  describe(createMany, () => {
    rinitHook();

    testWrite({
      func: crud.createMany,
      tests: [
        {
          args: { data: [{ login: 'lewis' }, { login: 'lewis2' }] },
          expected: { status: 210 },
        },
        {
          args: { data: [{ login: 'lewis' }, { login: 'lewis2' }] },
          expected: { status: 210, payload: ['', ''] },
        },
        {
          args: {
            data: [
              { login: 'lewis' },
              { login: 'lewis2' },
              { login: 'lewis3' },
            ],
            options: { limit: 2 },
          },
          expected: { status: 110, payload: ['', ''] },
        },
        {
          args: {
            data: [
              { login: 'lewis' },
              { login: 'lewis2' },
              { login: 'lewis3' },
            ],
          },
          expected: { status: 210, payload: ['', '', ''] },
        },
      ],
    });
  });

  describe(createOne, () => {
    rinitHook();

    testWrite({
      func: crud.createOne,
      tests: [
        {
          args: { data: { login: 'lewis' } },
          expected: { status: 211 },
        },
      ],
    });
  });

  describe(upsertOne, () => {
    upsertHookMOne();
    testWrite({
      func: crud.upsertOne,
      tests: [
        { args: { data: { login: 'lewis' } }, expected: { status: 312 } },
        { args: { data: { login: 'lewis' } }, expected: { status: 312 } },
        { args: { data: { login: 'lewis2' } }, expected: { status: 212 } },
        {
          args: { _id: 'custom', data: { login: 'lewis' } },
          expected: { status: 212 },
        },
        {
          args: { _id: 'custom', data: { login: 'lewis' } },
          expected: { status: 312 },
        },
        {
          args: { _id: 'custom2', data: { login: 'lewis' } },
          expected: { status: 212 },
        },
      ],
    });
  });

  describe(upsertMany, () => {
    upsertHookMany();
    testWrite({
      func: crud.upsertMany,
      tests: [
        {
          args: { upserts: [{ data: { login: 'lewis' } }] },
          expected: { status: 313 },
        },
        {
          args: {
            upserts: [
              { data: { login: 'lewis2' } },
              { data: { login: 'lewis2' } },
            ],
          },
          expected: { status: 313 },
        },
        {
          args: {
            upserts: [
              { _id: 'der', data: { login: 'lewis3' } },
              { _id: 'der2', data: { login: 'lewis4' } },
            ],
          },
          expected: { status: 213 },
        },
        {
          args: {
            upserts: [
              { data: { login: 'lewis13' } },
              { data: { login: 'lewis14' } },
            ],
          },
          expected: { status: 213 },
        },
        {
          args: {
            upserts: [
              { data: { login: 'lewis6' } },
              { data: { login: 'lewis7' } },
            ],
            options: {
              limit: 1,
            },
          },
          expected: { status: 113 },
        },
        {
          args: {
            upserts: [
              { data: { login: 'lewis8' } },
              { data: { login: 'lewis8' } },
              { data: { login: 'lewis8' } },
            ],
            options: {
              limit: 2,
            },
          },
          expected: { status: 313 },
        },
        {
          args: {
            upserts: [
              { _id: 'same', data: { login: 'lewis8' } },
              { _id: 'same', data: { login: 'lewis8' } },
              { data: { login: 'lewis8' } },
            ],
            options: {
              limit: 2,
            },
          },
          expected: { status: 313 },
        },
      ],
    });
  });

  // #endregion

  // #region Read

  describe(readAll, () => {
    createHook();
    ttestRD({
      func: crud.readAll,
      tests: [
        {
          expected: {
            status: 214,
            payload: [
              { login: 'lewis' },
              { login: 'Joel' },
              { login: 'Keren' },
              { login: 'Sarah' },
            ],
          },
        },
        {
          args: { limit: 5 },
          expected: {
            status: 214,
            payload: [
              { login: 'lewis' },
              { login: 'Joel' },
              { login: 'Keren' },
              { login: 'Sarah' },
            ],
          },
        },
        {
          args: { limit: 4 },
          expected: {
            status: 214,
            payload: [
              { login: 'lewis' },
              { login: 'Joel' },
              { login: 'Keren' },
              { login: 'Sarah' },
            ],
          },
        },
        {
          args: { limit: 3 },
          expected: {
            status: 314,
            payload: [
              { login: 'lewis' },
              { login: 'Joel' },
              { login: 'Keren' },
            ],
          },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      ttestRD({
        func: crud.readAll,
        tests: [
          {
            expected: { status: 514 },
          },
        ],
      });
    });
  });

  describe(readMany, () => {
    createHook();
    ttestRD({
      func: crud.readMany,
      tests: [
        {
          args: { filters: { login: { $exists: true } } },
          expected: { status: 215 },
        },
        {
          args: { filters: { login: { $cts: 'e' } } },
          expected: { status: 215 },
        },
        {
          args: { filters: { login: { $cts: 'z' } } },
          expected: { status: 515 },
        },
        {
          args: {
            filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
          },
          expected: { status: 215 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 3 },
          },
          expected: { status: 115 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 4 },
          },
          expected: { status: 215 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 5 },
          },
          expected: { status: 215 },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      ttestRD({
        func: crud.readMany,
        tests: [
          {
            args: {
              filters: { login: { $exists: true } },
              options: { limit: 3 },
            },
            expected: { status: 515 },
          },
        ],
      });
    });
  });

  describe(readManyByIds, () => {
    const upserts = upsertHookMany();
    beforeAll(() => {
      crud.upsertMany({
        upserts,
      });
    });
    afterAll(() => crud.rinitDB());
    ttestRD({
      func: crud.readManyByIds,
      tests: [
        {
          args: { ids: [] },
          expected: { status: 516 },
        },
        {
          args: {
            ids: ['notExist1', 'notExists2'],
          },
          expected: { status: 516 },
        },
        {
          args: {
            ids: ['first', 'third'],
          },
          expected: { status: 216 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
          },
          expected: { status: 216 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'e' } },
          },
          expected: { status: 316 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'z' } },
          },
          expected: { status: 516 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
          },
          expected: { status: 316 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 3 },
          },
          expected: { status: 116 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 4 },
          },
          expected: { status: 216 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
            options: { limit: 4 },
          },
          expected: { status: 316 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
            options: { limit: 2 },
          },
          expected: { status: 116 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            options: { limit: 3 },
          },
          expected: { status: 116 },
        },
      ],
    });
    describe('DB is empty', () => {
      rinitHook()
      ttestRD({
        func: crud.readManyByIds,
        tests: [
          {
            args: {
              ids: upserts.map(upsert => upsert._id),
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
              options: { limit: 2 },
            },
            expected: { status: 516 },
          },
        ],
      });
    });
  });

  describe(readOne, () => {
    createHook();
    ttestRD({
      func: crud.readOne,
      tests: [
        {
          args: { filters: { login: { $exists: true } } },
          expected: { status: 217 },
        },
        {
          args: { filters: { login: { $cts: 'e' } } },
          expected: { status: 217 },
        },
        {
          args: { filters: { login: { $cts: 'z' } } },
          expected: { status: 517 },
        },
        {
          args: {
            filters: { login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] } },
          },
          expected: { status: 217 },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      ttestRD({
        func: crud.readOne,
        tests: [
          {
            args: {
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
            },
            expected: { status: 517 },
          },
        ],
      });
    });
  });

  describe(readOneById, () => {
    upsertHookMany();
    ttestRD({
      func: crud.readOneById,
      tests: [
        {
          args: {
            _id: 'notExist1',
          },
          expected: { status: 518 },
        },
        {
          args: {
            _id: 'first',
          },
          expected: { status: 218 },
        },
        {
          args: {
            _id: 'second',
            filters: { login: { $exists: true } },
          },
          expected: { status: 218 },
        },
        {
          args: {
            _id: 'second',
            filters: { login: { $cts: 'e' } },
          },
          expected: { status: 218 },
        },
        {
          args: {
            _id: 'third',
            filters: { login: { $cts: 'e' } },
          },
          expected: { status: 518 },
        },
        {
          args: {
            _id: 'third',
            filters: { login: { $cts: 'a' } },
          },
          expected: { status: 218 },
        },
        {
          args: {
            _id: 'third',
            filters: { login: { $cts: 'z' } },
          },
          expected: { status: 518 },
        },
        {
          args: {
            _id: 'first',
            filters: { login: { $cts: 'z' } },
          },
          expected: { status: 518 },
        },
        {
          args: {
            _id: 'first',
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
          },
          expected: { status: 218 },
        },
        {
          args: {
            _id: 'notExisted',
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
          },
          expected: { status: 518 },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeEach(() => crud.rinitDB());
      ttestRD({
        func: crud.readOneById,
        tests: [
          {
            args: {
              _id: 'first',
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
            },
            expected: { status: 518 },
          },
        ],
      });
    });
  });

  describe(countAll, () => {
    createHook();
    ttestRD({
      func: crud.countAll,
      tests: [
        {
          expected: { status: 219 },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      ttestRD({
        func: crud.countAll,
        tests: [
          {
            expected: { status: 519 },
          },
        ],
      });
    });
  });

  describe(count, () => {
    createHook();
    ttestRD({
      func: crud.count,
      tests: [
        {
          args: { filters: { login: { $exists: true } } },
          expected: { status: 220 },
        },
        {
          args: { filters: { login: { $cts: 'e' } } },
          expected: { status: 220 },
        },
        {
          args: { filters: { login: { $cts: 'z' } } },
          expected: { status: 520 },
        },
        {
          args: {
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
          },
          expected: { status: 220 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 3 },
          },
          expected: { status: 120 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 4 },
          },
          expected: { status: 220 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            options: { limit: 5 },
          },
          expected: { status: 220 },
        },
      ],
    });
    describe('DB is empty', () => {
      beforeAll(() => crud.rinitDB());
      ttestRD({
        func: crud.count,
        tests: [
          {
            args: {
              filters: { login: { $exists: true } },
              options: { limit: 3 },
            },
            expected: { status: 520 },
          },
        ],
      });
    });
  });

  // #endregion

  // #region Update

  describe(updateAll, () => {
    createHook();
    ttestRD({
      func: crud.updateAll,
      tests: [
        { args: { data: { login: 'same' } }, expected: { status: 221 } },
        {
          args: { data: { login: 'same' }, options: { limit: 3 } },
          expected: { status: 121 },
        },
        { args: { data: { login: 'same' } }, expected: { status: 221 } },
        { args: { data: { login: 'same' } }, expected: { status: 221 } },
      ],
    });
    describe('DB is empty', () => {
      rinitHook();
      ttestRD({
        func: crud.updateAll,
        tests: [
          {
            args: { data: { login: 'same' }, options: { limit: 3 } },
            expected: { status: 521 },
          },
        ],
      });
    });
  });

  describe(updateMany, () => {
    createHook();
    ttestRD({
      func: crud.updateMany,
      tests: [
        {
          args: {
            filters: { login: { $exists: true } },
            data: { login: 'same' },
          },
          expected: { status: 222 },
        },
        {
          args: {
            filters: { login: { $exists: true } },
            data: { login: 'same' },
            options: { limit: 3 },
          },
          expected: { status: 122 },
        },
        {
          args: {
            filters: { login: { $cts: 'z' } },
            data: { login: 'same' },
          },
          expected: { status: 522 },
        },
        {
          args: {
            filters: { login: { $cts: 'e' } },
            data: { login: 'same' },
          },
          expected: { status: 222 },
        },
      ],
    });
    describe('DB is empty', () => {
      rinitHook();
      ttestRD({
        func: crud.updateMany,
        tests: [
          {
            args: {
              filters: { login: { $exists: true } },
              data: { login: 'same' },
              options: { limit: 3 },
            },
            expected: { status: 522 },
          },
        ],
      });
    });
  });

  describe(updateManyByIds, () => {
    const upserts = upsertHookMany();
    const data = { login: 'same' };
    ttestRD({
      func: crud.updateManyByIds,
      tests: [
        {
          args: {
            ids: [],
            data,
          },
          expected: { status: 523 },
        },
        {
          args: {
            ids: ['notExist1', 'notExists2'],
            data,
          },
          expected: { status: 523 },
        },
        {
          args: {
            ids: ['first', 'third'],
            data,
          },
          expected: { status: 223 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            data,
          },
          expected: { status: 223 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'e' } },
            data,
          },
          expected: { status: 323 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $cts: 'z' } },
            data,
          },
          expected: { status: 523 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            data,
          },
          expected: { status: 323 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 3 },
            data,
          },
          expected: { status: 123 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: { login: { $exists: true } },
            options: { limit: 4 },
            data,
          },
          expected: { status: 223 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 4 },
            data,
          },
          expected: { status: 323 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 2 },
            data,
          },
          expected: { status: 123 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            options: { limit: 3 },
            data,
          },
          expected: { status: 123 },
        },
        {
          args: {
            ids: upserts.map(upsert => upsert._id),
            filters: {
              login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
            },
            options: { limit: 3 },
            data,
          },
          expected: { status: 323 },
        },
      ],
    });
    describe('DB is empty', () => {
      rinitHook();
      ttestRD({
        func: crud.updateManyByIds,
        tests: [
          {
            args: {
              ids: upserts.map(upsert => upsert._id),
              filters: {
                login: { $or: [{ $cts: 'z' }, { $cts: 'e' }] },
              },
              options: { limit: 3 },
              data,
            },
            expected: { status: 523 },
          },
        ],
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
