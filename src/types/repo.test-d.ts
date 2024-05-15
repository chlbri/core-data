import { expectNotType, expectType } from 'tsd';
import { Entity } from './entities';
import {
  CreateMany,
  PromiseRD,
  QueryOptions,
  ToOptional,
  WO,
  WT,
} from './repo';

declare const ttO1: ToOptional<['er', 'fr', 'es']>;
expectType<
  [('er' | undefined)?, ('fr' | undefined)?, ('es' | undefined)?]
>(ttO1);

// #region Entity & { age: number }
type Ent1 = Entity & { age: number };
declare const ttE1: CreateMany<Ent1>;
expectType<
  (args: {
    actorID: string;
    data: WT<Ent1>[];
    options?: QueryOptions;
  }) => PromiseRD<string[]>
>(ttE1);
// #endregion

// #region Vanilla Entity
declare const ttE2: CreateMany<Entity>;
expectType<
  (args: {
    actorID: string;
    data: WT<Entity>[];
    options?: QueryOptions;
  }) => PromiseRD<string[]>
>(ttE2);
expectNotType<
  (args: {
    actorID: string;
    data: WO<Entity>[];
    options?: QueryOptions;
    projection?: never[];
  }) => PromiseRD<{
    all?: number;
    createds?: number;
    ids: string[];
    projections?: [];
  }>
>(ttE2);
expectNotType<
  (args: {
    actorID: string;
    data: WO<Entity>[];
    options: QueryOptions;
  }) => PromiseRD<{
    all?: number;
    createds?: number;
    ids: string[];
  }>
>(ttE2);
// #endregion
