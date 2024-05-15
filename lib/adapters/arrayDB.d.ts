import { type Ru } from '@bemedev/decompose';
import { TransformToZodObject } from '../schemas';
import { DSO } from '../types';
import type { MaybeId, PermissionsArray } from '../types/entities';
import { Actor, CollectionPermissions, EntryWithPermissions, Re, TimeStamps, WithEntity, WithId, type SimpleActor, type TimeStampsPermissions, type WithoutTimeStamps } from '../types/entities';
import type { Count, CountAll, CreateMany, CreateOne, DeleteAll, DeleteMany, DeleteManyByIds, DeleteOne, DeleteOneById, Projection, QueryOptions, ReadAll, ReadMany, ReadManyByIds, ReadOne, ReadOneById, RemoveAll, RemoveMany, RemoveManyByIds, RemoveOne, RemoveOneById, RetrieveAll, RetrieveMany, RetrieveManyByIds, RetrieveOne, RetrieveOneById, SetAll, SetMany, SetManyByIds, SetOne, SetOneById, UpdateAll, UpdateMany, UpdateManyByIds, UpdateOne, UpdateOneById, UpsertMany, UpsertOne, WT } from '../types/repo';
export type CollectionArgs<T> = {
    _schema: TransformToZodObject<WithoutTimeStamps<T>>;
    _actors?: Actor[];
    permissions?: CollectionPermissions;
    checkPermissions?: boolean;
    test?: boolean;
};
export type ReduceByPermissionsArgs<T extends Ru, P extends Projection<WithId<WithoutTimeStamps<T>>> = []> = {
    actor: SimpleActor | true;
    filters?: DSO<T>;
    ids?: string[];
    options?: QueryOptions<P>;
};
export declare class CollectionDB<T extends Ru> {
    private _collection;
    private _colPermissions;
    private _schema;
    private _actors;
    private _permissions?;
    private checkPermissions;
    private test;
    /**
     * Only in test mode
     */
    get collection(): WithEntity<T>[];
    /**
     * Only in test mode
     */
    get colPermissions(): EntryWithPermissions<T>[];
    __update: (payload: string[], update: WT<T>) => void;
    __seed: (...arr: MaybeId<WithoutTimeStamps<T>>[]) => Promise<WithEntity<T>[]>;
    constructor({ _schema, _actors, permissions, checkPermissions, test, }: CollectionArgs<T>);
    get canCheckPermissions(): boolean;
    private getActor;
    private canCreate;
    canDeleteDoc: (actorID: string) => boolean;
    private generateServerError;
    get schema(): TransformToZodObject<WithoutTimeStamps<T>>;
    _rinitDB(): void;
    get length(): number;
    static mapperWithoutTimestamps<T extends Ru = Ru>(): ({ _created, _deleted, _updated, ...data }: WithEntity<T>) => WithId<WithoutTimeStamps<T>>;
    private _withoutTimestamps;
    private _withoutTimestampsByIds;
    private _withoutTimestampsPermissions;
    static generateCreateTimestamps: (actorID: string) => TimeStamps;
    static buildCreate<T extends Re>(actorID: string, data: WT<T>, _id?: string): WithEntity<T>;
    static generateDefaultPermissions: () => PermissionsArray;
    static get timestampsPermissionsCreator(): TimeStampsPermissions;
    private generatePermissionCreate;
    protected pushPermission: (permission: EntryWithPermissions<T>) => number;
    protected pushData: (data: WithEntity<T>) => number;
    private _createPermission;
    private _createData;
    private generateCreate;
    createMany: CreateMany<T>;
    createOne: CreateOne<T>;
    upsertOne: UpsertOne<T>;
    upsertMany: UpsertMany<T>;
    private _canRead;
    private _reduceByPermissions;
    private _canReadExtended;
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
//# sourceMappingURL=arrayDB.d.ts.map