import {
  Entity,
  IRepo,
  isServerError,
  isSuccessFull,
  ReturnData,
  WithId,
  WithoutId,
} from './entities';
import {
  InsertOneResult,
  MongoClient,
  MongoClientOptions,
  MongoError,
  ObjectId,
} from 'mongodb';
import { DataSearchOperations } from './.config/types';

type RDW<T> = ReturnData<WithId<T>>;



export class MongoRepository<T extends Entity> implements IRepo<T> {
  constructor(private uriAndDb: string, private col: string) {}

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
      };
  }

  private async _useConnect<T>() {
    const client = new MongoClient(this.uriAndDb);

    const data = await client
      .connect()
      .then<ReturnData<T>, ReturnData<T>>(this.return300)
      .catch<ReturnData<T>>(this.return500);

    const collection = client.db().collection(this.col);

    const close = MongoRepository._close(client);

    const out = { data, close, collection, client } as const;

    return out;
  }

  private static _close = (cl: MongoClient) => () => cl.close();
  // #endregion

  // #region Create
  createOne = async (
    value: T,
    before?: (input: T) => any,
    after?: (input: RDW<T>) => any,
  ) => {
    if (before) await before(value);

    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) return data;

    function mapper({
      insertedId,
    }: InsertOneResult<any>) {
      const payload: WithId<T> = {
        ...value,
        _id: insertedId.toString(),
      };

      if (ok === 1) {
        data = { status: 200, payload };
      } else if (n === 1) {
        data = { status: 102, payload };
      } else data = { status: 303, payload };
    }

    await collection
      .insertOne(value)
      .then(mapper)
      .catch((err) => {
        data = { status: 402 };
      })
      .finally(close);

    if (after) await after(data);
    return data;
  };

  createMany = async (values: WithoutId<T>[]) => {
    const len = values.length;

    let { data, close, collection } = await this._useConnect<
      WithId<T>[]
    >();

    if (isServerError(data)) {
      return data;
    }
    await collection
      .insertMany(values)
      .then(({ result: { n, ok }, insertedIds, insertedCount }) => {
        const payload: WithId<T>[] = values.map((value, index) => ({
          ...value,
          _id: insertedIds[index],
        }));

        if (insertedCount === len) {
          data = { status: 200, payload };
        } else if (n === len) {
          data = { status: 102, payload };
        } else if (ok === 1) data = { status: 303, payload };
        else data = { status: 305, payload };
      })
      .catch((err) => {
        data = { status: 402 };
      })
      .finally(close);
    return data;
  };

  upsertOne = async (value: WithId<T>) => {
    const _value = { ...value, _id: new ObjectId(value._id) };

    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) return data;

    const _valueFilter: WithoutId<T> = _value;
    await collection
      .updateOne(_valueFilter, { $set: _value }, { upsert: true })
      .then(({ result: { n, ok }, upsertedId }) => {
        const payload = value;

        if (upsertedId?._id.equals(_value._id)) {
          data = { status: 200, payload };
        } else if (ok === 1) {
          data = { status: 102, payload };
        } else data = { status: 303, payload };
      })
      .catch((err) => {
        data = { status: 402 };
      })
      .finally(close);
    return data;
  };
  // #endregion

  // #region Read & subscribe
  readOne = async (search: DataSearchOperations<WithoutId<T>>) => {
    let { data, close, collection } = await this._useConnect<WithId<T>>();
    if (isServerError(data)) {
      return data;
    }
    // delete (search as any)._id;
    const { _id, ..._search } = search as any;

    await collection
      .findOne(_search)
      .then(
        (payload) =>
          (data = {
            status: payload ? 200 : 303,
            payload: this._transformsPayload(payload),
          }),
      )
      .catch((err) => {
        data = { status: 404 };
      })
      .finally(close);
    return data;
  };

  readOneById = async (id: string) => {
    let { data, close, collection } = await this._useConnect<WithId<T>>();
    if (isServerError(data)) {
      return data;
    }
    if (id.length != 24) return data;
    const _id = new ObjectId(id);
    await collection
      .findOne({ _id })
      .then((data2) => {
        const payload = this._transformsPayload(data2);
        if (payload) data = { status: 200, payload };
        else data = { status: 300, payload };
      })
      .catch((err) => {
        data = { status: 404 };
      })
      .finally(close);
    return data;
  };

  readMany = async (
    search?: DataSearchOperations<T> | undefined,
    limit?: number | undefined,
  ) => {
    let { data, close, collection } = await this._useConnect<
      WithId<T>[]
    >();

    if (isServerError(data)) {
      return data;
    }

    let cursor = collection.find(search);
    if (limit) cursor = cursor.limit(limit);
    await cursor
      .toArray()
      .then((data2) => {
        const payload = data2.map(this._transformsPayload);

        return (data = { status: 200, payload });
      })
      .catch((err) => {
        return (data = { status: 404 });
      })
      .finally(close);
    return data;
  };

  readManyByIds = async (
    ids: string[],
    search?: DataSearchOperations<WithoutId<T>>,
    limit?: number | undefined,
  ) => {
    let { data, close, collection } = await this._useConnect<
      WithId<T>[]
    >();

    if (isServerError(data)) {
      return data;
    }

    const _ids = ids
      .filter((id) => id.length === 24)
      .map((id) => new ObjectId(id));

    if (_ids.length < 1) return data;
    const _filter = {
      _id: {
        $in: _ids,
      },
    };
    await collection
      .find({ $and: [_filter, search || {}] })
      .limit(limit || 20)
      .toArray()
      .then((data2) => {
        const payload = data2.map(this._transformsPayload);
        return (data = { status: 200, payload });
      })
      .catch((err) => {
        return (data = { status: 404 });
      })
      .finally(close);

    return data;
  };

  count = async (search?: DataSearchOperations<T>) => {
    let { data, close, collection } = await this._useConnect<number>();

    if (isServerError(data)) {
      data = { status: 530 };
      return data;
    }

    if (!search) {
      data = { status: 330 };
      return data;
    }
    await collection
      .countDocuments(search)
      .then((payload) => {
        if (payload > 0) data = { status: 200, payload };
        else data = { status: 130 };
      })
      .catch((err) => (data = { status: 430 }))
      .finally(close);
    return data;
  };

  subscribe = async (
    subscriber: WithId<T>[],
    search?: DataSearchOperations<T> | undefined,
    limit?: number | undefined,
  ) => {
    let { close, collection } = await this._useConnect<WithId<T>[]>();

    collection
      .find(search)
      .limit(limit || 100)
      .forEach((data) => {
        if (data) subscriber.push(data);
      })
      .catch(() => {})
      .finally(close);
    return subscriber;
  };
  // #endregion

  // #region Update
  updateOne = async (
    search: DataSearchOperations<T>,
    newValue: WithoutId<Partial<T>>,
  ) => {
    if (Object.keys(newValue).length === 0) {
      return this.readOne(search);
    }
    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) return data;

    await collection
      .findOneAndUpdate(search, { $set: newValue })
      .then(({ value, ok }) => {
        const payload = { ...value, ...newValue };

        if (ok === 1) {
          data = { status: 200, payload };
        } else data = { status: 303, payload };
      })
      .catch((err) => {
        data = { status: 402 };
      })
      .finally(close);
    return data;
  };

  updateOneById = async (id: string, newValue: WithoutId<Partial<T>>) => {
    if (Object.keys(newValue).length === 0) {
      return this.readOneById(id);
    }
    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) return data;
    if (id.length !== 24) return data;
    const _id = new ObjectId(id);
    await collection
      .findOneAndUpdate({ _id }, { $set: newValue })
      .then(({ value, ok }) => {
        const payload = { ...value, ...newValue };

        if (ok === 1) {
          data = { status: 200, payload };
        } else data = { status: 303, payload };
      })
      .catch((err) => {
        data = { status: 402 };
      })
      .finally(close);
    return data;
  };

  updateMany = async (
    search: DataSearchOperations<T>,
    newValue: WithoutId<Partial<T>>,
    limit?: number | undefined,
  ) => {
    let data = await this.readMany(search, limit);
    if (isSuccessFull(data)) {
      let {
        data: data2,
        close,
        collection,
      } = await this._useConnect<WithId<T>[]>();

      if (isServerError(data2)) {
        data = { status: 523 };
        return data;
      }

      const _payload: WithId<T>[] = data.payload;

      if (Object.keys(newValue).length < 1) {
        data = { status: 323, payload: _payload };
        return data;
      }

      const ids: ObjectId[] = _payload
        .map((d) => d._id)
        .map((d) => new ObjectId(d));
      const _filter = { _id: { $in: ids } };

      await collection
        .updateMany(_filter, { $set: newValue }, {})
        .then(({ modifiedCount }) => {
          const payload = [..._payload].map((val) => ({
            ...val,
            ...newValue,
          }));
          if (modifiedCount === ids.length) {
            data = { status: 200, payload };
          } else {
            data = { status: 120, payload };
          }
        })
        .catch((err) => {
          return (data = { status: 423 });
        })
        .finally(close);
    }
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
    let data = await this.readManyByIds(
      ids,
      options?.search,
      options?.limit,
    );
    if (isSuccessFull(data)) {
      let {
        data: data2,
        close,
        collection,
      } = await this._useConnect<WithId<T>[]>();
      if (isServerError(data2)) {
        data = { status: 524 };
        return data;
      }

      const _payload: WithId<T>[] = data.payload;

      if (Object.keys(newValue).length < 1) {
        data = { status: 324, payload: _payload };
        return data;
      }

      const _ids: ObjectId[] = _payload
        .map((d) => d._id)
        .map((d) => new ObjectId(d));

      const _filter = { _id: { $in: _ids } };

      await collection
        .updateMany(_filter, { $set: newValue })
        .then(({ modifiedCount }) => {
          const payload = [..._payload].map((val) => ({
            ...val,
            ...newValue,
          }));
          if (modifiedCount === _ids.length) {
            data = { status: 200, payload };
          } else {
            data = { status: 120, payload };
          }
        })
        .catch((err) => {
          return (data = { status: 423 });
        })
        .finally(close);
    }
    return data;
  };
  // #endregion

  // #region Delete
  deleteOne = async (search: DataSearchOperations<T>) => {
    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) {
      return data;
    }
    await collection
      .findOneAndDelete(search)
      .then(({ ok, value }) => {
        if (ok === 1 && value) {
          const payload = value;
          data = { status: 200, payload };
        } else {
          data = { status: 325 };
        }
      })
      .catch((err) => {
        data = { status: 425 };
      })
      .finally(close);
    return data;
  };

  deleteOneById = async (id: string) => {
    let { data, close, collection } = await this._useConnect<WithId<T>>();

    if (isServerError(data)) return data;
    if (id.length !== 24) {
      data = { status: 304 };
      return data;
    }
    const _id = new ObjectId(id);
    await collection
      .findOneAndDelete({ _id })
      .then(({ ok, value }) => {
        if (ok === 1 && value) {
          const payload = value;
          data = { status: 200, payload };
        } else {
          data = { status: 326 };
        }
      })
      .catch((err) => {
        data = { status: 425 };
      })
      .finally(close);
    return data;
  };

  deleteMany = async (search: DataSearchOperations<T>, limit?: number) => {
    let data = await this.readMany(search, limit);
    if (isSuccessFull(data)) {
      let {
        data: data2,
        close,
        collection,
      } = await this._useConnect<WithId<T>[]>();

      if (isServerError(data2)) {
        data = { status: 523 };
        return data;
      }

      const payload: WithId<T>[] = data.payload;

      const _ids: ObjectId[] = payload
        .map((d) => d._id)
        .map((d) => new ObjectId(d));
      const _filter = { _id: { $in: _ids } };

      await collection
        .deleteMany(_filter)
        .then(({ deletedCount }) => {
          if (deletedCount === _ids.length && _ids.length > 0) {
            data = { status: 200, payload };
          } else {
            data = { status: 327 };
          }
        })
        .catch((err) => {
          return (data = { status: 423 });
        })
        .finally(close);
    }
    return data;
  };

  deleteManyByIds = async <A extends string[]>(
    ids: A,
    options?: {
      search?: DataSearchOperations<T>;
      limit?: number;
    },
  ) => {
    let data = await this.readManyByIds(
      ids,
      options?.search,
      options?.limit,
    );
    if (isSuccessFull(data)) {
      let {
        data: data2,
        close,
        collection,
      } = await this._useConnect<WithId<T>[]>();

      if (isServerError(data2)) {
        data = { status: 523 };
        return data;
      }

      const payload: WithId<T>[] = data.payload;

      const _ids: ObjectId[] = payload
        .map((d) => d._id)
        .map((d) => new ObjectId(d));
      const _filter = { _id: { $in: _ids } };

      await collection
        .deleteMany(_filter)
        .then(({ deletedCount }) => {
          if (deletedCount === _ids.length && _ids.length > 0) {
            data = { status: 200, payload };
          } else {
            data = { status: 328 };
          }
        })
        .catch((err) => {
          return (data = { status: 423 });
        })
        .finally(close);
    }
    return data;
  };
  // #endregion

  // #region Collection Functions
  dropCollection = async () => {
    let input = await this.exists();

    let data: ReturnData<string> = { status: 407 };

    if (
      JSON.stringify(input) ===
      JSON.stringify({ status: 200, payload: true })
    ) {
      const {
        data: data2,
        close,
        client,
      } = await this._useConnect<string>();

      if (isServerError(data2)) return data2;
      data = data2;
      await client
        .db()
        .dropCollection(this.col)
        .then(() => (data = { status: 200, payload: this.col }))
        .catch((err) => {
          if (err instanceof MongoError) {
            console.debug('code : ', err.code);

            if (err.code === 26) {
              return (data = { status: 407 });
            }
          }
          return (data = { status: 404 });
        })
        .finally(close);
    }

    return data;
  };

  createCollection = async () => {
    let input = await this.exists();
    let data: ReturnData<string> = { status: 418 };

    if (
      JSON.stringify(input) ===
      JSON.stringify({ status: 200, payload: false })
    ) {
      const {
        data: data2,
        close,
        client,
      } = await this._useConnect<string>();

      if (isServerError(data2)) return data2;
      data = data2;

      await client
        .db()
        .createCollection(this.col)
        .then(
          ({ collectionName: payload }) =>
            (data = { status: 200, payload }),
        )
        .catch((err) => {
          if (err instanceof MongoError) {
            return (data = { status: 407 });
          }

          return (data = { status: 404 });
        })
        .finally(close);
    }

    return data;
  };

  exists = async () => {
    let { data, close, client } = await this._useConnect<boolean>();

    if (isServerError(data)) return data;
    const db = client.db();
    await db
      .collections()
      .then((cols) => cols.map((col) => col.collectionName))
      .then((cols) => {
        return cols.includes(this.col);
      })
      .then((payload) => (data = { status: 200, payload }))
      .catch((err) => (data = { status: 451 }))
      .finally(close);

    return data;
  };
  // #endregion
}
