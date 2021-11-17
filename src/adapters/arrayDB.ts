import {
  PermissionsForEntity,
  PermissionsReader,
} from './../types/permission';
import { Entity } from './../entities';
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
} from '../types/crud';
import deepEquals from 'fast-deep-equal';
import type { DataSearchOperations, SearchOperation } from '../types/dso';
import { isNotClause } from '../functions';
import { AtomicObject } from '..';

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
        return deepEquals(op, arg);
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
        return (arg: T) => deepEquals(arg, value);
      case '$ne':
        return (arg: T) => !deepEquals(arg, value);
      case '$in':
        return (arg: T) => {
          return (value as any[]).some(val => deepEquals(arg, val));
        };
      case '$nin':
        return (arg: T) => {
          return (value as any[]).every(val => !deepEquals(arg, val));
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
          (arg as unknown as string[]).every(val =>
            deepEquals(val, value),
          );
      case '$em':
        return (arg: T) =>
          (arg as unknown as string[]).some(val => deepEquals(val, value));
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

type Permission<T extends Entity> = {
  permissionReader: PermissionsReader<T>;
};



export default class ArrayDB<T extends Entity> implements CRUD<T> {
  /* , Permission<T> */
  constructor(private _db: AtomicObject<T>[], private col?: string) {}
  readonly permissionReader: PermissionsReader<T> = dso => {
    this._db.filter(inStreamSearchAdapter(dso)).map(data => data);
  };
  createMany: CreateMany<T>;
  createOne: CreateOne<T>;
  upsertOne: UpsertOne<T>;
  upsertMany: UpsertMany<T>;
  readAll: ReadAll<T>;
  readMany: ReadMany<T>;
  readManyByIds: ReadManyByIds<T>;
  readOne: ReadOne<T>;
  readOneById: ReadOneById<T>;
  countAll: CountAll;
  count: Count<T>;
  updateAll: UpdateAll<T>;
  updateMany: UpdateMany<T>;
  updateManyByIds: UpdateManyByIds<T>;
  updateOne: UpdateOne<T>;
  updateOneById: UpdateOneById<T>;
  setAll: SetAll<T>;
  setMany: SetMany<T>;
  setManyByIds: SetManyByIds<T>;
  setOne: SetOne<T>;
  setOneById: SetOneById<T>;
  deleteAll: DeleteAll;
  deleteMany: DeleteMany<T>;
  deleteManyByIds: DeleteManyByIds<T>;
  deleteOne: DeleteOne<T>;
  deleteOneById: DeleteOneById<T>;
  removeAll: RemoveAll;
  removeMany: RemoveMany<T>;
  removeManyByIds: RemoveManyByIds<T>;
  removeOne: RemoveOne<T>;
  removeOneById: RemoveOneById<T>;
  retrieveAll: RetrieveAll;
  retrieveMany: RetrieveMany<T>;
  retrieveManyByIds: RetrieveManyByIds<T>;
  retrieveOne: RetrieveOne<T>;
  retrieveOneById: RetrieveOneById<T>;
}
