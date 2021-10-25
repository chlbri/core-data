import RD, { Status } from 'core-promises';
import type { DeepPartial, NOmit } from 'core';
import { TypeOf } from 'zod/lib/types';
import { Entity, WithId, WithoutId } from '../entities';
import type { DSO } from './data';

export type PRD<T> = Promise<RD<T, TypeOf<Status>>>;

type DP<T> = DeepPartial<T>;

type WI<T> = WithId<T>;
type WO<T> = WithoutId<T>;

type PRDI<T> = PRD<WI<DP<T>>>;
type PRDIM<T> = PRD<WI<DP<T>>[]>;
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

export type CreateMany<T extends Entity> = (
  data: WO<T>[],
  errorHandler?: ErrorHandler,
) => PRD<{
  all: number;
  done: number;
  ids: string[];
}>;

export type CreateOne<T extends Entity> = (
  data: WO<T>,
  errorHandler?: ErrorHandler,
) => PRD<string>;

export type UpsertOne<T extends Entity> = (
  _id: string,
  data: WithoutId<T>,
  errorHandler?: ErrorHandler,
) => PRD<string>;

// #endregion

// #region Read

export type ReadAll<T extends Entity> = (
  options?: QueryOptions,
) => PRDIM<T>;

export type ReadMany<T extends Entity> = (
  filters: DSO<T>,
  options?: QueryOptions,
) => PRDIM<T>;

export type ReadManyByIds<T extends Entity> = (
  ids: string[],
  filters?: DSO<T>,
  options?: QueryOptions,
) => PRDIM<T>;

export type ReadOne<T extends Entity> = (
  filters: DSO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRDI<T>;

export type ReadOneById<T extends Entity> = (
  id: string,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRDI<T>;

// #endregion

// #region Count

export type CountAll = () => PRD<number>;

export type Count<T extends Entity> = (
  filters: DSO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<number>;

// #endregion

// #region Update

export type UpdateAll<T extends Entity> = (
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type UpdateMany<T extends Entity> = (
  filters: DSO<T>,
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type UpdateManyByIds<T extends Entity> = (
  ids: string[],
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type UpdateOne<T extends Entity> = (
  filters: DSO<T>,
  data: WO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

export type UpdateOneById<T extends Entity> = (
  id: string,
  data: WO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

// #endregion

// #region Set

export type SetAll<T extends Entity> = (
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type SetMany<T extends Entity> = (
  filters: DSO<T>,
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type SetManyByIds<T extends Entity> = (
  ids: string[],
  data: WO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type SetOne<T extends Entity> = (
  filters: DSO<T>,
  data: WO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

export type SetOneById<T extends Entity> = (
  id: string,
  data: WO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

// #endregion

// #region Delete

export type DeleteAll = (options?: QueryOptions) => PRD<string[]>;

export type DeleteMany<T> = (
  filters: DSO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type DeleteManyByIds = (
  ids: string[],
  options?: QueryOptions,
) => PRD<string[]>;

export type DeleteOne<T> = (
  filters: DSO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

export type DeleteOneById = (
  id: string,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

// #endregion

// #region Remove

export type RemoveAll = (options?: QueryOptions) => PRD<string[]>;

export type RemoveMany<T> = (
  filters: DSO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type RemoveManyByIds = (
  ids: string[],
  options?: QueryOptions,
) => PRD<string[]>;

export type RemoveOne<T> = (
  filters: DSO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

export type RemoveOneById = (
  id: string,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

// #endregion

// #region Retrieve

export type RetrieveAll = (options?: QueryOptions) => PRD<string[]>;

export type RetrieveMany<T> = (
  filters: DSO<T>,
  options?: QueryOptions,
) => PRD<string[]>;

export type RetrieveManyByIds = (
  ids: string[],
  options?: QueryOptions,
) => PRD<string[]>;

export type RetrieveOne<T> = (
  filters: DSO<T>,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

export type RetrieveOneById = (
  id: string,
  options?: NOmit<QueryOptions, 'limit'>,
) => PRD<string>;

// #endregion

export interface CRUD<T extends Entity> {
  createMany: CreateMany<T>;
  createOne: CreateOne<T>;
  upsertOne: UpsertOne<T>;
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
  deleteManyByIds: DeleteManyByIds;
  deleteOne: DeleteOne<T>;
  deleteOneById: DeleteOneById;
  removeAll: RemoveAll;
  removeMany: RemoveMany<T>;
  removeManyByIds: RemoveManyByIds;
  removeOne: RemoveOne<T>;
  removeOneById: RemoveOneById;
  retrieveAll: RetrieveAll;
  retrieveMany: RetrieveMany<T>;
  retrieveManyByIds: RetrieveManyByIds;
  retrieveOne: RetrieveOne<T>;
  retrieveOneById: RetrieveOneById;
}
