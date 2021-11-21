import type { DeepPartial, NOmit, StringKeys } from 'core';
import { RD, Status } from 'core-promises';
import { Entity, WithId, WithoutId, WithoutTimeStamps } from '../entities';
import type { DSO } from './dso';

export type PRD<T> = Promise<RD<T, Status>>;

export type Projection<T> = { [key in StringKeys<T>]: boolean | 0 | 1 };

export type DP<T> = DeepPartial<T>;

export type WI<T> = WithId<DP<T>>;
export type WO<T> = WithoutId<DP<T>>;
export type WT<T> = WithoutTimeStamps<T>;

export type PRDI<T> = PRD<WI<T>>;
export type PRDIM<T> = PRD<WI<T>[]>;
// type PRDO<T> = PRD<WO<DP<T>>>;
// type PRDOM<T> = PRD<WO<DP<T>>[]>;

export type ErrorHandler = (error?: any) => never;

export type QueryOptions = {
  limit?: number;
  errorHandler?: ErrorHandler;
  after?: string;
  before?: string;
};

// #region Create

export type CreateMany<T extends Entity> = (args: {
  data: WT<WO<T>>[];
  options?: QueryOptions;
}) => PRD<string[]>;

export type CreateOne<T extends Entity> = (args: {
  data: WT<WO<T>>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type UpsertOne<T extends Entity> = (args: {
  _id?: string;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type UpsertMany<T extends Entity> = (args: {
  upserts: { _id?: string; data: WO<T> }[];
  options?: QueryOptions;
}) => PRD<string[]>;

// #endregion

// #region Read

export type ReadAll<T extends Entity> = (
  options?: QueryOptions,
) => PRDIM<T>;

export type ReadMany<T extends Entity> = (args: {
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

export type ReadManyByIds<T extends Entity> = (args: {
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

export type ReadOne<T extends Entity> = (args: {
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;

export type ReadOneById<T extends Entity> = (args: {
  _id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;

// #endregion

// #region Count

export type CountAll = () => PRD<number>;

export type Count<T extends Entity> = (args: {
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<number>;

// #endregion

// #region Update

export type UpdateAll<T extends Entity> = (args: {
  data: Omit<WO<T>, '_updatedAt'>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type UpdateMany<T extends Entity> = (args: {
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type UpdateManyByIds<T extends Entity> = (args: {
  ids: string[];
  data: WO<T>;
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type UpdateOne<T extends Entity> = (args: {
  filters: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type UpdateOneById<T extends Entity> = (args: {
  id: string;
  filters?: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Set

export type SetAll<T extends Entity> = (args: {
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type SetMany<T extends Entity> = (args: {
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type SetManyByIds<T extends Entity> = (args: {
  ids: string[];
  filters?: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type SetOne<T extends Entity> = (args: {
  filters: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type SetOneById<T extends Entity> = (args: {
  id: string;
  data: WO<T>;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Delete

export type DeleteAll = (options?: QueryOptions) => PRD<string[]>;

export type DeleteMany<T> = (args: {
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type DeleteManyByIds<T> = (args: {
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type DeleteOne<T> = (args: {
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type DeleteOneById<T> = (args: {
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Remove

export type RemoveAll = (options?: QueryOptions) => PRD<string[]>;

export type RemoveMany<T> = (args: {
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type RemoveManyByIds<T> = (args: {
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type RemoveOne<T> = (args: {
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type RemoveOneById<T> = (args: {
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Retrieve

export type RetrieveAll = (options?: QueryOptions) => PRD<string[]>;

export type RetrieveMany<T> = (args: {
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type RetrieveManyByIds<T> = (args: {
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

export type RetrieveOne<T> = (args: {
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

export type RetrieveOneById<T> = (args: {
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

export interface CRUD<T extends Entity> {
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
  retrieveAll: RetrieveAll;
  retrieveMany: RetrieveMany<T>;
  retrieveManyByIds: RetrieveManyByIds<T>;
  retrieveOne: RetrieveOne<T>;
  retrieveOneById: RetrieveOneById<T>;
  removeAll: RemoveAll;
  removeMany: RemoveMany<T>;
  removeManyByIds: RemoveManyByIds<T>;
  removeOne: RemoveOne<T>;
  removeOneById: RemoveOneById<T>;
}
