"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_test_1 = require("core-test");
const arrayDB_1 = require("../src/adapters/arrayDB");
// #region Object
describe('$exists - true clause', () => {
    const op = { $exists: true };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = undefined;
    const actual3 = null;
    const actual4 = 'eggplant';
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$exists - false clause', () => {
    const op = { $exists: false };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = undefined;
    const actual3 = null;
    const actual4 = 'eggplant';
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$eq clause', () => {
    const op = { $eq: 3 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$ne clause', () => {
    const op = { $ne: 3 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$in clause', () => {
    const op = { $in: [3, 7] };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$nin clause', () => {
    const op = { $nin: [3, 7] };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 3;
    const actual4 = 7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
// #endregion
// #region Number
describe('$gt clause', () => {
    const op = { $gt: 0 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = false;
    const expected2 = false;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$gte clause', () => {
    const op = { $gte: 0 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = false;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$lt clause', () => {
    const op = { $lt: 0 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = true;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$lte clause', () => {
    const op = { $lte: 0 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = -2;
    const actual2 = 0;
    const actual3 = 3;
    const actual4 = -7;
    const expected1 = true;
    const expected2 = true;
    const expected3 = false;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$mod clause', () => {
    const op = { $mod: 2 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
// #endregion
// #region String
describe('$cts clause', () => {
    const op = { $cts: 'on' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
describe('$sw clause', () => {
    const op = { $sw: 'a' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
describe('$ew clause', () => {
    const op = { $ew: 'e' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
// #endregion
// #region Array
describe('$all clause', () => {
    const op = { $all: 'ok' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
describe('$em clause', () => {
    const op = { $em: 'ok' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
describe('$size', () => {
    const op = { $size: 1 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
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
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4], [actual5]],
        expecteds: [expected1, expected2, expected3, expected4, expected5],
    });
});
// #endregion
// #region Logical
describe('$and clause', () => {
    const op = { $and: [1, 1] };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = false;
    const expected2 = false;
    const expected3 = false;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$nor clause', () => {
    const op = { $nor: [1, 3] };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = true;
    const expected2 = false;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$or clause', () => {
    const op = { $or: [1, 7] };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 1;
    const expected1 = false;
    const expected2 = false;
    const expected3 = true;
    const expected4 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
describe('$not clause', () => {
    const op = { $not: 6 };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = 2;
    const actual2 = 3;
    const actual3 = 7;
    const actual4 = 6;
    const expected1 = true;
    const expected2 = true;
    const expected3 = true;
    const expected4 = false;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3], [actual4]],
        expecteds: [expected1, expected2, expected3, expected4],
    });
});
// #endregion
// #region Others
describe('Exact clause', () => {
    const op = { key: 'ok' };
    const func = (0, arrayDB_1.inStreamSearchAdapterKey)(op);
    const actual1 = { key: 'ok' };
    const actual2 = { key: 'nok' };
    const actual3 = { key: 'ok', oth: 'other' };
    const expected1 = true;
    const expected2 = false;
    const expected3 = true;
    (0, core_test_1.syncTest)({
        func,
        actuals: [[actual1], [actual2], [actual3]],
        expecteds: [expected1, expected2, expected3],
    });
});
// #endregion
