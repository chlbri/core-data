import { ReturnData } from '@bemedev/return-data';
import { dequal } from 'dequal/lite';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { CollectionPermissions } from '../entities';
import { isNotClause } from '../functions';
import type { DataSearchOperations, SearchOperation } from '../types/dso';
import {
  Count,
  CountAll,
  CreateMany,
  CreateOne,
  DeleteAll,
  DeleteMany,
  DeleteManyByIds,
  DeleteOne,
  DeleteOneById,
  ReadAll,
  ReadMany,
  ReadManyByIds,
  ReadOne,
  ReadOneById,
  RemoveAll,
  RemoveMany,
  RemoveManyByIds,
  RemoveOne,
  RemoveOneById,
  Repository,
  RetrieveAll,
  RetrieveMany,
  RetrieveManyByIds,
  RetrieveOne,
  RetrieveOneById,
  SetAll,
  SetMany,
  SetManyByIds,
  SetOne,
  SetOneById,
  UpdateAll,
  UpdateMany,
  UpdateManyByIds,
  UpdateOne,
  UpdateOneById,
  UpsertMany,
  UpsertOne,
  WI,
  WO,
} from '../types/repo';
import { Entity } from './../entities';

export function inStreamSearchAdapterKey<T>(
  op: SearchOperation<T>,
): (arg: T) => boolean {
  // if (!op) return () => true;
  const keys = Object.keys(op);

  if (keys.every(key => !key.includes('$'))) {
    return (arg: T) => {
      if (
        typeof arg === 'string' ||
        typeof arg === 'number' ||
        typeof arg === 'bigint' ||
        typeof arg === 'boolean' ||
        typeof arg === 'undefined' ||
        Object.keys(keys) === Object.keys(arg as any)
      ) {
        return dequal(op, arg);
      }
      return inStreamSearchAdapter(op as any)(arg);
    };
  }

  const entries = Object.entries(op);

  const switcherFunctionsByKeys = ([key, value]: [string, any]) => {
    switch (key) {
      // #region Object
      case '$exists':
        return (arg: T) => {
          const sw = arg !== undefined && arg !== null;
          return value ? sw : !sw;
        };
      case '$eq':
        return (arg: T) => dequal(arg, value);
      case '$ne':
        return (arg: T) => !dequal(arg, value);
      case '$in':
        return (arg: T) => {
          return (value as any[]).some(val => dequal(arg, val));
        };
      case '$nin':
        return (arg: T) => {
          return (value as any[]).every(val => !dequal(arg, val));
        };
      // #endregion

      // #region Number
      case '$gt':
        return (arg: T) => arg > value;
      case '$gte':
        return (arg: T) => arg >= value;
      case '$lt':
        return (arg: T) => arg < value;
      case '$lte':
        return (arg: T) => arg <= value;
      case '$mod':
        return (arg: T) => (arg as unknown as number) % value === 0;
      // #endregion

      // #region String
      case '$cts':
        return (arg: T) => (arg as unknown as string).includes(value);
      case '$sw':
        return (arg: T) =>
          (arg as unknown as string).trim().startsWith(value);
      case '$ew':
        return (arg: T) =>
          (arg as unknown as string).trim().endsWith(value);
      // #endregion

      // #region Array
      case '$all':
        return (arg: T) =>
          (arg as unknown as string[]).every(val => dequal(val, value));
      case '$em':
        return (arg: T) =>
          (arg as unknown as string[]).some(val => dequal(val, value));
      case '$size':
        return (arg: T) => (arg as unknown as string[]).length === value;
      // #endregion

      // #region Logicals
      case '$and':
        return (arg: T) => {
          const val = value as SearchOperation<T>[];
          const out = val.reduce((acc, curr) => {
            const search = inStreamSearchAdapterKey(curr)(arg);
            return acc && search;
          }, true);
          return out;
        };
      case '$not':
        return (arg: T) => {
          const val = value as SearchOperation<T>;
          const out = !inStreamSearchAdapterKey(val)(arg);
          return out;
        };
      case '$nor':
        return (arg: T) => {
          const val = value as SearchOperation<T>[];
          const out = val.reduce((acc, curr) => {
            const search = inStreamSearchAdapterKey(curr)(arg);
            return acc && !search;
          }, true);
          return out;
        };
      case '$or':
        return (arg: T) => {
          const values = value as SearchOperation<T>[];
          let out = false;
          for (const curr of values) {
            out = inStreamSearchAdapterKey(curr)(arg);
            if (out) break;
          }
          return out;
        };
      // #endregion

      default:
        return () => false;
    }
  };

  const funcs = entries.map(switcherFunctionsByKeys);

  const resolver = (arg: T) => {
    return funcs.reduce((acc, curr) => acc && curr(arg), true);
  };

  return resolver;
}

