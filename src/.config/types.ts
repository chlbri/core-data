// import { TupleOf } from './arrays';
export type Equals = {
  $eq: any;
};
export type NotEquals = {
  $ne: any;
};
export type ObjectIn<T = any> = {
  $in: T[];
};
export type ObjectNotIn<T = any> = {
  $nin: T[];
};
export type GreaterThan = {
  $gt: number;
};
export type GreaterThanOrEquals = {
  $gte: number;
};
export type LessThan = {
  $lt: number;
};
export type LessThanOrEquals = {
  $lte: number;
};
export type Modulo = {
  $mod: number;
};
export type StringContains = {
  $cts: string;
};
export type StartsWith = {
  $sw: string;
};
export type EndsWith = {
  $ew: string;
};
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
export type RegEx = {
  $regex: string | RegExp;
};
export type Text = {
  $text: string | RegExp;
};
export type TypeAliases =
  | 'double'
  | 'string'
  | 'object'
  | 'array'
  | 'binData'
  | 'objectId'
  | 'bool';
type ArrayHelper1<T extends any[]> = Partial<VSO<T[number]>> | T[number];
export type All<T extends any[] = any[]> = {
  $all: T extends any[] ? ArrayHelper1<T> : never;
};
export type ElementMatch<T extends any[] = any[]> = {
  $em: T extends any[] ? ArrayHelper1<T> : never;
};
export type Size<T extends any[] = any[]> = {
  $size: T extends any[] ? number : never;
};
export type ArrayClauses<T = any[]> = T extends any[]
  ? All<T> | ElementMatch<T> | Size<T>
  : {};
export type ExistsProp = {
  $exists: true;
};
export type NotExistsProp = {
  $exists: false;
};
type VSOAny<T = any> = Equals & NotEquals & ObjectIn<T> & ObjectNotIn<T>;
type VSONumber = VSOAny<number> &
  GreaterThan &
  GreaterThanOrEquals &
  LessThan &
  LessThanOrEquals &
  Modulo;
type VSOString = VSOAny<string> & StringContains & StartsWith & EndsWith;
export type ValueSearchOperations<T = string> = T extends number
  ? VSONumber
  : T extends string
  ? VSOString
  : VSOAny<T>;
export type VSO<T = any> = ValueSearchOperations<T>;
type LogH<T> = Partial<VSO<T> | LogicalClauses<T> | T>;
export type And<T = any> = {
  $and: LogH<T>[];
};
export type Not<T = any> = {
  $not: LogH<T>;
};
export type Nor<T = any> = {
  $nor: LogH<T>[];
};
export type Or<T = any> = {
  $or: LogH<T>[];
};
export type LogicalClauses<T = any> = And<T> | Not<T> | Nor<T> | Or<T>;
export type Slice = {
  $slice: number | [number, number];
};

export type SearchOperation<K> = K extends
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
export type DataSearchOperations<T> =
  | Not<T>
  | {
      [key in keyof T]?: SearchOperation<T[key]>;
    };

export function isNotClause(value: any): value is Not {
  return Object.keys(value) === ['$not'];
}
export {};
