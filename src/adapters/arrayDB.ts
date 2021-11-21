import { ReturnData } from 'core-promises';
import { dequal } from 'dequal/lite';
import { nanoid } from 'nanoid';
import { CollectionPermissions } from '../entities';
import { isNotClause } from '../functions';
import {
  Count,
  CountAll,
  CreateMany,
  CreateOne,
  CRUD,
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
} from '../types/crud';
import type { DataSearchOperations, SearchOperation } from '../types/dso';
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
        Object.keys(keys) === Object.keys(arg)
      ) {
        return dequal(op, arg);
      }
      return inStreamSearchAdapter(op)(arg);
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

export function inStreamSearchAdapter<T>(filter: DataSearchOperations<T>) {
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

export class ArrayCRUD_DB<T extends Entity> implements CRUD<T> {
  /* , Permission<T> */
  constructor(
    private _db: WI<T>[],
    private permissions: CollectionPermissions,
  ) {}

  rinitDB() {
    this._db.length = 0;
  }

  get length() {
    return this._db.length;
  }

  // readonly permissionReaderMany: PermissionsReaderMany<T> = dso => {
  //   const datas = this._db.filter(inStreamSearchAdapter(dso));
  //   const out = datas.map(getPermissions);
  //   return out;
  // };
  // readonly permissionReaderOne: PermissionsReaderOne<T> = dso =>
  //   this.permissionReaderMany(dso)[0];

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
      const message = 'Limit exceeded';
      const rd = new ReturnData({ status: 110, payload, message });
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
      const message = 'Already exists';
      return new ReturnData({ status: 312, payload: _id, message });
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
          message: `${alreadyExists} already exist`,
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
        message: `${alreadyExists} already exist`,
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
    if (options && options.limit && options.limit < this._db.length) {
      return new ReturnData({
        status: 314,
        payload: this._db.slice(0, options.limit),
        message: 'Limit Reached',
      });
    }
    if (!this._db.length) {
      return new ReturnData({
        status: 514,
        message: 'Empty',
      });
    }
    return new ReturnData({
      status: 214,
      payload: this._db.slice(0, options?.limit),
    });
  };

  readMany: ReadMany<T> = async ({ filters, options }) => {
    const reads = this._db.filter(inStreamSearchAdapter(filters));
    if (!reads.length) {
      return new ReturnData({
        status: 515,
        message: 'Empty',
      });
    }
    if (options && options.limit && options.limit < reads.length) {
      return new ReturnData({
        status: 115,
        payload: reads.slice(0, options.limit),
        message: 'Limit exceeded',
      });
    }
    return new ReturnData({
      status: 215,
      payload: reads,
    });
  };

  readManyByIds: ReadManyByIds<T> = async ({ ids, filters, options }) => {
    const reads1 = this._db.filter(data => ids.includes(data._id));
    if (!reads1.length) {
      return new ReturnData({
        status: 516,
        message: 'Empty',
      });
    }
    if (!filters) {
      if (options && options.limit && options.limit < reads1.length) {
        return new ReturnData({
          status: 116,
          payload: reads1.slice(0, options.limit),
          message: 'Limit exceeded',
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
        status: 516,
        message: 'Filters kill data',
      });
    }
    if (options && options.limit && options.limit < reads2.length) {
      return new ReturnData({
        status: 116,
        payload: reads2.slice(0, options.limit),
        message: 'Limit exceeded',
      });
    }
    if (reads2.length < reads1.length) {
      return new ReturnData({
        status: 316,
        payload: reads2,
        message: 'Filters slice datas',
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
    return new ReturnData({ status: 517, message: 'NotFound' });
  };

  readOneById: ReadOneById<T> = async ({ _id, filters }) => {
    const exits1 = this._db.find(data => data._id === _id);
    if (!filters) {
      if (!exits1) {
        return new ReturnData({ status: 518, message: 'Not Found' });
      } else return new ReturnData({ status: 218, payload: exits1 });
    }
    const exists2 = this._db
      .filter(data => data._id === _id)
      .find(inStreamSearchAdapter(filters));

    if (!exists2) {
      return new ReturnData({
        status: 518,
        message: exits1 ? 'Not found' : 'Filters kill data',
      });
    }
    return new ReturnData({ status: 218, payload: exists2 });
  };

  countAll: CountAll = async () => {
    const out = this._db.length;
    if (out <= 0) {
      return new ReturnData({ status: 519, message: 'Empty' });
    }
    return new ReturnData({ status: 219, payload: this._db.length });
  };

  count: Count<T> = async ({ filters, options }) => {
    const payload = this._db.filter(inStreamSearchAdapter(filters)).length;
    if (payload <= 0) {
      return new ReturnData({ status: 520, message: 'Empty' });
    }
    const limit = options?.limit;
    if (limit && limit < payload) {
      return new ReturnData({
        status: 120,
        payload: limit,
        message: 'Limit exceeded',
      });
    }
    return new ReturnData({ status: 220, payload });
  };

  // #endregion

  updateAll: UpdateAll<T> = async () => {
    throw undefined;
  };
  updateMany: UpdateMany<T> = async () => {
    throw undefined;
  };
  updateManyByIds: UpdateManyByIds<T> = async () => {
    throw undefined;
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