export function inStreamSearchAdapter<T>(
  filter: DataSearchOperations<T>,
): (val: any) => boolean {
  const funcs: ((arg: T) => boolean)[] = [];

  if (isNotClause(filter)) {
    const entries = Object.entries(filter.$not) as [
      keyof T,
      SearchOperation<T[keyof T]>,
    ][];

    entries.forEach(([key, value]) => {
      if (value) {
        const func = (arg: T) => {
          return inStreamSearchAdapterKey(value)((arg as any)[key]);
        };
        funcs.push(func);
      }
    });
  } else {
    const entries = Object.entries(filter) as [
      keyof T,
      SearchOperation<T[keyof T]>,
    ][];

    entries.forEach(([key, value]) => {
      if (value) {
        const func = (arg: T) => {
          return inStreamSearchAdapterKey(value)(arg[key]);
        };
        funcs.push(func);
      }
    });
  }

  const resolver = (arg: any) => {
    return funcs.reduce((acc, curr) => acc && curr(arg as any), true);
  };
  return resolver;
}

// type Permission<T extends Entity> = {
//   permissionReader: PermissionsReaderOne<T>;
// };

export class ArrayDB<T extends Entity> implements Repository<T> {
  /* , Permission<T> */
  constructor(
    private _db: WI<T>[],
    private permissions: CollectionPermissions,
  ) {}

  __update = (payload: string[], update: WO<T>) => {
    const __db = produce([...this._db], draft => {
      payload.forEach(id => {
        const index = draft.findIndex((data: any) => data._id === id);
        if (index !== -1) {
          (draft[index] as any).login = (update as any).login;
        }
      });
    });
    this.rinitDB();
    this._db.push(...__db);
    this._db; //?
  };

  rinitDB() {
    this._db.length = 0;
  }

  get length() {
    return this._db.length;
  }
  //TODO reset all

  // #region Create

  createMany: CreateMany<T> = async ({ data: datas, options }) => {
    const inputs = datas.map(data => ({
      _id: nanoid(),
      ...data,
    })) as WI<T>[];
    if (options && options.limit && options.limit < datas.length) {
      const limit = options.limit;
      const _inputs = inputs.slice(0, limit);
      this._db.push(..._inputs);
      const payload = _inputs.map(input => input._id);
      const messages = ['Limit exceeded'];
      const rd = new ReturnData({ status: 110, payload, messages });
      return rd;
    }

    this._db.push(...inputs);
    const payload = inputs.map(input => input._id) as string[];
    const rd = new ReturnData({ status: 210, payload });
    return rd;
  };

  createOne: CreateOne<T> = async ({ data }) => {
    const input = {
      _id: nanoid(),
      ...data,
    } as WI<T>;

    this._db.push(input);
    const payload = input._id;
    const rd = new ReturnData({ status: 211, payload });
    return rd;
  };

  upsertOne: UpsertOne<T> = async ({ _id, data }) => {
    const _filter = inStreamSearchAdapter({ _id, ...data } as any);
    const _exist = this._db.find(_filter);
    if (_exist) {
      const messages = ['Already exists'];
      return new ReturnData({ status: 312, payload: _id, messages });
    } else {
      this._db.push({ _id: _id ?? nanoid(), ...data });
      return new ReturnData({ status: 212, payload: _id });
    }
  };

  upsertMany: UpsertMany<T> = async ({ upserts, options }) => {
    const inputs = upserts.map(({ _id, data }) => ({
      _id,
      ...data,
    })) as WI<T>[];
    const alreadyExists: string[] = [];
    if (options && options.limit && options.limit < upserts.length) {
      const limit = options.limit;
      const _inputs = inputs.slice(0, limit).map(input => {
        const _filter = inStreamSearchAdapter(input as any);
        const _exist = this._db.find(_filter)?._id;
        if (_exist) {
          alreadyExists.push(_exist);
        } else {
          this._db.push({ ...input, _id: input._id ?? nanoid() });
        }
        return input;
      });
      if (alreadyExists.length > 0) {
        return new ReturnData({
          status: 313,
          payload: _inputs.map(input => input._id),
          messages: [`${alreadyExists.length} already exist`],
        });
      } else {
        return new ReturnData({
          status: 113,
          payload: _inputs.map(input => input._id),
        });
      }
    }

    inputs.forEach(input => {
      const _filter = inStreamSearchAdapter(input as any);
      const _exist = this._db.find(_filter)?._id;

      if (_exist) {
        alreadyExists.push(_exist);
      } else {
        this._db.push({ ...input, _id: input._id ?? nanoid() });
      }
      return input;
    });

    if (alreadyExists.length > 0) {
      return new ReturnData({
        status: 313,
        payload: inputs.map(input => input._id),
        messages: [`${alreadyExists.length} already exist`],
      });
    } else {
      return new ReturnData({
        status: 213,
        payload: inputs.map(input => input._id),
      });
    }
  };

