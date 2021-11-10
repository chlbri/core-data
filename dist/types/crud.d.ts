import RD, { Status } from 'core-promises';
import type { DeepPartial, NOmit, Primitive } from 'core';
import { Entity, WithId, WithoutId } from '../entities';
import type { DSO } from './data';
export declare type DivideEntity<T> = {
    [key in keyof T]: T[key] extends Primitive ? T[key] : string | undefined | T[key];
};
export declare type PRD<T> = Promise<RD<T, Status>>;
declare type DP<T> = DeepPartial<T>;
declare type WI<T> = WithId<DP<T>>;
declare type WO<T> = WithoutId<DP<T>>;
declare type DWO<T> = DivideEntity<WO<T>>;
declare type PRDI<T> = PRD<WI<T>>;
declare type PRDIM<T> = PRD<WI<T>[]>;
export declare type ErrorHandler = (error?: any) => never;
export declare type QueryOptions = {
    limit?: number;
    errorHandler?: ErrorHandler;
    after?: string;
    before?: string;
};
export declare type CreateMany<T extends Entity> = (args: {
    data: DWO<T>[];
    options?: QueryOptions;
}) => PRD<{
    all: number;
    done: number;
    ids: string[];
}>;
export declare type CreateOne<T extends Entity> = (args: {
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string>;
export declare type UpsertOne<T extends Entity> = (args: {
    _id: string;
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string>;
export declare type ReadAll<T extends Entity> = (options?: QueryOptions) => PRDIM<T>;
export declare type ReadMany<T extends Entity> = (args: {
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRDIM<T>;
export declare type ReadManyByIds<T extends Entity> = (args: {
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRDIM<T>;
export declare type ReadOne<T extends Entity> = (args: {
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;
export declare type ReadOneById<T extends Entity> = (args: {
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRDI<T>;
export declare type CountAll = () => PRD<number>;
export declare type Count<T extends Entity> = (args: {
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<number>;
export declare type UpdateAll<T extends Entity> = (args: {
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type UpdateMany<T extends Entity> = (args: {
    filters: DSO<T>;
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type UpdateManyByIds<T extends Entity> = (args: {
    ids: string[];
    data: DWO<T>;
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type UpdateOne<T extends Entity> = (args: {
    filters: DSO<T>;
    data: DWO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type UpdateOneById<T extends Entity> = (args: {
    id: string;
    filters?: DSO<T>;
    data: DWO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type SetAll<T extends Entity> = (args: {
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type SetMany<T extends Entity> = (args: {
    filters: DSO<T>;
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type SetManyByIds<T extends Entity> = (args: {
    ids: string[];
    filters?: DSO<T>;
    data: DWO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type SetOne<T extends Entity> = (args: {
    filters: DSO<T>;
    data: DWO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type SetOneById<T extends Entity> = (args: {
    id: string;
    data: DWO<T>;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type DeleteAll = (options?: QueryOptions) => PRD<string[]>;
export declare type DeleteMany<T> = (args: {
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type DeleteManyByIds<T> = (args: {
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type DeleteOne<T> = (args: {
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type DeleteOneById<T> = (args: {
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type RemoveAll = (options?: QueryOptions) => PRD<string[]>;
export declare type RemoveMany<T> = (args: {
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type RemoveManyByIds<T> = (args: {
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type RemoveOne<T> = (args: {
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type RemoveOneById<T> = (args: {
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type RetrieveAll = (options?: QueryOptions) => PRD<string[]>;
export declare type RetrieveMany<T> = (args: {
    filters: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type RetrieveManyByIds<T> = (args: {
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions;
}) => PRD<string[]>;
export declare type RetrieveOne<T> = (args: {
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
export declare type RetrieveOneById<T> = (args: {
    id: string;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'limit'>;
}) => PRD<string>;
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
export {};
