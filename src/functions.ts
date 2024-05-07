import { z } from 'zod';
import { Entity, WithEntity } from './entities';
import { entitySchema } from './schemas';
import type { Not, VSO } from './types/dso';

export function isSearchOperation(val: any): val is VSO {
  return Object.keys(val).every(val => val.startsWith('$'));
}

export function isNotClause<T = any>(value: any): value is Not<T> {
  return Object.keys(value)[0] === '$not';
}

export function includesMany<T>(array: T[], includes: T[]) {
  return includes.every(include => array.includes(include));
}

type IsEntityT<Z extends z.ZodRawShape> = WithEntity<
  z.infer<z.ZodObject<Z>>
>;

export function isEntity<Z extends []>(
  value: any,
  ...args: Z
): value is Entity;

export function isEntity<Z extends [shape: z.ZodRawShape]>(
  value: any,
  ...args: Z
): value is IsEntityT<Z[0]>;

export function isEntity<Z extends [shape: z.ZodRawShape] | []>(
  value: any,
  ...[shape]: Z
) {
  if (shape) {
    return entitySchema(shape).safeParse(value).success;
  }
  return entitySchema().safeParse(value).success;
}

const tto = {};
const ttest = isEntity(tto);

if (ttest) {
  tto._id;
}

const ttest2 = isEntity(tto, { login: z.string() });
if (ttest2) {
  tto.login;
}
