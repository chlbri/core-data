import type { NOmit } from 'core';
import {} from 'core';
import { PRD } from 'core-promises';
import { PRDI, PRDIM, Projection, QueryOptions, WO } from '.';
import { Entity } from '../entities';
import type { DSO } from './dso';

// #region Create

type CreateMany<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>[];
  options?: QueryOptions;
  projection?: Projection<T>;
}) => PRD<{
  all: number;
  createds: number;
  ids: string[];
}>;

type CreateOne<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string>;

type UpsertOne<T extends Entity> = (args: {
  _id?: string;
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string>;

type UpsertMany<T extends Entity> = (args: {
  actorID: string;
  upserts: { _id?: string; data: WO<T> }[];
  options?: QueryOptions;
}) => PRD<string>;

// #endregion

// #region Read

type ReadAll<T extends Entity> = (
  actorID: string,
  options?: QueryOptions,
) => PRDIM<T>;

type ReadMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

type ReadManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRDIM<T>;

type ReadOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;

type ReadOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;

// #endregion

// #region Count

type CountAll = (actorID: string) => PRD<number>;

type Count<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<number>;

// #endregion

// #region Update

type UpdateAll<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type UpdateMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type UpdateManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  data: WO<T>;
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type UpdateOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

type UpdateOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Set

type SetAll<T extends Entity> = (args: {
  actorID: string;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type SetMany<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type SetManyByIds<T extends Entity> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  data: WO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type SetOne<T extends Entity> = (args: {
  actorID: string;
  filters: DSO<T>;
  data: WO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

type SetOneById<T extends Entity> = (args: {
  actorID: string;
  id: string;
  data: WO<T>;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Delete

type DeleteAll = (
  actorID: string,
  options?: QueryOptions,
) => PRD<string[]>;

type DeleteMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type DeleteManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;
type DeleteOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

type DeleteOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Remove

type RemoveAll = (
  actorID: string,
  options?: QueryOptions,
) => PRD<string[]>;

type RemoveMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type RemoveManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type RemoveOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

type RemoveOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

// #endregion

// #region Retrieve

type RetrieveAll = (
  actorID: string,
  options?: QueryOptions,
) => PRD<string[]>;

type RetrieveMany<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type RetrieveManyByIds<T> = (args: {
  actorID: string;
  ids: string[];
  filters?: DSO<T>;
  options?: QueryOptions;
}) => PRD<string[]>;

type RetrieveOne<T> = (args: {
  actorID: string;
  filters: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

type RetrieveOneById<T> = (args: {
  actorID: string;
  id: string;
  filters?: DSO<T>;
  options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;

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