  // #endregion

  // #region Read

  readAll: ReadAll<T> = async options => {
    if (!this._db.length) {
      return new ReturnData({
        status: 514,
        messages: ['Empty'],
      });
    }

    const check2 =
      !!options && options.limit && options.limit < this._db.length;

    if (check2) {
      return new ReturnData({
        status: 314,
        payload: this._db.slice(0, options.limit),
        messages: ['Limit Reached'],
      });
    }

    return new ReturnData({
      status: 214,
      payload: this._db.slice(0, options?.limit),
    });
  };

  readMany: ReadMany<T> = async ({ filters, options }) => {
    if (!this._db.length) {
      return new ReturnData({
        status: 515,
        messages: ['Empty'],
      });
    }

    const reads = this._db.filter(inStreamSearchAdapter(filters));
    if (!reads.length) {
      return new ReturnData({
        status: 315,
        messages: ['Empty'],
      });
    }
    if (options && options.limit && options.limit < reads.length) {
      return new ReturnData({
        status: 115,
        payload: reads.slice(0, options.limit),
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 215,
      payload: reads,
    });
  };

  readManyByIds: ReadManyByIds<T> = async ({ ids, filters, options }) => {
    if (!this._db.length) {
      return new ReturnData({
        status: 516,
        messages: ['Empty'],
      });
    }

    const reads1 = this._db.filter(data => ids.includes(data._id));
    if (!reads1.length) {
      return new ReturnData({
        status: 316,
        messages: ['Empty'],
      });
    }
    if (!filters) {
      if (options && options.limit && options.limit < reads1.length) {
        return new ReturnData({
          status: 116,
          payload: reads1.slice(0, options.limit),
          messages: ['Limit Reached'],
        });
      } else {
        return new ReturnData({
          status: 216,
          payload: reads1,
        });
      }
    }
    const reads2 = reads1.filter(inStreamSearchAdapter(filters));
    if (!reads2.length) {
      return new ReturnData({
        status: 316,
        messages: ['Filters kill data'],
      });
    }
    if (options && options.limit && options.limit < reads2.length) {
      return new ReturnData({
        status: 116,
        payload: reads2.slice(0, options.limit),
        messages: ['Limit Reached'],
      });
    }
    if (reads2.length < reads1.length) {
      return new ReturnData({
        status: 116,
        payload: reads2,
        messages: ['Filters slice datas'],
      });
    }
    return new ReturnData({
      status: 216,
      payload: reads1,
    });
  };

  readOne: ReadOne<T> = async ({ filters }) => {
    const payload = this._db.find(inStreamSearchAdapter(filters));
    if (payload) {
      return new ReturnData({ status: 217, payload });
    }
    return new ReturnData({ status: 517, messages: ['NotFound'] });
  };

  readOneById: ReadOneById<T> = async ({ _id, filters }) => {
    if (!this._db.length) {
      return new ReturnData({
        status: 518,
        messages: ['Empty'],
      });
    }
    const exits1 = this._db.find(data => data._id === _id);
    if (!filters) {
      if (!exits1) {
        return new ReturnData({ status: 518, messages: ['NotFound'] });
      } else return new ReturnData({ status: 218, payload: exits1 });
    }
    const exists2 = this._db
      .filter(data => data._id === _id)
      .find(inStreamSearchAdapter(filters));

    if (!exists2) {
      return new ReturnData({
        status: 318,
        messages: exits1 ? ['Not found'] : ['Filters kill data'],
      });
    }
    return new ReturnData({ status: 218, payload: exists2 });
  };

  countAll: CountAll = async () => {
    const out = this._db.length;
    if (out <= 0) {
      return new ReturnData({ status: 519, messages: ['Empty'] });
    }
    return new ReturnData({ status: 219, payload: out });
  };

  count: Count<T> = async ({ filters, options }) => {
    const payload = this._db.filter(inStreamSearchAdapter(filters)).length;
    if (payload <= 0) {
      return new ReturnData({ status: 520, messages: ['Empty'] });
    }
    const limit = options?.limit;
    if (limit && limit < payload) {
      return new ReturnData({
        status: 120,
        payload: limit,
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({ status: 220, payload });
  };

  // #endregion

  updateAll: UpdateAll<T> = async ({ data, options }) => {
    if (!this._db.length) {
      return new ReturnData({ status: 521, messages: ['Empty'] });
    }
    const db = [...this._db];
    const limit = options?.limit;
    const inputs = db
      .slice(0, limit)
      .map(_data => ({ ..._data, ...data }));
    if (limit && limit < db.length) {
      this._db.length = 0;
      this._db.push(...inputs);
      return new ReturnData({
        status: 121,
        payload: inputs.map(input => input._id),
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 221,
      payload: inputs.map(input => input._id),
    });
  };

  updateMany: UpdateMany<T> = async ({ filters, data, options }) => {
    if (!this._db.length) {
      return new ReturnData({ status: 522, messages: ['Empty'] });
    }
    const db = [...this._db];

    const _filter = inStreamSearchAdapter(filters);
    const limit = options?.limit;
    const inputs = db.filter(_filter);

    const payload = inputs.slice(0, limit).map(input => input._id);
    if (!inputs.length) {
      return new ReturnData({
        status: 322,
        messages: ['Filters kill data'],
      });
    }

    if (limit && limit < inputs.length) {
      this.__update(payload /*?*/, data);
      return new ReturnData({
        status: 122,
        payload,
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 222,
      payload,
    });
  };

  updateManyByIds: UpdateManyByIds<T> = async ({
    ids,
    filters,
    data,
    options,
  }) => {
    if (!this._db.length) {
      return new ReturnData({ status: 523, messages: ['Empty'] });
    }
    const db = [...this._db];
    const limit = options?.limit;

    // const mapper = (_data: WI<T>) => ({ ..._data, ...data });

    const inputs1 = db.filter(data => ids.includes(data._id));

    if (!inputs1.length) {
      return new ReturnData({
        status: 323,
        messages: ['ids cannot reach DB'],
      });
    }
    if (!filters) {
      const payload = inputs1.slice(0, limit).map(input => input._id);

      this.__update(payload, data);
      this._db; //?
      if (limit && limit < inputs1.length) {
        return new ReturnData({
          status: 123,
          payload,
          messages: ['Limit Reached'],
        });
      }
      return new ReturnData({
        status: 223,
        payload,
      });
    }
    const _filter = inStreamSearchAdapter(filters);
    const inputs2 = inputs1.filter(_filter);
    inputs2.length; //?
    const payload = inputs2.slice(0, limit).map(input => input._id);

    this.__update(payload, data);

    if (!inputs2.length) {
      return new ReturnData({
        status: 523,
        messages: ['Filters kill data'],
      });
    }
    if (limit && limit < inputs2.length) {
      return new ReturnData({
        status: 123,
        payload,
        messages: ['Limit Reached'],
      });
    }

    if (inputs2.length < inputs1.length) {
      return new ReturnData({
        status: 323,
        payload,
        messages: ['Filters slice datas'],
      });
    }

    return new ReturnData({
      status: 223,
      payload,
    });
  };

  updateOne: UpdateOne<T> = async () => {
    throw undefined;
  };
  updateOneById: UpdateOneById<T> = async () => {
    throw undefined;
  };
  setAll: SetAll<T> = async () => {
    throw undefined;
  };
  setMany: SetMany<T> = async () => {
    throw undefined;
  };
  setManyByIds: SetManyByIds<T> = async () => {
    throw undefined;
  };
  setOne: SetOne<T> = async () => {
    throw undefined;
  };
  setOneById: SetOneById<T> = async () => {
    throw undefined;
  };
  deleteAll: DeleteAll = async () => {
    throw undefined;
  };
  deleteMany: DeleteMany<T> = async () => {
    throw undefined;
  };
  deleteManyByIds: DeleteManyByIds<T> = async () => {
    throw undefined;
  };
  deleteOne: DeleteOne<T> = async () => {
    throw undefined;
  };
  deleteOneById: DeleteOneById<T> = async () => {
    throw undefined;
  };
  retrieveAll: RetrieveAll = async () => {
    throw undefined;
  };
  retrieveMany: RetrieveMany<T> = async () => {
    throw undefined;
  };
  retrieveManyByIds: RetrieveManyByIds<T> = async () => {
    throw undefined;
  };
  retrieveOne: RetrieveOne<T> = async () => {
    throw undefined;
  };
  retrieveOneById: RetrieveOneById<T> = async () => {
    throw undefined;
  };
  removeAll: RemoveAll = async () => {
    throw undefined;
  };
  removeMany: RemoveMany<T> = async () => {
    throw undefined;
  };
  removeManyByIds: RemoveManyByIds<T> = async () => {
    throw undefined;
  };
  removeOne: RemoveOne<T> = async () => {
    throw undefined;
  };
  removeOneById: RemoveOneById<T> = async () => {
    throw undefined;
  };
}
