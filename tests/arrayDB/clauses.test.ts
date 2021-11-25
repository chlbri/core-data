import { ttest } from 'core-test';
import { inStreamSearchAdapterKey, SearchOperation } from '../../src';

// #region Object

describe('$exists - true clause', () => {
  const op: SearchOperation<any> = { $exists: true };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      {
        args: 2,
        expected: true,
      },
      {
        args: undefined,
        expected: false,
      },
      {
        args: null,
        expected: false,
      },
      {
        args: 'eggplant',
        expected: true,
      },
    ],
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
  const tests = [
    {
      args: actual1,
      expected: expected1,
    },
    {
      args: actual2,
      expected: expected2,
    },
    {
      args: actual3,
      expected: expected3,
    },
    {
      args: actual4,
      expected: expected4,
    },
  ];
  ttest({
    func,
    tests,
  });
});

describe('$eq clause', () => {
  const op: SearchOperation<number> = { $eq: 3 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      {
        args: 2,
        expected: false,
      },
      {
        args: 3,
        expected: true,
      },

      {
        args: 7,
        expected: false,
      },
    ],
  });
});

describe('$ne clause', () => {
  const op: SearchOperation<number> = { $ne: 3 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: true },
      { args: 3, expected: false },
      { args: 7, expected: true },
    ],
  });
});

describe('$in clause', () => {
  const op: SearchOperation<number> = { $in: [3, 7] };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: false },
      { args: 3, expected: true },
      { args: 7, expected: true },
    ],
  });
});

describe('$nin clause', () => {
  const op: SearchOperation<number> = { $nin: [3, 7] };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: true },
      { args: 3, expected: false },
      { args: 7, expected: false },
    ],
  });
});

// #endregion

// #region Number

describe('$gt clause', () => {
  const op: SearchOperation<number> = { $gt: 0 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: -2, expected: false },
      { args: 0, expected: false },
      { args: 3, expected: true },
      { args: -7, expected: false },
    ],
  });
});

describe('$gte clause', () => {
  const op: SearchOperation<number> = { $gte: 0 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: -2, expected: false },
      { args: 0, expected: true },
      { args: 3, expected: true },
      { args: -7, expected: false },
    ],
  });
});

describe('$lt clause', () => {
  const op: SearchOperation<number> = { $lt: 0 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: -2, expected: true },
      { args: 0, expected: false },
      { args: 3, expected: false },
      { args: -7, expected: true },
    ],
  });
});

describe('$lte clause', () => {
  const op: SearchOperation<number> = { $lte: 0 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: -2, expected: true },
      { args: 0, expected: true },
      { args: 3, expected: false },
      { args: -7, expected: true },
    ],
  });
});

describe('$mod clause', () => {
  const op: SearchOperation<number> = { $mod: 2 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: true },
      { args: 0, expected: true },
      { args: 16, expected: true },
      { args: -7, expected: false },
      { args: 17, expected: false },
    ],
  });
});

// #endregion

// #region String

describe('$cts clause', () => {
  const op: SearchOperation<string> = { $cts: 'on' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 'ert', expected: false },
      { args: 'mont', expected: true },
      { args: 'montagne', expected: true },
      { args: 'aliase', expected: false },
      { args: 'ok', expected: false },
    ],
  });
});

describe('$sw clause', () => {
  const op: SearchOperation<string> = { $sw: 'a' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 'ert', expected: false },
      { args: 'mont', expected: false },
      { args: 'montagne', expected: false },
      { args: 'aliase', expected: true },
      { args: 'ok', expected: false },
    ],
  });
});

describe('$ew clause', () => {
  const op: SearchOperation<string> = { $ew: 'e' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 'ert', expected: false },
      { args: 'mont', expected: false },
      { args: 'montagne', expected: true },
      { args: 'aliase', expected: true },
      { args: 'ok', expected: false },
    ],
  });
});

// #endregion

// #region Array

describe('$all clause', () => {
  const op: SearchOperation<string[]> = { $all: 'ok' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: ['ert', 'ok'], expected: false },
      { args: ['mont'], expected: false },
      { args: ['montagne', 'ok'], expected: false },
      { args: ['aliase'], expected: false },
      { args: ['ok', 'ok'], expected: true },
    ],
  });
});

describe('$em clause', () => {
  const op: SearchOperation<string[]> = { $em: 'ok' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: ['ert', 'ok'], expected: true },
      { args: ['mont'], expected: false },
      { args: ['montagne', 'ok'], expected: true },
      { args: ['aliase'], expected: false },
      { args: ['ok', 'ok'], expected: true },
    ],
  });
});

describe('$size', () => {
  const op: SearchOperation<string[]> = { $size: 1 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: ['ert', 'ok'], expected: false },
      { args: ['mont'], expected: true },
      { args: ['montagne', 'ok'], expected: false },
      { args: ['aliase'], expected: true },
      { args: ['ok', 'ok'], expected: false },
    ],
  });
});

// #endregion

// #region Logical

describe('$and clause', () => {
  const op: SearchOperation<number> = { $and: [1, 1] };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: false },
      { args: 3, expected: false },
      { args: 7, expected: false },
      { args: 1, expected: true },
    ],
  });
});

describe('$nor clause', () => {
  const op: SearchOperation<number> = { $nor: [1, 3] };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: true },
      { args: 3, expected: false },
      { args: 7, expected: true },
      { args: 1, expected: false },
    ],
  });
});

describe('$or clause', () => {
  const op: SearchOperation<number> = { $or: [1, 7] };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: false },
      { args: 3, expected: false },
      { args: 7, expected: true },
      { args: 1, expected: true },
    ],
  });
});

describe('$not clause', () => {
  const op: SearchOperation<number> = { $not: 6 };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: 2, expected: true },
      { args: 3, expected: true },
      { args: 7, expected: true },
      { args: 6, expected: false },
    ],
  });
});

// #endregion

// #region Others

describe('Exact clause', () => {
  const op: SearchOperation = { key: 'ok' };
  const func = inStreamSearchAdapterKey(op);

  ttest({
    func,
    tests: [
      { args: { key: 'ok' }, expected: true },
      { args: { key: 'nok' }, expected: false },
      { args: { key: 'ok', oth: 'other' }, expected: true },
    ],
  });
});

// #endregion
