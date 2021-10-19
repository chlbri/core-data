import {
  generate3Tests,
  generate4Tests,
  generate5Tests,
  SearchOperation,
} from "core_types";
import { inStreamSearchAdapterKey } from "./InStream";
// #region Object
describe("$notexists clause", () => {
  const op: SearchOperation<any> = { $exists: false };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = 2;
  const actual2 = undefined;
  const actual3 = null;
  const actual4 = 1;
  const expected1 = false;
  const expected2 = true;
  const expected3 = true;
  const expected4 = false;
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$exists clause", () => {
  const op: SearchOperation<any> = { $exists: true };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = 2;
  const actual2 = undefined;
  const actual3 = null;
  const actual4 = "eggplant";
  const expected1 = true;
  const expected2 = false;
  const expected3 = false;
  const expected4 = true;
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$equals clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$notequals clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$in clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$nin clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});
// #endregion

// #region Number
describe("$greaterthan clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$greaterthanorequals clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$lessthan clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$lessthanorequals clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$modulo clause", () => {
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
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});
// #endregion

// #region String
describe("$containstring clause", () => {
  const op: SearchOperation<string> = { $cts: "on" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = "ert";
  const actual2 = "mont";
  const actual3 = "montagne";
  const actual4 = "aliase";
  const actual5 = "ok";
  const expected1 = false;
  const expected2 = true;
  const expected3 = true;
  const expected4 = false;
  const expected5 = false;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});

describe("$startswith clause", () => {
  const op: SearchOperation<string> = { $sw: "a" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = "ert";
  const actual2 = "mont";
  const actual3 = "montagne";
  const actual4 = "aliase";
  const actual5 = "ok";
  const expected1 = false;
  const expected2 = false;
  const expected3 = false;
  const expected4 = true;
  const expected5 = false;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});

describe("$endswith clause", () => {
  const op: SearchOperation<string> = { $ew: "e" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = "ert";
  const actual2 = "mont";
  const actual3 = "montagne";
  const actual4 = "aliase";
  const actual5 = "ok";
  const expected1 = false;
  const expected2 = false;
  const expected3 = true;
  const expected4 = true;
  const expected5 = false;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});
// #endregion

// #region Array
describe("$ArrayAll clause", () => {
  const op: SearchOperation<string[]> = { $all: "ok" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = ["ert", "ok"];
  const actual2 = ["mont"];
  const actual3 = ["montagne", "ok"];
  const actual4 = ["aliase"];
  const actual5 = ["ok", "ok"];
  const expected1 = false;
  const expected2 = false;
  const expected3 = false;
  const expected4 = false;
  const expected5 = true;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});

describe("$ArrayElementMatch clause", () => {
  const op: SearchOperation<string[]> = { $em: "ok" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = ["ert", "ok"];
  const actual2 = ["mont"];
  const actual3 = ["montagne", "ok"];
  const actual4 = ["aliase"];
  const actual5 = ["ok", "ok"];
  const expected1 = true;
  const expected2 = false;
  const expected3 = true;
  const expected4 = false;
  const expected5 = true;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});

describe("$ArraySize", () => {
  const op: SearchOperation<string[]> = { $size: 1 };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = ["ert", "ok"];
  const actual2 = ["mont"];
  const actual3 = ["montagne", "ok"];
  const actual4 = ["aliase"];
  const actual5 = ["ok", "ok"];
  const expected1 = false;
  const expected2 = true;
  const expected3 = false;
  const expected4 = true;
  const expected5 = false;
  generate5Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4], [actual5]],
    [expected1, expected2, expected3, expected4, expected5]
  );
});
// #endregion

// #region Logical
describe("AND clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("NOR clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("OR clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});

describe("$NOT clause", () => {
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
  generate4Tests(
    func,
    [[actual1], [actual2], [actual3], [actual4]],
    [expected1, expected2, expected3, expected4]
  );
});
// #endregion

// #region Others
describe("$Else clause", () => {
  const op: SearchOperation<{ key: string }> = { key: "ok" };
  const func = inStreamSearchAdapterKey(op);
  const actual1 = { key: "ok" };
  const actual2 = { key: "nok" };
  const actual3 = { key: "ok", oth: "other" };
  const expected1 = true;
  const expected2 = false;
  const expected3 = true;

  generate3Tests(
    func,
    [[actual1], [actual2], [actual3]],
    [expected1, expected2, expected3]
  );
});
// #endregion
