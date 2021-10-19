import type {
  DataSearchOperations,
  Entity,
  IRepo,
  ReturnData,
  WithId,
  WithoutId,
} from 'core_types';
import { isNullish, isSuccessFull } from 'core_types';
import { accessSync, constants, rmSync, writeFileSync } from 'fs';
import Collection from 'nedb-async';
type RDW<T> = ReturnData<WithId<T>>;
type RDWA<T> = ReturnData<WithId<T>[]>;

function verifyEmptyObject<T>(arg: T) {
  const values = Object.values(arg);
  const everyEmpty = values.every((val) => isNullish(val));
  return !arg || values.length < 1 || everyEmpty;
}

export class Nedb<T extends Entity> implements IRepo<T> {
  constructor(private uriAndDb?: string) {
    if (uriAndDb) {
      writeFileSync(uriAndDb, '');
      this.collection = new Collection(uriAndDb);
    }
    this.collection = new Collection();
  }

  collection: Collection<T>;
  // #region Helpers
  protected get return500() {
    return <T>() => ({ status: 500 } as ReturnData<T>);
  }

  protected get return300() {
    return <T>() => ({ status: 300 } as ReturnData<T>);
  }

  private _transformsPayload(payload: any) {
    if (payload)
      return {
        ...payload,
        _id: payload?._id?.toHexString(),
      } as WithId<T>;
  }

  // #endregion

  // #region Create
  createOne = async (value: T) => {
    let data: RDW<T>;
    data = { status: 301 };
    const mapper = (payload: T) =>
      (data = {
        status: 201,
        payload: payload as WithId<T>,
      });
    await this.collection
      .asyncInsert(value)
      .then(mapper)
      .catch(() => (data = { status: 401 }));
    return data as RDW<T>;
  };

  createMany = async (values: WithoutId<T>[]) => {
    let data: RDWA<T> = { status: 302 };

    const promises = values.map((value) =>
      this.collection.asyncInsert(value as any),
    );
    await Promise.all(promises)
      .then((payload) => {
        return (data = {
          status: 202,
          payload,
        });
      })
      .catch(() => (data = { status: 402 }));
    return data as RDWA<T>;
  };

  upsertOne = async (value: WithId<T>) => {
    let data = { status: 303 } as RDW<T>;
    await this.collection.asyncFindOne(value).then((payload) => {
      if (payload) data = { status: 103, payload: payload as WithId<T> };
    });
    if (data.status === 103) return data;
    await this.collection
      .asyncUpdate(value, value, { upsert: true })
      .then(
        (payload) =>
          (data = {
            status: 203,
            payload: value,
          }),
      )
      .catch(() => {
        data = { status: 403 };
      });
    return data;
  };
  // #endregion

  // #region Read & subscribe
  readOne = async (search: DataSearchOperations<T>) => {
    let data: RDW<T> = { status: 304 };

    await this.collection
      .asyncFindOne(search)
      .then((payload) => {
        if (payload) {
          data = {
            status: 204,
            payload: payload as WithId<T>,
          };
        }
      })
      .catch(() => (data = { status: 404 }));
    return data as RDW<T>;
  };

  readOneById = async (id: string) => {
    let data: RDW<T> = { status: 305 };

    await this.collection
      .asyncFindOne({ _id: id })
      .then((payload) => {
        if (payload) {
          data = {
            status: 205,
            payload: payload as WithId<T>,
          };
        }
      })
      .catch(() => (data = { status: 405 }));
    return data as RDW<T>;
  };

  readMany = async (
    search?: DataSearchOperations<T> | undefined,
    limit?: number,
  ) => {
    let data = { status: 306 } as RDWA<T>;

    await this.collection
      .asyncFind<any>(search, [['limit', limit ?? 100]])
      .then((payload) => {
        if (payload.length > 0)
          data = {
            status: 206,
            payload: payload.map((val) => val as WithId<T>),
          };
      })
      .catch(() => (data = { status: 406 }));
    return data;
  };

  readManyByIds = async (
    ids: string[],
    search?: DataSearchOperations<WithoutId<T>>,
    limit?: number | undefined,
  ) => {
    let data: RDWA<T> = { status: 307 };

    await this.collection
      .asyncFind<any>({ _id: { $in: ids }, ...search }, [
        ['limit', limit ?? 100],
      ])
      .then((payload) => {
        if (payload && payload.length > 0) {
          data = {
            status: 207,
            payload: payload.map((val) => val as WithId<T>),
          };
        }
      })
      .catch(() => (data = { status: 407 }));
    return data as RDWA<T>;
  };

  count = async (search?: DataSearchOperations<T>) => {
    let data: ReturnData<number> = { status: 308 };

    await this.collection
      .asyncCount(search)
      .then((payload) => {
        if (payload)
          data = {
            status: 208,
            payload: payload as number,
          };
      })
      .catch(() => (data = { status: 408 }));
    return data as ReturnData<number>;
  };

  subscribe = async (
    subscriber: WithId<T>[],
    search?: DataSearchOperations<T> | undefined,
    limit?: number | undefined,
  ) => {
    this.collection
      .find(search)
      .limit(limit || 100)
      .exec((err, docs) => {
        if (err) return;
        subscriber.push(...docs.map((doc) => doc as WithId<T>));
      });

    return subscriber;
  };
  // #endregion

  // #region Update
  updateOne = async (
    search: DataSearchOperations<T>,
    newValue: WithoutId<Partial<T>>,
  ) => {
    let data = { status: 309 } as RDW<T>;
    const finde = await this.readOne(search);
    if (!isSuccessFull(finde)) {
      return data;
    }
    const find = finde.payload;

    await this.collection
      .asyncUpdate({ _id: find._id }, newValue, {
        upsert: false,
        returnUpdatedDocs: true,
      })
      .then(() => {
        const payload = { ...find, ...newValue };
        data = {
          status: 209,
          payload,
        };
      })
      .catch(() => (data = { status: 409 }));
    return data as RDW<T>;
  };

