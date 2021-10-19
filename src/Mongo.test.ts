import {
  Entity,
  generateAsync3Tests,
  generateAsync4Tests,
  generateAsync5Tests,
  Login,
  sleep,
  TupleOf,
} from "core_types";
import { MongoClient } from "mongodb";
import { MongoRepository } from "./Mongo";

// #region Configurations
interface User extends Entity, Login {}

const DB = "mongodb://127.0.0.1:27017/toto";
const col = "element";

const repo = new MongoRepository<User>(DB, col);

// #region Helper Functions
async function dropCol() {
  const cl = new MongoClient(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await cl.connect();
  const db = cl.db();
  const cols = (await db.collections()).map(
    (collection) => collection.collectionName
  );
  if (cols.includes(col)) await cl.db().dropCollection(col);
  await cl.close();
}

async function createCol() {
  const cl = new MongoClient(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await cl.connect();
  const db = cl.db();
  const cols = (await db.collections()).map(
    (collection) => collection.collectionName
  );
  if (!cols.includes(col)) await cl.db().createCollection(col);
  await cl.close();
}

function useReadConfig() {
  // #region Dump Users
  const user = {
    _id: "605b1ce8a3bfb918e0ba54f1",
    login: "all",
    password: "gfgf",
  };
  const user2 = {
    _id: "605b1ce8a3bfb918e0ba54f2",
    login: "all",
    password: "gfgf",
  };
  const user3 = {
    _id: "605b1ce8a3bfb918e0ba54f3",
    login: "all3",
    password: "gfgf",
  };
  // #endregion
  beforeAll(repo.dropCollection);

  beforeAll(async () => {
    await repo.upsertOne(user);
    await repo.upsertOne(user2);
    await repo.upsertOne(user3);
  });
  afterAll(repo.dropCollection);
  return { user, user2, user3 } as const;
}

function useUpdateConfig() {
  // #region Dump Users
  const user = {
    _id: "605b1ce8a3bfb918e0ba54f1",
    login: "all",
    password: "gfZE",
  };
  const user2 = {
    _id: "605b1ce8a3bfb918e0ba54f2",
    login: "all",
    password: "3fgf",
  };
  const user3 = {
    _id: "605b1ce8a3bfb918e0ba54f3",
    login: "all3",
    password: "45gf",
  };
  // #endregion
  beforeAll(repo.dropCollection);

  beforeEach(async () => {
    await repo.upsertOne(user);
    await repo.upsertOne(user2);
    await repo.upsertOne(user3);
  });

  afterEach(repo.dropCollection);
  return { user, user2, user3 } as const;
}
// #endregion
// #endregion

// #region Create
describe("Create one element", () => {
  const spy = jest.spyOn(repo, "createOne");
  beforeAll(() => spy.mockClear());
  beforeAll(repo.dropCollection);
  afterAll(repo.dropCollection);
  describe("Connected to database", () => {
    it("Create user 1", async () => {
      const user = {
        _id: "605b1ce8a3bfb918e0ba54f7",
        login: "all",
        password: "gfgf",
      };
      const actual = await repo.createOne(user);
      expect(actual.status).toBe(200);
      if (actual.status === 200) {
        expect(actual.payload.login).toBe(user.login);
        expect(actual.payload.password).toBe(user.password);
        expect(actual.payload._id).toBe(user._id);
      }
    });

    it("Create user 2", async () => {
      const user: User = { login: "all", password: "gfgf" };
      const actual = await repo.createOne(user);
      expect(actual.status).toBe(200);
      if (actual.status === 200) {
        expect(actual.payload.login).toBe(user.login);
        expect(actual.payload.password).toBe(user.password);
        expect(actual.payload._id.length).toBe(24);
      }
    });

    it("La fonction a été appelé 2 fois", () => {
      expect(spy).toBeCalledTimes(2);
    });
  });
});

describe("Create many elements", () => {
  const spy = jest.spyOn(repo, "createMany");
  const mapper = ({ login, password }: User) => ({ login, password });
  beforeAll(() => spy.mockClear());
  describe("Connected to database", () => {
    const counter = 10;
    it("Create users", async () => {
      const users = Array.from({ length: counter }, (_, idx) => ({
        login: `all${idx}`,
        password: "gfgf",
      }));
      const actual = await repo.createMany(users);
      expect(actual.status).toBe(200);
      if (actual.status === 200) {
        const payload = actual.payload;
        expect(payload.length).toBe(counter);
        const distinctLengthIds = new Set(
          payload.map((data) => data._id)
        ).size;
        expect(distinctLengthIds).toBe(counter);
        const arrayOfElements = payload.map(mapper);
        expect(JSON.stringify(arrayOfElements)).toBe(
          JSON.stringify(users.map(mapper))
        );
      }
    });

    it("La fonction a été appelé 1 fois", () => {
      expect(spy).toBeCalledTimes(1);
    });
  });
});

describe("Upsert one element", () => {
  const spy = jest.spyOn(repo, "upsertOne");
  beforeAll(() => spy.mockClear());
  beforeAll(repo.dropCollection);
  describe("Connected to database", () => {
    const user = {
      _id: "605b1ce8a3bfb918e0ba54f7",
      login: "all",
      password: "gfgf",
    };
    generateAsync3Tests(
      repo.upsertOne,
      [[user], [user], [user]],
      [
        { status: 200, payload: user },
        { status: 102, payload: user },
        { status: 102, payload: user },
      ],
      true
    );
  });
});
// #endregion

// #region Read
describe("Read one element", () => {
  const spy = jest.spyOn(repo, "readOne");
  beforeAll(() => spy.mockClear());
  describe("Connected to database", () => {
    const { user, user3 } = useReadConfig();

    generateAsync3Tests(
      repo.readOne,
      [
        [user],
        [{ login: { $in: ["all3"] } }],
        [{ login: "notexisted" }],
      ],
      [
        { status: 200, payload: user },
        { status: 200, payload: user3 },
        { status: 303 },
      ],
      true
    );
  });
});

describe("Read one element by Id", () => {
  const spy = jest.spyOn(repo, "readOneById");
  beforeAll(() => spy.mockClear());
  describe("Connected to database", () => {
    // const unknownError = 404;
    const config = useReadConfig();

    generateAsync3Tests(
      repo.readOneById,
      Object.values(config).map((payload) => [
        payload._id,
      ]) as TupleOf<any, 3>,

      Object.values(config).map((payload) => ({
        status: 200,
        payload,
      })) as TupleOf<any, 3>
    );
  });
});

describe("Read many elements", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useReadConfig();

    generateAsync3Tests(
      repo.readMany,
      [[{ login: "all" }], [], [{ login: "all" }, 1]],
      [
        { status: 200, payload: [user, user2] },
        { status: 200, payload: [user, user2, user3] },
        { status: 200, payload: [user] },
      ],
      true
    );
  });
});

