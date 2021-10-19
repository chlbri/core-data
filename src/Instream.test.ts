import {
  Entity,
  generateAsync3Tests,
  generateReturnData2Tests,
  generateReturnData3Tests,
  generateReturnData4Tests,
  generateReturnData5Tests,
  Login,
  ReturnData,
  sleep,
  WithId,
} from "core_types";
import { InsTreamRepository } from "./Instream";

interface User extends Entity, Login {}

type RDW<T> = ReturnData<WithId<T>>;
type RDWA<T> = ReturnData<WithId<T>[]>;

// #region Dump Users
const user1 = {
  _id: "605b1ce8a3bfb918e0ba54f1",
  login: "all1",
  password: "uno",
};
const user2 = {
  _id: "605b1ce8a3bfb918e0ba54f2",
  login: "log2",
  password: "deux",
};
const user3 = {
  _id: "605b1ce8a3bfb918e0ba54f3",
  login: "alien3",
  password: "trois",
};
const user1W = { login: user1.login, password: user1.password };
const user2W = { login: user2.login, password: user2.password };
const user3W = { login: user3.login, password: user3.password };
// #endregion

const repo = new InsTreamRepository<User>();

// #region Create
describe("Create one element", () => {
  beforeAll(repo.dropCollection);
  afterAll(repo.dropCollection);
  generateAsync3Tests(
    repo.createOne,
    [[user1], [user2], [user3]],
    [
      { status: 200, payload: user1 },
      { status: 200, payload: user2 },
      { status: 200, payload: user3 },
    ],
    true
  );
  it("Collection shlouds contains 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Create many elements", () => {
  beforeAll(repo.dropCollection);
  afterAll(repo.dropCollection);
  it("It shoulds create 3 elements - 1", async () => {
    await repo.createMany([user1, user2, user3]);
  });

  it("It shoulds create 3 elements - 2", async () => {
    await repo.createMany([user1, user2, user3]);
  });

  it("It shoulds create 3 elements - 3", async () => {
    await repo.createMany([user1, user2, user3]);
  });

  it("Collection shlouds contains 9 elements", () => {
    expect(repo.collection.length).toBe(9);
  });
});

describe("Upserting One", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createOne(user1);
  });

  generateAsync3Tests(
    repo.upsertOne,
    [[user1], [user2], [user3]],
    [
      { status: 104, payload: user1 },
      { status: 204, payload: user2 },
      { status: 204, payload: user3 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});
// #endregion

// #region Read & subscribe
describe("Read One", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));

  generateReturnData4Tests(
    repo.readOne,
    [[user3], [{ login: "log2" }], [], [{ login: "nonexists" }]],
    [
      { status: 207, payload: user3W },
      { status: 207, payload: user2W },
      { status: 307, payload: user1W },
      { status: 407 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Read One By Id", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createMany([user1, user2, user3]);
  });

  generateReturnData3Tests(
    repo.readOneById,
    [[user3._id], [user2._id], ["fdkjhfdkl"]],
    [
      { status: 208, payload: user3W },
      { status: 208, payload: user2W },
      { status: 408 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Read Many", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createMany([user1, user2, user3, user3]);
  });

  generateReturnData4Tests(
    repo.readMany,
    [
      [user3],
      [user2],
      [],
      [{ login: "nonexists", password: "nonexists" }],
    ],
    [
      { status: 209, payload: [user3W, user3W] },
      { status: 209, payload: [user2W] },
      { status: 309, payload: [user1W, user2W, user3W, user3W] },
      { status: 409 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(4);
  });
});

describe("Read Many by Ids", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createMany([user1, user2, user3]);
  });

  generateReturnData5Tests(
    repo.readManyByIds,
    [
      [[]],
      [[], {}],
      [["605b1ce8a3bfb918e0ba54f2", "605b1ce8a3bfb918e0ba54f1"]],
      [
        ["605b1ce8a3bfb918e0ba54f2", "605b1ce8a3bfb918e0ba54f1"],
        { login: "all1" },
      ],
      [["not exists"]],
    ],
    [
      { status: 310, payload: [user1W, user2W, user3W] },
      { status: 310, payload: [user1W, user2W, user3W] },
      { status: 210, payload: [user1W, user2W] },
      { status: 210, payload: [user1W] },
      { status: 410 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Count by filter", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createMany([user1, user2, user3]);
  });

  generateAsync3Tests(
    repo.count,
    [[], [{ password: "deux" }], [{ login: "all1" }]],
    [
      { status: 311, payload: 3 },
      { status: 211, payload: 1 },
      { status: 211, payload: 1 },
    ],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Subscribe", () => {
  beforeAll(async () => {
    await repo.dropCollection();
    await repo.createMany([user1, user2, user3]);
  });

  it("It shoulds get the subcriber", async () => {
    const actual = await repo.subscribe({ subscriber: [] });
    const _sub = [...actual];
    expect(actual.length).toBe(0);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(_sub));
    await sleep(500);
    expect(actual.length).toBe(3);
    expect(JSON.stringify(actual)).not.toBe(JSON.stringify(_sub));
    expect(JSON.stringify(actual)).toBe(
      JSON.stringify([user1, user2, user3])
    );
  });

  generateAsync3Tests(
    sleeper(repo.subscribe, 400),
    [
      [{ subscriber: [] }],
      [{ subscriber: [], filter: { login: "all1" } }],
      [{ subscriber: [user3], filter: { password: "uno" } }],
    ],
    [[user1, user2, user3], [user1], [user3, user1]],
    true
  );
  it("The collection shoulds have 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});
// #endregion

// #region Update
describe("Update one element", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));
  generateReturnData4Tests(
    repo.updateOne,
    [
      [user1W, { login: "all11" }],
      [user2W, { password: "two" }],
      [user3W, { login: "log3" }],
      [{ login: "all3" }, {}],
    ],
    [
      { status: 213, payload: { ...user1W, login: "all11" } },
      { status: 213, payload: { ...user2W, password: "two" } },
      { status: 213, payload: { ...user3W, login: "log3" } },
      { status: 313 },
    ],
    true
  );

  generateReturnData4Tests(
    repo.readOne,
    [
      [{ login: "all11" }],
      [{ password: "two" }],
      [{ login: "log3" }],
      [{ login: "all3" }],
    ],
    [
      { status: 207, payload: { ...user1W, login: "all11" } },
      { status: 207, payload: { ...user2W, password: "two" } },
      { status: 207, payload: { ...user3W, login: "log3" } },
      { status: 407 },
    ],
    true
  );
  it("Collection shlouds contains 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Update one element by Id", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));
  generateReturnData4Tests(
    repo.updateOneById,
    [
      [user1._id, { login: "one1" }],
      [user2._id, { password: "deuxdeux" }],
      [user3._id, { login: "email" }],
      ["not exists", {}],
    ],
    [
      { status: 214, payload: { ...user1W, login: "one1" } },
      { status: 214, payload: { ...user2W, password: "deuxdeux" } },
      { status: 214, payload: { ...user3W, login: "email" } },
      { status: 314 },
    ],
    true
  );

  generateReturnData4Tests(
    repo.readOne,
    [
      [{ login: "one1" }],
      [{ password: "deuxdeux" }],
      [{ login: "email" }],
      [{ login: "not exists" }],
    ],
    [
      { status: 207, payload: { ...user1W, login: "one1" } },
      { status: 207, payload: { ...user2W, password: "deuxdeux" } },
      { status: 207, payload: { ...user3W, login: "email" } },
      { status: 407 },
    ],
    true
  );
  it("Collection shlouds contains 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Update many elements", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));
  generateReturnData3Tests(
    repo.updateMany,
    [
      [user1W, user1W],
      [user2W, user1W],
      [{ login: "all3" }, {}],
    ],
    [
      { status: 215, payload: [user1W] },
      { status: 215, payload: [user1W] },
      { status: 315 },
    ],
    true
  );

  generateReturnData4Tests(
    repo.readOne,
    [
      [{ login: user1.login }],
      [{ password: "two" }],
      [{ login: "log3" }],
      [{ password: "trois" }],
    ],
    [
      { status: 207, payload: user1W },
      { status: 407 },
      { status: 407 },
      { status: 207, payload: user3W },
    ],
    true
  );
  it("Collection shlouds contains 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});

describe("Update many elements By Ids", () => {
  beforeEach(repo.dropCollection);
  beforeEach(() => repo.createMany([user1, user2, user3]));
  generateAsync3Tests(
    repo.updateManyByIds,
    [
      [[user1._id, user2._id], user1W],
      [
        [user1._id, user2._id, user3._id],
        user2W,
        { filter: { login: "all1" } },
      ],
      [[user3._id, user2._id, user1._id], user2W, { limit: 2 }],
    ],
    [
      {
        status: 216,
        payload: [
          { _id: user1._id, ...user1W },
          { _id: user2._id, ...user1W },
        ],
      },
      { status: 216, payload: [{ _id: user1._id, ...user2W }] },
      {
        status: 216,
        payload: [
          { _id: user1._id, ...user2W },
          { _id: user2._id, ...user2W },
        ],
      },
    ],
    true
  );

  it("Collection shlouds contains 3 elements", () => {
    expect(repo.collection.length).toBe(3);
  });
});
// #endregion

// #region Delete
describe("Delete One", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));

  generateReturnData4Tests(
    repo.deleteOne,
    [[user3W], [{ login: "log2" }], [], [{ login: "nonexists" }]],
    [
      { status: 217, payload: user3W },
      { status: 217, payload: user2W },
      { status: 317 },
      { status: 417 },
    ],
    true
  );
  it("The collection shoulds have 1 element", () => {
    expect(repo.collection.length).toBe(1);
  });
});