  updateOneById = async (id: string, newValue: WithoutId<Partial<T>>) => {
    let data = { status: 310 } as RDW<T>;
    const finde = await this.readOneById(id);
    if (!isSuccessFull(finde)) {
      return data;
    }
    const find = finde.payload;
    await this.collection
      .asyncUpdate({ _id: find._id }, newValue, {
        upsert: false,
        returnUpdatedDocs: true,
      })
      .then(() => {
        const payload = { ...find, ...newValue };
        data = {
          status: 210,
          payload,
        };
      })
      .catch(() => (data = { status: 410 }));

    return data;
  };

  updateMany = async (
    search: DataSearchOperations<T>,
    newValue: WithoutId<Partial<T>>,
    limit?: number | undefined,
  ) => {
    let data = { status: 311 } as RDWA<T>;

    if (verifyEmptyObject(search)) return data;

    const finde = await this.readMany(search, limit);
    if (!isSuccessFull(finde)) {
      return data;
    }

    const finds = finde.payload;

    await this.collection
      .asyncUpdate(
        { id: { $in: finds.map((find) => find._id) } },
        newValue,
        {
          upsert: false,
          multi: true,
          returnUpdatedDocs: true,
        },
      )
      .then(() => {
        data = {
          status: 211,
          payload: finds.map((find) => ({ ...find, ...newValue })),
        };
      })
      .catch(() => (data = { status: 411 }));
    return data;
  };

  updateManyByIds = async (
    ids: string[],
    newValue: WithoutId<Partial<T>>,
    options?: {
      search?: DataSearchOperations<T>;
      limit?: number;
    },
  ) => {
    let data = { status: 312 } as RDWA<T>;
    if (ids.length < 1) return data;
    const finde = await this.readManyByIds(
      ids,
      options?.search,
      options?.limit,
    );
    if (!isSuccessFull(finde)) {
      return data;
    }

    const finds = finde.payload;
    if (verifyEmptyObject(newValue)) {
      data = { status: 112, payload: finds };
      return data;
    }

    await this.collection
      .asyncUpdate(
        { id: { $in: finds.map((find) => find._id) } },
        newValue,
        {
          upsert: false,
          multi: true,
          returnUpdatedDocs: true,
        },
      )
      .then(() => {
        data = {
          status: 212,
          payload: finds.map((find) => ({ ...find, ...newValue })),
        };
      })
      .catch(() => (data = { status: 412 }));
    return data;
  };
  // #endregion

  // #region Delete
  deleteOne = async (search: DataSearchOperations<T>) => {
    let data = { status: 313 } as RDW<T>;
    if (verifyEmptyObject(search)) return data;
    const find = await this.readOne(search);
    if (!isSuccessFull(find)) {
      data = { status: 113 };
      return data;
    }
    const payload = find.payload;
    await this.collection
      .asyncRemove({ _id: payload._id }, { multi: false })
      .then(
        () =>
          (data = {
            status: 213,
            payload,
          }),
      )
      .catch(() => (data = { status: 413 }));
    return data;
  };

  deleteOneById = async (id: string) => {
    let data = { status: 314 } as RDW<T>;

    if (id === '') return data;
    const find = await this.readOneById(id);
    if (!isSuccessFull(find)) {
      data = { status: 114 };
      return data;
    }
    const payload = find.payload;
    await this.collection
      .asyncRemove({ _id: payload._id }, { multi: false })
      .then(
        () =>
          (data = {
            status: 214,
            payload,
          }),
      )
      .catch(() => (data = { status: 414 }));
    return data as RDW<T>;
  };

  deleteMany = async (search: DataSearchOperations<T>, limit?: number) => {
    let data = { status: 315 } as RDWA<T>;
    if (verifyEmptyObject(search)) return data;
    const find = await this.readMany(search, limit);
    if (!isSuccessFull(find)) {
      data = { status: 115 };
      return data;
    }
    const payload = find.payload;
    await this.collection
      .asyncRemove(
        { _id: { $in: payload.map((val) => val._id) } },
        { multi: true },
      )
      .then(
        () =>
          (data = {
            status: 215,
            payload,
          }),
      )
      .catch(() => (data = { status: 415 }));
    return data;
  };

  deleteManyByIds = async <A extends string[]>(
    ids: A,
    options?: {
      search?: DataSearchOperations<T>;
      limit?: number;
    },
  ) => {
    let data = { status: 316 } as RDWA<T>;
    if (ids.length < 1) return data;
    const find = await this.readManyByIds(
      ids,
      options?.search,
      options?.limit,
    );
    if (!isSuccessFull(find)) {
      data = { status: 116 };
      return data;
    }
    const payload = find.payload;
    await this.collection
      .asyncRemove(
        { _id: { $in: payload.map((val) => val._id) } },
        { multi: true },
      )
      .then(
        () =>
          (data = {
            status: 216,
            payload,
          }),
      )
      .catch(() => (data = { status: 416 }));
    return data;
  };
  // #endregion

  // #region Collection Functions
  resetCollection = async () => {
    if (this.uriAndDb) rmSync(this.uriAndDb, { maxRetries: 5 });
    await this.collection.asyncRemove({}, { multi: true });
  };

  exists = async () => {
    return checkFileExistsSync(this.uriAndDb);
  };
  // #endregion
}

function checkFileExistsSync(filepath?: string) {
  let flag = true;
  try {
    if (filepath) accessSync(filepath, constants.F_OK);
    else flag = false;
  } catch (e) {
    flag = false;
  }
  return flag;
}