describe("Read many elements by Id", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useReadConfig();

    const _ids = [user, user2, user3].map((x) => x._id);

    generateAsync5Tests(
      repo.readManyByIds,
      [
        [_ids],
        [_ids, {}, 2],
        [_ids, { login: "all3" }],
        [[user2._id]],
        [["notexisted"]],
      ],
      [
        { status: 200, payload: [user, user2, user3] },
        { status: 200, payload: [user, user2] },
        { status: 200, payload: [user3] },
        { status: 200, payload: [user2] },
        { status: 300 },
      ],
      true
    );
  });
});

describe("Count", () => {
  describe("Connected to database", () => {
    const { user, user3 } = useUpdateConfig();
    generateAsync3Tests(
      repo.count,
      [
        [{ login: user.login }],
        [{ password: user3.password }],
        [{ login: "notexisted" }],
      ],
      [
        { status: 200, payload: 2 },
        { status: 200, payload: 1 },
        { status: 130 },
      ],
      true
    );
  });
});

describe("Subscribe", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useReadConfig();

    it("It shoulds get the subcriber", async () => {
      const actual = await repo.subscribe([]);
      const _sub = [...actual];
      expect(actual.length).toBe(0);
      expect(JSON.stringify(actual)).toBe(JSON.stringify(_sub));
      await sleep(500);
      expect(actual.length).toBe(3);
      expect(JSON.stringify(actual)).not.toBe(JSON.stringify(_sub));
      expect(JSON.stringify(actual)).toBe(
        JSON.stringify([user, user2, user3])
      );
    });
  });
});
// #endregion