describe("Delete One By Id", () => {
  beforeAll(repo.dropCollection);
  beforeAll(() => repo.createMany([user1, user2, user3]));

  generateReturnData2Tests(
    repo.deleteOneById,
    [[user2._id], ["nonexists"]],
    [{ status: 218, payload: user2W }, { status: 318 }],
    true
  );
  it("The collection shoulds have 2 elements", () => {
    expect(repo.collection.length).toBe(2);
  });
});

describe("Delete Many", () => {
  beforeEach(repo.dropCollection);
  beforeEach(() => repo.createMany([user1, user2, user3]));

  generateReturnData5Tests(
    repo.deleteMany,
    [
      [user3W],
      [{ login: "log2" }],
      [],
      [{ login: "nonexists" }],
      [{}, 2],
    ],
    [
      { status: 219, payload: [user3W] },
      { status: 219, payload: [user2W] },
      { status: 319, payload: [user1W, user2W, user3W] },
      { status: 419 },
      { status: 219, payload: [user1W, user2W] },
    ],
    true
  );
});

describe("Delete Many By Ids", () => {
  beforeEach(repo.dropCollection);
  beforeEach(() => repo.createMany([user1, user2, user3]));

  generateReturnData5Tests(
    repo.deleteManyByIds,
    [
      [[user1._id]],
      [[user1._id, user2._id, user3._id], { limit: 2 }],
      [[user1._id, user2._id, user3._id]],
      [[user2._id, user3._id], { filter: { login: "log2" } }],

      [["notexits"]],
    ],
    [
      { status: 220, payload: [user1W] },
      { status: 220, payload: [user1W, user2W] },
      { status: 220, payload: [user1W, user2W, user3W] },
      { status: 220, payload: [user2W] },
      { status: 320 },
    ],
    true
  );
});
// #endregion

// #region Collection Functions
it("Dropping the collection", async () => {
  await repo.dropCollection();
  expect(repo.collection.length).toBe(0);
});
function sleeper<T extends any[]>(
  func: (...args: T) => Promise<any>,
  milliseconds: number
) {
  return async function (...args: T) {
    const out = await func(...args);
    await sleep(milliseconds);
    return out;
  };
}
// #endregion
