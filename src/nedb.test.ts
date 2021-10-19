import {
  Entity,
  generateAsync3Tests,
  generateAsync4Tests,
  generateAsync5Tests,
  generateAsync6Tests,
  Login,
  sleep,
  TupleOf,
} from "core_types";
import { Nedb } from "./nedb";

// #region Configurations
interface User extends Entity, Login {}

const DB = "G:/db.db";

const repo = new Nedb<User>();

// #region Helper Functions

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
  beforeAll(repo.resetCollection);

  beforeAll(async () => {
    await repo.upsertOne(user);
    await repo.upsertOne(user2);
    await repo.upsertOne(user3);
  });
  afterAll(repo.resetCollection);
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
  beforeAll(repo.resetCollection);

  beforeEach(async () => {
    await repo.upsertOne(user);
    await repo.upsertOne(user2);
    await repo.upsertOne(user3);
  });

  afterEach(repo.resetCollection);
  return { user, user2, user3 } as const;
}
// #endregion
// #endregion

// #region Create
describe("Create one element", () => {
  const spy = jest.spyOn(repo, "createOne");
  beforeAll(() => spy.mockClear());
  beforeAll(repo.resetCollection);
  afterAll(repo.resetCollection);
  describe("Connected to database", () => {
    it("Create user 1", async () => {
      const user = {
        _id: "605b1ce8a3bfb918e0ba54f7",
        login: "all",
        password: "gfgf",
      };
      const actual = await repo.createOne(user);
      expect(actual.status).toBe(201);
      if (actual.status === 201) {
        expect(actual.payload.login).toBe(user.login);
        expect(actual.payload.password).toBe(user.password);
        expect(actual.payload._id).toBe(user._id);
      }
    });

    it("Create user 2", async () => {
      const user: User = { login: "all", password: "gfgf" };
      const actual = await repo.createOne(user);
      expect(actual.status).toBe(201);
      if (actual.status === 201) {
        expect(actual.payload.login).toBe(user.login);
        expect(actual.payload.password).toBe(user.password);
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
      expect(actual.status).toBe(202);
      if (actual.status === 202) {
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
  beforeAll(repo.resetCollection);
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
        { status: 203, payload: user },
        { status: 103, payload: user },
        { status: 103, payload: user },
      ],
      true
    );
    it("smal", async () => {
      const num = await repo.collection.asyncCount({});
      expect(num).toBe(1);
    });
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
        { status: 204, payload: user },
        { status: 204, payload: user3 },
        { status: 304 },
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
        status: 205,
        payload,
      })) as TupleOf<any, 3>
    );
  });
});

