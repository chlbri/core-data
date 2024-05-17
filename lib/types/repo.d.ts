import type { Decompose, KeysMatching, Recompose } from '@bemedev/decompose';
import type { RD, Status } from '@bemedev/return-data/lib/types';
import type { DSO } from './dso';
import type { Entity, WithId, WithoutId, WithoutTimeStamps } from './entities';
import type { NOmit } from './helpers';
export type ErrorHandler = (error?: any) => never;
export type QueryOptions<P extends string[] = string[]> = {
    limit?: number;
    projection?: P;
};
export type PromiseRD<T> = Promise<RD<T, Status>>;
export type StringKeys<T extends Ru, B extends boolean = true> = KeysMatching<WithId<WithoutTimeStamps<T>>, B>;
export type Ru = Record<string, unknown>;
export type Ra = Record<string, any>;
export type Projection<T extends Ru, B extends boolean = true> = StringKeys<T, B>[];
export type ToOptional<T extends any[]> = T['length'] extends 0 ? [] : T['length'] extends 1 ? [T[0]?] : T extends [infer First, ...infer Rest] ? [First?, ...ToOptional<Rest>] : never;
export type DeepPartial<T> = {
    [P in keyof T]+?: DeepPartial<T[P]>;
};
export type WI<T> = WithId<DeepPartial<T>>;
export type WO<T> = WithoutId<DeepPartial<T>>;
export type WT<T> = WithoutTimeStamps<DeepPartial<T>>;
export type ReduceByProjection<T extends Ru, P extends Projection<T>> = Recompose<Omit<Decompose<T>, `${P[number]}.${string}` | P[number]>>;
export type Read<T extends Ru = Ru, P extends string[] = string[]> = P extends Projection<WithId<WithoutTimeStamps<T>>> ? WithId<ReduceByProjection<WithoutTimeStamps<T>, P>> : WithId<WithoutTimeStamps<T>>;
export type PromiseRDwithID<T extends Ru = Ru, P extends string[] = string[]> = PromiseRD<Read<T, P>>;
export type PromiseRDwithIdMany<T extends Ru = Ru, P extends string[] = string[]> = PromiseRD<Read<T, P>[]>;
export type CreateMany<T extends Ru> = (args: {
    actorID: string;
    data: WithoutTimeStamps<T>[];
    options?: Omit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type CreateOne<T extends Ru> = (args: {
    actorID: string;
    data: WithoutTimeStamps<T>;
}) => PromiseRD<string>;
export type UpsertOne<T extends Ru> = (args: {
    actorID: string;
    id?: string;
    data: WithoutTimeStamps<T>;
}) => PromiseRD<string>;
export type UpsertMany<T extends Ru> = (args: {
    actorID: string;
    upserts: {
        _id?: string;
        data: WithoutTimeStamps<T>;
    }[];
    options?: Omit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type ReadAll<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(actorID: string, options?: QueryOptions<P>) => PromiseRDwithIdMany<T, P>;
export type ReadMany<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions<P>;
}) => PromiseRDwithIdMany<T, P>;
export type ReadManyByIds<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: QueryOptions<P>;
}) => PromiseRDwithIdMany<T, P>;
export type ReadOne<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(args: {
    actorID: string;
    filters: DSO<T>;
    options?: Omit<QueryOptions<P>, 'limit'>;
}) => PromiseRDwithID<T, P>;
export type ReadOneById<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    options?: Omit<QueryOptions<P>, 'limit'>;
}) => PromiseRDwithID<T, P>;
export type CountAll = (actorID: string) => PromiseRD<number>;
export type Count<T extends Ru> = <P extends Projection<WithoutTimeStamps<T>>>(args: {
    actorID: string;
    filters: DSO<T>;
    options?: QueryOptions<P>;
}) => PromiseRD<number>;
export type UpdateAllWithOne<T extends Ru> = (args: {
    actorID: string;
    update: WT<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type UpdateAll<T extends Ru> = (args: {
    actorID: string;
    datas: WT<T>[];
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type UpdateManyWithOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    update: WT<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type UpdateMany<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    updates: WT<T>[];
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type UpdateManyByIdsWithOne<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    update: WT<T>;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type UpdateManyByIds<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    updates: WT<T>[];
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type UpdateOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    update: WT<T>;
    options?: NOmit<QueryOptions, 'limit' | 'projection'>;
}) => PromiseRD<string>;
export type UpdateOneById<T extends Ru> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
    update: WT<T>;
    options?: NOmit<QueryOptions, 'limit' | 'projection'>;
}) => PromiseRD<string>;
export type SetAllWithOne<T extends Ru> = (args: {
    actorID: string;
    data: WithoutTimeStamps<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type SetAll<T extends Ru> = (args: {
    actorID: string;
    data: WithoutTimeStamps<T>[];
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type SetManyWithOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WithoutTimeStamps<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type SetMany<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WithoutTimeStamps<T>[];
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type SetManyByIdsWithOne<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    data: WithoutTimeStamps<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type SetManyByIds<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    data: WithoutTimeStamps<T>[];
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection' | 'limit'>;
}) => PromiseRD<string[]>;
export type SetOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    data: WithoutTimeStamps<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string>;
export type SetOneById<T extends Ru> = (args: {
    actorID: string;
    id: string;
    data: WithoutTimeStamps<T>;
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string>;
export type DeleteAll = (actorID: string, options?: NOmit<QueryOptions, 'projection'>) => PromiseRD<string[]>;
export type DeleteMany<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type DeleteManyByIds<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type DeleteOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
}) => PromiseRD<string>;
export type DeleteOneById<T extends Ru> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
}) => PromiseRD<string>;
export type RemoveAll = (actorID: string, options?: NOmit<QueryOptions, 'projection'>) => PromiseRD<string[]>;
export type RemoveMany<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type RemoveManyByIds<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type RemoveOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
}) => PromiseRD<string>;
export type RemoveOneById<T extends Ru> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
}) => PromiseRD<string>;
export type RetrieveAll = (actorID: string, options?: NOmit<QueryOptions, 'projection'>) => PromiseRD<string[]>;
export type RetrieveMany<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type RetrieveManyByIds<T extends Ru> = (args: {
    actorID: string;
    ids: string[];
    filters?: DSO<T>;
    options?: NOmit<QueryOptions, 'projection'>;
}) => PromiseRD<string[]>;
export type RetrieveOne<T extends Ru> = (args: {
    actorID: string;
    filters: DSO<T>;
}) => PromiseRD<string>;
export type RetrieveOneById<T extends Ru> = (args: {
    actorID: string;
    id: string;
    filters?: DSO<T>;
}) => PromiseRD<string>;
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
    updateAllWithOne: UpdateAllWithOne<T>;
    updateManyWithOne: UpdateManyWithOne<T>;
    updateManyByIdsWithOne: UpdateManyByIdsWithOne<T>;
    updateAll: UpdateAll<T>;
    updateMany: UpdateMany<T>;
    updateManyByIds: UpdateManyByIds<T>;
    updateOne: UpdateOne<T>;
    updateOneById: UpdateOneById<T>;
    setAllWithOne: SetAllWithOne<T>;
    setManyWithOne: SetManyWithOne<T>;
    setManyByIdsWithOne: SetManyByIdsWithOne<T>;
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
export type EntityDecompose = Decompose<WithId<WithoutTimeStamps<object>>>;
export type Repo<T extends Entity> = Repository<T>;
//# sourceMappingURL=repo.d.ts.map