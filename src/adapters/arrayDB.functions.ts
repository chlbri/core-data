import { decompose, recompose, type Ru } from '@bemedev/decompose';
import { dequal } from 'dequal';
import { z, type Primitive } from 'zod';
import { isNotClause } from '../functions';
import type {
  DataSearchOperations,
  Projection,
  ReduceByProjection,
  SearchOperation,
} from '../types';

function inStreamSearchAdapterKey<T>(
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

// #region ZodMatching
export type ZodMatching<
  T extends z.ZodRawShape,
  B extends boolean = true,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends z.AnyZodObject
    ?
        | `${Key}.${ZodMatching<T[Key]['shape'], B>}`
        | (B extends true ? Key : never)
    : Key
  : never;
// #endregion

function _zodDecomposeKeys(shape: z.ZodRawShape, addObjectKey = true) {
  const entries = Object.entries(shape).sort(([key1], [key2]) => {
    return key1.localeCompare(key2);
  });

  const out: string[] = [];
  entries.forEach(([key, value]) => {
    if (value instanceof z.ZodObject) {
      const virtuals = _zodDecomposeKeys(value.shape, addObjectKey).map(
        val1 => {
          return `${key}.${val1}`;
        },
      );
      if (addObjectKey) out.push(key);
      out.push(...virtuals);
    } else {
      out.push(key);
    }
  });
  return out;
}

export function zodDecomposeKeys<
  Z extends z.ZodRawShape,
  B extends boolean = true,
>(shape: Z, addObjectKey?: B) {
  return _zodDecomposeKeys(shape, addObjectKey) as ZodMatching<Z, B>[];
}

export function cleanProjection(...datas: string[]) {
  const out: string[] = [];
  datas.forEach(data => {
    const checkString = data.split('.')[0];
    const check = out.includes(checkString);
    if (!check) out.push(data);
  });
  return out;
}

const filterArrays = <T extends any[][]>(...arrays: T) => {
  const out = arrays.reduce((acc, curr) => {
    acc = curr.filter(value => acc.includes(value));
    return acc;
  });

  return out;
};

export function isPrimitive(value?: any): value is Primitive {
  const check1 =
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'symbol';

  return check1;
}

export function intersectObjects<T extends Ru[]>(...objects: T) {
  const len = objects.length;
  if (len === 0) return undefined;
  if (len === 1) return objects[0];

  const out: any = {};
  const keys = objects.map(Object.keys);
  const filterKeys = filterArrays(...keys);

  objects.forEach(obj => {
    const entries1 = Object.entries(obj);
    entries1.forEach(([key, value]) => {
      const _isPrimitive = isPrimitive(value);

      if (_isPrimitive) {
        const check1 = filterKeys.includes(key);
        if (check1) out[key] = value;
      } else {
        const recursives = objects.map(obj => {
          const check = key in obj;
          if (check) return obj[key];
          return undefined;
        }) as Ru[];

        const check = recursives.some(data => data === undefined);
        if (!check) out[key] = intersectObjects(...recursives);
      }
    });
  });

  return out;
}

/**
 *
 * @param data the data to reduce
 * @param projection The shape that the data will take
 */
export function withProjection<T extends Ru, P extends Projection<T> = []>(
  data: T,
  ...projection: P
) {
  const check = !projection.length;
  if (check) return data as ReduceByProjection<T, P>;
  const decomposed = decompose(data) as any;
  const reduced: any = {};
  const cleaned = cleanProjection(...projection);
  cleaned.forEach(key => {
    reduced[key] = decomposed[key];
  });
  const recomposed = recompose(reduced);

  return recomposed as ReduceByProjection<T, P>;
}

/**
 * Same as {@link withProjection}, but here the data is already flatten
 * @param data Data is already flatten
 * @param projection The shape that the data will take
 */
export function withProjection2<T extends Ru, P extends string[]>(
  data: T,
  ...projection: P
) {
  const check = !projection.length;
  if (check) return data;
  const reduced: any = {};
  const cleaned = cleanProjection(...projection);
  cleaned.forEach(key => {
    reduced[key] = data[key];
  });
  return reduced as Omit<T, P[number]>;
}

export function countOccurences<T extends string[]>(...arr: T) {
  const entries = arr.map(value => [value, 0]);
  const out = Object.fromEntries(entries);

  arr.forEach(value => {
    out[value] += 1;
  });

  type Out = Record<T[number], number>;

  return out as Out;
}
