import { expectType } from 'tsd';
import { z } from 'zod';
import { Entity } from './entities';
import { isEntity } from './functions';

// #region obj is {} and shape is { age: z.number() }
const ttE1 = {};
const check1 = isEntity(ttE1, { age: z.number() });
if (check1) {
  expectType<Entity & { age: number }>(ttE1);
}
expectType<{}>(ttE1);
// #endregion

// #region obj is { uuid: 6778 } and shape is empty
const ttE2 = { uuid: 6778 };
const check2 = isEntity(ttE2);
if (check2) {
  expectType<Entity & { uuid: number }>(ttE2);
}
expectType<{ uuid: number }>(ttE2);
// #endregion

// #region obj is { uuid: 6778 } and shape = { login: z.string() }
const check3 = isEntity(ttE2, { login: z.string() });
if (check3) {
  expectType<Entity & { uuid: number } & { login: string }>(ttE2);
}
expectType<{ uuid: number }>(ttE2);
// #endregion
