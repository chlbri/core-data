import type { NOmit } from 'core';
import { PRD } from 'core-promises';
import { WO, QueryOptions, Projection, PRDIM, PRDI } from '.';
import { Entity } from '../entities';
import type { DSO } from './dso';
declare type CreateMany<T extends Entity> = (args: {
    actorID: string;
    data: WO<T>[];
    options?: QueryOptions;
    projection?: Projection<T>;
}) => PRD<{
    all: number;
    createds: number;
    ids: string[];
}>;
declare type CreateOne<T extends Entity> = (args: {
    actorID: string;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string>;
declare type UpsertOne<T extends Entity> = (args: {
    _id?: string;
    actorID: string;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string>;
declare type UpsertMany<T extends Entity> = (args: {
    actorID: string;
    upserts: {
        _id?: string;
        data: WO<T>;
    }[];
    options?: QueryOptions;
}) => PRD<string>;
declare type ReadAll<T extends Entity> = (actorID: string, options?: QueryOptions) => PRDIM<T>;
declare type ReadMany<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRDIM<T>;
declare type ReadManyByIds<T extends Entity> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRDIM<T>;
declare type ReadOne<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;
declare type ReadOneById<T extends Entity> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;
declare type CountAll = (actorID: string) => PRD<number>;
declare type Count<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<number>;
declare type UpdateAll<T extends Entity> = (args: {
    actorID: string;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type UpdateMany<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type UpdateManyByIds<T extends Entity> = (args: {
    actorID: string;
    ids: string[];
    data: WO<T>;
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type UpdateOne<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type UpdateOneById<T extends Entity> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    data: WO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type SetAll<T extends Entity> = (args: {
    actorID: string;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type SetMany<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type SetManyByIds<T extends Entity> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    data: WO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type SetOne<T extends Entity> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type SetOneById<T extends Entity> = (args: {
    actorID: string;
    id: string;
    data: WO<T>;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type DeleteAll = (actorID: string, options?: QueryOptions) => PRD<string[]>;
declare type DeleteMany<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type DeleteManyByIds<T> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type DeleteOne<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type DeleteOneById<T> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type RemoveAll = (actorID: string, options?: QueryOptions) => PRD<string[]>;
declare type RemoveMany<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type RemoveManyByIds<T> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type RemoveOne<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type RemoveOneById<T> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type RetrieveAll = (actorID: string, options?: QueryOptions) => PRD<string[]>;
declare type RetrieveMany<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type RetrieveManyByIds<T> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
declare type RetrieveOne<T> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
declare type RetrieveOneById<T> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
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
export declare type Repo<T extends Entity> = Repository<T>;
export {};
