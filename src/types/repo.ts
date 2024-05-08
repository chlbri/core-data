import type { RD, Status } from '@bemedev/return-data';

import { StateMatching } from '@bemedev/decompose';
import type {
  Entity,
  WithEntity,
  WithId,
  WithoutId,
  WithoutTimeStamps,
} from '../entities';
import type { DSO } from './dso';

export type ErrorHandler = (error?: any) => never;

export type QueryOptions = {
  limit?: number;
};

export type PromiseRD<T> = Promise<RD<T, Status>>;

export type StringKeys<T extends Ru> = StateMatching<T>;

export type Ru = Record<string, unknown>;
export type Ra = Record<string, any>;

export type Projection<T extends Ru> = StringKeys<WT<T>>[];

export type ToOptional<T extends any[]> = T['length'] extends 0
  ? []
  : T['length'] extends 1
    ? [T[0]?]
    : T extends [infer First, ...infer Rest]
      ? [First?, ...ToOptional<Rest>]
      : never;

export type DP<T> = {
  [P in keyof T]+?: DP<T[P]>;
};

export type WI<T> = WithId<DP<T>>;
export type WO<T> = WithoutId<DP<T>>;
export type WT<T> = WithoutTimeStamps<T>;

export type PromiseRDwithID<T> = PromiseRD<WI<T>>;
export type PromiseRDwithIdMany<T> = PromiseRD<WI<T>[]>;

// #region Create

export type CreateMany<T extends Ru> = (args: {
  actorID: string;
  data: WT<T>[];
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type CreateOne<T extends Ru> = (args: {
  actorID: string;
  data: WT<T>;
}) => PromiseRD<string>;

export type UpsertOne<T extends Ru> = (args: {
  actorID: string;
  id?: string;
  data: WT<T>;
}) => PromiseRD<string>;

export type UpsertMany<T extends Ru> = (args: {
  actorID: string;
  upserts: { _id?: string; data: WT<T> }[];
  options?: QueryOptions;
}) => PromiseRD<string[]>;

// #endregion

// #region Read

export type ReadAll<T extends Ru> = (
  actorID: string,
  options?: QueryOptions,
) => PromiseRDwithIdMany<WithEntity<T>>;

export type ReadMany<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PromiseRDwithIdMany<T>;

export type ReadManyByIds<T extends Ru> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRDwithIdMany<T>;

export type ReadOne<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
}) => PromiseRDwithID<T>;

export type ReadOneById<T extends Ru> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
}) => PromiseRDwithID<T>;

// #endregion

// #region Count

export type CountAll = (actorID: string) => PromiseRD<number>;

export type Count<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<number>;

// #endregion

// #region Update

export type UpdateAll<T extends Ru> = (args: {
  actorID: string;
  data: WT<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateMany<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WT<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateManyByIds<T extends Ru> = (args: {
  actorID: string;
  ids: string[];
  data: WT<T>;
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateOne<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WT<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type UpdateOneById<T extends Ru> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  data: WT<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

// #region Set

export type SetAll<T extends Ru> = (args: {
  actorID: string;
  data: WT<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetMany<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WT<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetManyByIds<T extends Ru> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  data: WT<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetOne<T extends Ru> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WT<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type SetOneById<T extends Ru> = (args: {
  actorID: string;
  id: string;
  data: WT<T>;
  filters?: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

// #region Delete

export type DeleteAll = (
  actorID: string,
  options?: QueryOptions,
) => PromiseRD<string[]>;

export type DeleteMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type DeleteManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;
export type DeleteOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type DeleteOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

// #region Remove

export type RemoveAll = (
  actorID: string,
  options?: QueryOptions,
) => PromiseRD<string[]>;

export type RemoveMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type RemoveManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type RemoveOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type RemoveOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

// #region Retrieve

export type RetrieveAll = (
  actorID: string,
  options?: QueryOptions,
) => PromiseRD<string[]>;

export type RetrieveMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type RetrieveManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type RetrieveOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type RetrieveOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

export interface Repository<T extends Ru> {
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

export type Repo<T extends Entity> = Repository<T>;
