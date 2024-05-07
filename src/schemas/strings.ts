import { literal, z } from 'zod';
export const STATUS_STRINGS = [
  'information',
  'success',
  'redirect',
  'client-error',
  'server-error',
  'permission-error',
  'timeout-error',
] as const;

export const PERMISSIONS_STRINGS = z.tuple([
  literal('__read'),
  literal('__write'),
  literal('__remove'),
]);

export const EXIST_CLAUSES = z.literal('$exists');

export const COMMON_CLAUSES = z.tuple([
  literal('$eq'),
  literal('$ne'),
  literal('$in'),
  literal('$nin'),
]);

export const NUMBER_CLAUSES = z.tuple([
  literal('$gt'),
  literal('$gte'),
  literal('$lt'),
  literal('$lte'),
  literal('$mod'),
]);

export const STRING_CLAUSES = z.tuple([
  literal('$cts'),
  literal('$sw'),
  literal('$ew'),
  literal('$regex'),
]);

export const ARRAY_CLAUSES = z.tuple([
  literal('$all'),
  literal('$em'),
  literal('$size'),
]);

export const LOGICAL_CLAUSES = z.tuple([
  literal('$and'),
  literal('$not'),
  literal('$or'),
  literal('$nor'),
]);

export const TYPE_ALIASES = z.tuple([
  literal('string'),
  literal('number'),
  literal('object'),
  literal('array'),
  literal('binData'),
  literal('objectId'),
  literal('boolean'),
  literal('date'),
]);

export const CLAUSES = z.tuple([
  EXIST_CLAUSES,
  ...COMMON_CLAUSES.items,
  ...NUMBER_CLAUSES.items,
  ...STRING_CLAUSES.items,
  ...ARRAY_CLAUSES.items,
  ...LOGICAL_CLAUSES.items,
]);
