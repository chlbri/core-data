import type { RD, Status } from '@bemedev/return-data';
import type { Objects, Pipe } from 'hotscript';

import type {
  Entity,
  WithId,
  WithoutId,
  WithoutTimeStamps,
} from '../entities';
import type { DSO } from './dso';

export type ErrorHandler = (error?: any) => never;

export type QueryOptions = {
  limit?: number;
  errorHandler?: ErrorHandler;
  after?: string;
  before?: string;
};

export type PromiseRD<T> = Promise<RD<T, Status>>;

export type StringKeys<T> = Pipe<T, [Objects.AllPaths]>;

export type Projection<T> = { [key in StringKeys<T>]: boolean | 0 | 1 };

export type DP<T> = Pipe<T, [Objects.PartialDeep]>;

export type WI<T> = WithId<DP<T>>;
export type WO<T> = WithoutId<DP<T>>;
export type WT<T> = WithoutTimeStamps<T>;

export type PRDI<T> = PromiseRD<WI<T>>;
export type PRDIM<T> = PromiseRD<WI<T>[]>;

// #region Create

export type CreateMany<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>[];
  options?: QueryOptions;
  projection?: Projection<T>;
}) => PromiseRD<{
  all: number;
  createds: number;
  ids: string[];
}>;

export type CreateOne<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string>;

export type UpsertOne<T extends Entity> = (args: {
  _id?: string;
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string>;

export type UpsertMany<T extends Entity> = (args: {
  actorID: string;
  upserts: { _id?: string; data: WO<T> }[];
  options?: QueryOptions;
}) => PromiseRD<string>;

// #endregion

// #region Read

export type ReadAll<T extends Entity> = (
  actorID: string,
  options?: QueryOptions,
) => PRDIM<T>;

export type ReadMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

export type ReadManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

export type ReadOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PRDI<T>;

export type ReadOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PRDI<T>;

// #endregion

// #region Count

export type CountAll = (actorID: string) => PromiseRD<number>;

export type Count<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<number>;

// #endregion

// #region Update

export type UpdateAll<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  data: WO<T>;
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type UpdateOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type UpdateOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  data: WO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

// #endregion

// #region Set

export type SetAll<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PromiseRD<string[]>;

export type SetOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: Omit<QueryOptions, 'limit'>;
}) => PromiseRD<string>;

export type SetOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  data: WO<T>;
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

export interface Repository<T extends Entity> {
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
