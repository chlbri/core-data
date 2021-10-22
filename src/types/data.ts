import { TypeOf, ZodLiteral, ZodTuple } from 'zod';
import {
  ARRAY_CLAUSES,
  COMMON_CLAUSES,
  EXIST_CLAUSES,
  LOGICAL_CLAUSES,
  NUMBER_CLAUSES,
  STRING_CLAUSES,
  TYPE_ALIASES,
} from '../schemas/strings';

type inferUnion<T extends ZodTuple> = TypeOf<T>[number];

// type inferKey<T extends ZodTuple, K extends inferUnion<T>> = K;

export type inferClause<
  T extends ZodTuple | ZodLiteral<any>,
  K extends T extends ZodTuple ? inferUnion<T> : TypeOf<T>,
  R = any,
> = {
  [key in K]: R;
};

// import { TupleOf } from './arrays';
export type Equals = inferClause<typeof COMMON_CLAUSES, '$eq'>;

export type NotEquals = inferClause<typeof COMMON_CLAUSES, '$ne'>;

export type ObjectIn<T = any> = inferClause<
  typeof COMMON_CLAUSES,
  '$in',
  T[]
>;

export type ObjectNotIn<T = any> = inferClause<
  typeof COMMON_CLAUSES,
  '$nin',
  T[]
>;

export type GreaterThan = inferClause<
  typeof NUMBER_CLAUSES,
  '$gt',
  number
>;

export type GreaterThanOrEquals = inferClause<
  typeof NUMBER_CLAUSES,
  '$gte',
  number
>;

export type LessThan = inferClause<typeof NUMBER_CLAUSES, '$lt', number>;

export type LessThanOrEquals = inferClause<
  typeof NUMBER_CLAUSES,
  '$lte',
  number
>;

export type Modulo = inferClause<typeof NUMBER_CLAUSES, '$mod', number>;

export type StringContains = inferClause<
  typeof STRING_CLAUSES,
  '$cts',
  string
>;

export type StartsWith = inferClause<typeof STRING_CLAUSES, '$sw', string>;

export type EndsWith = inferClause<typeof STRING_CLAUSES, '$ew', string>;

export type Language =
  | 'da'
  | 'du'
  | 'en'
  | 'fi'
  | 'fr'
  | 'de'
  | 'hu'
  | 'it'
  | 'nb'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'es'
  | 'sv'
  | 'tr';

export type RegEx = inferClause<
  typeof STRING_CLAUSES,
  '$regex',
  string | RegExp
>;

export type TypeAliases = inferUnion<typeof TYPE_ALIASES>;

type ArrayHelper1<T extends any[]> = Partial<VSO<T[number]>> | T[number];

export type All<T extends any[] = any[]> = inferClause<
  typeof ARRAY_CLAUSES,
  '$all',
  ArrayHelper1<T>
>;

export type ElementMatch<T extends any[] = any[]> = inferClause<
  typeof ARRAY_CLAUSES,
  '$em',
  ArrayHelper1<T>
>;

export type Size = inferClause<typeof ARRAY_CLAUSES, '$size', number>;

export type ArrayClauses<T = any[]> = T extends any[]
  ? All<T> | ElementMatch<T> | Size
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {};

export type ExistsProp = inferClause<
  typeof EXIST_CLAUSES,
  '$exists',
  true
>;

export type NotExistsProp = inferClause<
  typeof EXIST_CLAUSES,
  '$exists',
  false
>;

type VSOAny<T = any> = Equals & NotEquals & ObjectIn<T> & ObjectNotIn<T>;
type VSONumber = VSOAny<number> &
  GreaterThan &
  GreaterThanOrEquals &
  LessThan &
  LessThanOrEquals &
  Modulo;
type VSOString = VSOAny<string> &
  StringContains &
  StartsWith &
  EndsWith &
  RegEx;
export type ValueSearchOperations<T = string> = T extends number
  ? VSONumber
  : T extends string
  ? VSOString
  : VSOAny<T>;
export type VSO<T = any> = ValueSearchOperations<T>;

type LogH<T> = Partial<VSO<T> | LogicalClauses<T> | T>;

export type And<T = any> = inferClause<
  typeof LOGICAL_CLAUSES,
  '$and',
  LogH<T>[]
>;

export type Not<T = any> = {
  $not: LogH<T>;
};

export type Nor<T = any> = inferClause<
  typeof LOGICAL_CLAUSES,
  '$nor',
  LogH<T>[]
>;

export type Or<T = any> = inferClause<
  typeof LOGICAL_CLAUSES,
  '$or',
  LogH<T>[]
>;

export type LogicalClauses<T = any> = And<T> | Not<T> | Nor<T> | Or<T>;
// export type Slice = {
//   $slice: number | [number, number];
// };

export type SearchOperation<K = any> = K extends
  | string
  | number
  | bigint
  | boolean
  | any[]
  ?
      | Partial<
          (NotExistsProp | ExistsProp) &
            VSO<K> &
            LogicalClauses<K> &
            ArrayClauses<K>
        >
      | K
  : {
      [key in keyof K]?: SearchOperation<K[key]>;
    };

export type SO<K> = SearchOperation<K>;

export type ObjectSearchOperations<T = any> = {
  [key in keyof T]?: SearchOperation<T[key]>;
};

export type DataSearchOperations<T = any> =
  | Not<T>
  | ObjectSearchOperations<T>;

export type OSO<T = any> = ObjectSearchOperations<T>;
export type DSO<T = any> = DataSearchOperations<T>;

// TODO: Use zod to generate types
