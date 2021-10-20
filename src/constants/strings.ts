import { literal, tuple, TypeOf } from 'zod';
import { concatTuple } from '../.config';
export const STATUS_STRINGS = [
  'information',
  'success',
  'redirect',
  'client-error',
  'server-error',
  'permission-error',
  'timeout-error',
] as const;

export const PERMISSIONS_STRINGS = [
  '_read',
  '_update',
  '_delete',
] as const;

export const EXIST_CLAUSES = literal('$exists');

export const COMMON_CLAUSES = tuple([
  literal('$eq'),
  literal('$ne'),
  literal('$in'),
  literal('$nin'),
]);

export const NUMBER_CLAUSES = tuple([
  literal('$gt'),
  literal('$gte'),
  literal('$lt'),
  literal('$lte'),
  literal('$mod'),
]);

export const STRING_CLAUSES = tuple([
  literal('$cts'),
  literal('$sw'),
  literal('$ew'),
  literal('$regex'),
]);

export const ARRAY_CLAUSES = tuple([
  literal('$all'),
  literal('$em'),
  literal('$size'),
]);

export const LOGICAL_CLAUSES = tuple([
  literal('$and'),
  literal('$not'),
  literal('$or'),
  literal('$nor'),
]);

export const TYPE_ALIASES = tuple([
  literal('string'),
  literal('double'),
  literal('object'),
  literal('array'),
  literal('binData'),
  literal('objectId'),
  literal('bool'),
]);


export const CLAUSES = concatTuple(
  EXIST_CLAUSES,
  ...COMMON_CLAUSES.items,
  ...NUMBER_CLAUSES.items,
  ...STRING_CLAUSES.items,
  ...ARRAY_CLAUSES.items,
  ...LOGICAL_CLAUSES.items,
);

type Test = TypeOf<typeof CLAUSES>