// #region Update
describe("Update one element", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync3Tests(
      repo.updateOne,
      [
        [{ login: "all" }, { login: "all1", password: "gpgp" }],
        [{}, { password: "pass1" }],
        [{ login: "all3" }, { login: "login" }],
      ],
      [
        {
          status: 200,
          payload: { ...user, login: "all1", password: "gpgp" },
        },
        {
          status: 200,
          payload: { ...user, password: "pass1" },
        },
        {
          status: 200,
          payload: { ...user3, login: "login" },
        },
      ],
      true
    );
  });
});

describe("Update one element by _id", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    const spy2 = jest.spyOn(repo, "readOneById");
    beforeAll(() => spy2.mockClear());
    generateAsync5Tests(
      repo.updateOneById,
      [
        [user._id, { login: "all1", password: "gpgp" }],
        [user2._id, { password: "pass1" }],
        [user3._id, { login: "login" }],
        [user._id, {}],
        [user2._id, { login: "login2" }],
      ],
      [
        {
          status: 200,
          payload: { ...user, login: "all1", password: "gpgp" },
        },
        {
          status: 200,
          payload: { ...user2, password: "pass1" },
        },
        {
          status: 200,
          payload: { ...user3, login: "login" },
        },
        {
          status: 200,
          payload: user,
        },
        {
          status: 200,
          payload: { ...user2, login: "login2" },
        },
      ],
      true
    );
    it("It shoulds rerender same on element", () => {
      expect(spy2).toBeCalledTimes(1);
      expect(spy2).toBeCalledWith(user._id);
    });
  });
});

describe("Update many elements at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    const spy2 = jest.spyOn(repo, "readMany");
    beforeAll(() => spy2.mockClear());
    generateAsync5Tests(
      repo.updateMany,
      [
        [{ login: "all" }, { login: "all1", password: "gpgp" }],
        [{}, { password: "pass1" }],
        [{ login: "all3" }, { login: "login" }],
        [{ login: "all3" }, {}],
        [{}, {}],
      ],
      [
        {
          status: 200,
          payload: [
            { ...user, login: "all1", password: "gpgp" },
            { ...user2, login: "all1", password: "gpgp" },
          ],
        },
        {
          status: 200,
          payload: [
            { ...user, password: "pass1" },
            { ...user2, password: "pass1" },
            { ...user3, password: "pass1" },
          ],
        },
        {
          status: 200,
          payload: [{ ...user3, login: "login" }],
        },
        {
          status: 323,
          payload: [user3],
        },
        {
          status: 323,
          payload: [user, user2, user3],
        },
      ],
      true
    );
    it("It shoulds Search all before update", () => {
      expect(spy2).toBeCalledTimes(5);
      expect(spy2.mock.calls).toEqual([
        [{ login: "all" }, undefined],
        [{}, undefined],
        [{ login: "all3" }, undefined],
        [{ login: "all3" }, undefined],
        [{}, undefined],
      ]);
    });
  });
});

describe("Update many elements by ids at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    const spy2 = jest.spyOn(repo, "readManyByIds");
    beforeAll(() => spy2.mockClear());
    const ids = [user, user2, user3].map((data) => data._id);
    generateAsync5Tests(
      repo.updateManyByIds,
      [
        [ids, { login: "all1", password: "gpgp" }],
        [[user2._id], { password: "pass1" }],
        [ids, { login: "login" }, { search: { login: "all" } }],
        [ids, {}, { limit: 2 }],
        [[], {}],
      ],
      [
        {
          status: 200,
          payload: [
            { ...user, login: "all1", password: "gpgp" },
            { ...user2, login: "all1", password: "gpgp" },
            { ...user3, login: "all1", password: "gpgp" },
          ],
        },
        {
          status: 200,
          payload: [{ ...user2, password: "pass1" }],
        },
        {
          status: 200,
          payload: [
            { ...user, login: "login" },
            { ...user2, login: "login" },
          ],
        },
        {
          status: 324,
          payload: [user, user2],
        },
        {
          status: 300,
        },
      ],
      true
    );
    it("It shoulds Search all before update", () => {
      expect(spy2).toBeCalledTimes(5);
      expect(spy2.mock.calls).toEqual([
        [ids, undefined, undefined],
        [[user2._id], undefined, undefined],
        [ids, { login: "all" }, undefined],
        [ids, undefined, 2],
        [[], undefined, undefined],
      ]);
    });
  });
});
// #endregion

// #region Delete
describe("Delete one element", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync4Tests(
      repo.deleteOne,
      [
        [{ login: user.login }],
        [{ login: user2.login }],
        [{ password: user3.password }],
        [{ password: "notexits" }],
      ],
      [
        { status: 200, payload: user },
        { status: 200, payload: user },
        { status: 200, payload: user3 },
        { status: 325 },
      ],
      true
    );
  });
});