describe("Read many elements", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useReadConfig();

    generateAsync4Tests(
      repo.readMany,
      [
        [{ login: "all" }],
        [],
        [{ login: "all" }, 1],
        [{ login: "notexisted" }],
      ],
      [
        { status: 206, payload: [user, user2] },
        { status: 206, payload: [user, user2, user3] },
        { status: 206, payload: [user] },
        { status: 306 },
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
        { status: 207, payload: [user, user2, user3] },
        { status: 207, payload: [user, user2] },
        { status: 207, payload: [user3] },
        { status: 207, payload: [user2] },
        { status: 307 },
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
        { status: 208, payload: 2 },
        { status: 208, payload: 1 },
        { status: 308 },
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
    generateAsync4Tests(
      repo.updateOne,
      [
        [{ login: "all" }, { login: "all1", password: "gpgp" }],
        [{}, { password: "pass1" }],
        [{ login: "all3" }, { login: "login" }],
        [{ login: "notexisted" }, { login: "login" }],
      ],
      [
        {
          status: 209,
          payload: { ...user, login: "all1", password: "gpgp" },
        },
        {
          status: 209,
          payload: { ...user, password: "pass1" },
        },
        {
          status: 209,
          payload: { ...user3, login: "login" },
        },
        {
          status: 309,
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
    generateAsync6Tests(
      repo.updateOneById,
      [
        [user._id, { login: "all1", password: "gpgp" }],
        [user2._id, { password: "pass1" }],
        [user3._id, { login: "login" }],
        [user._id, {}],
        [user2._id, { login: "login2" }],
        ["notexisted", { login: "login" }],
      ],
      [
        {
          status: 210,
          payload: { ...user, login: "all1", password: "gpgp" },
        },
        {
          status: 210,
          payload: { ...user2, password: "pass1" },
        },
        {
          status: 210,
          payload: { ...user3, login: "login" },
        },
        {
          status: 210,
          payload: user,
        },
        {
          status: 210,
          payload: { ...user2, login: "login2" },
        },
        {
          status: 310,
        },
      ],
      true
    );
    it("It shoulds rerender same on element", () => {
      expect(spy2).toBeCalledTimes(6);
    });
  });
});

describe("Update many elements at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    const spy2 = jest.spyOn(repo, "readMany");
    beforeAll(() => spy2.mockClear());
    generateAsync4Tests(
      repo.updateMany,
      [
        [{ login: "all" }, { login: "all1", password: "gpgp" }],
        [{}, { password: "pass1" }],
        [{ login: "all3" }, { login: "login" }],
        [{ login: "notexisted" }, {}],
      ],
      [
        {
          status: 211,
          payload: [
            { ...user, login: "all1", password: "gpgp" },
            { ...user2, login: "all1", password: "gpgp" },
          ],
        },
        {
          status: 311,
        },
        {
          status: 211,
          payload: [{ ...user3, login: "login" }],
        },
        {
          status: 311,
        },
      ],
      true
    );
    it("It shoulds Search all before update", () => {
      expect(spy2).toBeCalledTimes(3);
      expect(spy2.mock.calls).toEqual([
        [{ login: "all" }, undefined],
        [{ login: "all3" }, undefined],
        [{ login: "notexisted" }, undefined],
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
        [[], { login: "login" }],
      ],
      [
        {
          status: 212,
          payload: [
            { ...user, login: "all1", password: "gpgp" },
            { ...user2, login: "all1", password: "gpgp" },
            { ...user3, login: "all1", password: "gpgp" },
          ],
        },
        {
          status: 212,
          payload: [{ ...user2, password: "pass1" }],
        },
        {
          status: 212,
          payload: [
            { ...user, login: "login" },
            { ...user2, login: "login" },
          ],
        },
        {
          status: 112,
          payload: [user, user2],
        },
        {
          status: 312,
        },
      ],
      true
    );
    it("It shoulds Search all before update", () => {
      expect(spy2).toBeCalledTimes(4);
      expect(spy2.mock.calls).toEqual([
        [ids, undefined, undefined],
        [[user2._id], undefined, undefined],
        [ids, { login: "all" }, undefined],
        [ids, undefined, 2],
      ]);
    });
  });
});
// #endregion

// #region Delete
describe("Delete one element", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync5Tests(
      repo.deleteOne,
      [
        [{ login: user.login }],
        [{ login: user2.login }],
        [{ password: user3.password }],
        [{ password: "notexits" }],
        [{}],
      ],
      [
        { status: 213, payload: user },
        { status: 213, payload: user },
        { status: 213, payload: user3 },
        { status: 113 },
        { status: 313 },
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
      [[user._id], [user2._id], [user3._id], ["notexits"], [""]],
      [
        { status: 214, payload: user },
        { status: 214, payload: user2 },
        { status: 214, payload: user3 },
        { status: 114 },
        { status: 314 },
      ],
      true
    );
  });
});

describe("Delete many elements  at same time", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useUpdateConfig();
    generateAsync5Tests(
      repo.deleteMany,
      [
        [{ login: user.login }],
        [{ login: user2.login }],
        [{ password: user3.password }],
        [{ password: "notexits" }],
        [{}],
      ],
      [
        { status: 215, payload: [user, user2] },
        { status: 215, payload: [user, user2] },
        { status: 215, payload: [user3] },
        { status: 115 },
        { status: 315 },
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
        { status: 216, payload: [user, user2, user3] },
        { status: 216, payload: [user, user2] },
        { status: 216, payload: [user3] },
        { status: 116 },
        { status: 316 },
      ],
      true
    );
  });
});

// #endregion

// #region Collection Functions
describe("Reset the connection", () => {
  describe("Connected to database", () => {
    const { user, user2, user3 } = useReadConfig();

    it("The collection shoulds be empty", async () => {
      await repo.resetCollection();
      const finds = await repo.readMany();
      expect(finds.status).toBe(306);
    });
  });
});

// describe("Checks existence of db.file", () => {
//   describe("Connected to database", () => {
//     useReadConfig();
//     beforeAll(()=>{
      
//     })

//     it("The collection shoulds exists", async () => {
//       const repo2 = new Nedb(DB);

//       expect(await repo2.exists()).toBe(true);
//     });
//     it("The collection shoulds not exists", async () => {
//       const repo2 = new Nedb();

//       expect(await repo2.exists()).toBe(false);
//     });
//   });
// });
// #endregion