describe("Delete one element by id", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync5Tests(
      repo.deleteOneById,
      [
        [user._id],
        [user2._id],
        [user3._id],
        ["notexits"],
        ["605b1ce8a3bfb918e0ba54f5"],
      ],
      [
        { status: 200, payload: user },
        { status: 200, payload: user2 },
        { status: 200, payload: user3 },
        { status: 304 },
        { status: 326 },
      ],
      true
    );
  });
});

describe("Delete many elements  at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync4Tests(
      repo.deleteMany,
      [
        [{ login: user.login }],
        [{ login: user2.login }],
        [{ password: user3.password }],
        [{ password: "notexits" }],
      ],
      [
        { status: 200, payload: [user, user2] },
        { status: 200, payload: [user, user2] },
        { status: 200, payload: [user3] },
        { status: 327 },
      ],
      true
    );
  });
});

describe("Delete many elements by ids at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    const ids = [user, user2, user3].map((data) => data._id);

    generateAsync5Tests(
      repo.deleteManyByIds,
      [
        [ids],
        [ids, { limit: 2 }],
        [ids, { search: { login: "all3" } }],
        [ids, { search: { password: "notexits" } }],
        [[]],
      ],
      [
        { status: 200, payload: [user, user2, user3] },
        { status: 200, payload: [user, user2] },
        { status: 200, payload: [user3] },
        { status: 328 },
        { status: 300 },
      ],
      true
    );
  });
});
// #endregion

// #region Collection Functions
describe("Drop a collection", () => {
  describe("Connected to database", () => {
    const notFoundCollectionError = 407;
    describe("Collection is not created", () => {
      beforeAll(dropCol);
      (() =>
        it(
          "Dropping collection should returns notFoundCollection : " +
            notFoundCollectionError.toLocaleString(),
          async () => {
            const actual = await repo.dropCollection();
            expect(actual.status).toBe(notFoundCollectionError);
          }
        ))();
    });
    describe("Collection is  created", () => {
      beforeAll(repo.createCollection);
      afterAll(dropCol);
      generateAsync3Tests(
        repo.dropCollection,
        [[], [], []],
        [
          { status: 200, payload: col },
          { status: 407 },
          { status: 407 },
        ],
        true
      );
    });
  });
});

describe("Create a collection", () => {
  const spy = jest.spyOn(repo, "createCollection");
  beforeAll(() => spy.mockClear());
  describe("Connected to database", () => {
    const error = 418;
    describe("Collection is not created", () => {
      beforeAll(dropCol);
      (() =>
        it(
          "It shoulds create the collection with " + col,
          async () => {
            const actual = await repo.createCollection();
            expect(actual.status).toBe(200);
            if (actual.status === 200) {
              expect(actual.payload).toBe(col);
            }
          }
        ))();
      it("Some verifications", async () => {
        expect(spy).toBeCalledTimes(1);
      });
    });
    describe("Collection is  created", () => {
      beforeAll(createCol);
      (() =>
        it("Creation should raise error : " + error, async () => {
          const actual = await repo.createCollection();
          expect(actual.status).toBe(418);
        }))();
      it("Some verifications", async () => {
        expect(spy).toBeCalledTimes(2);
      });
    });
  });
});

describe("Existence of a collection", () => {
  const spy = jest.spyOn(repo, "exists");
  beforeAll(() => spy.mockClear());
  describe("Connected to database", () => {
    describe("Collection is not created", () => {
      beforeAll(dropCol);
      it("It shoulds returns false", async () => {
        const actual = await repo.exists();
        expect(actual.status).toBe(200);
        if (actual.status === 200) {
          expect(actual.payload).toBe(false);
        }
      });
      it("Some verifications", () => {
        expect(spy).toBeCalledTimes(1);
      });
    });
    describe("Collection is  created", () => {
      beforeAll(createCol);
      afterAll(dropCol);
      it("It shoulds returns true", async () => {
        const actual = await repo.exists();
        expect(actual.status).toBe(200);
        if (actual.status === 200) {
          expect(actual.payload).toBe(true);
        }
      });
      it("Some verifications", () => {
        expect(spy).toBeCalledTimes(2);
      });
    });
  });
});
// #endregion
