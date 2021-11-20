import { WithoutId } from './../entities';
import { StringKeyAndValues, UnionToIntersection } from 'core';
import { TypeOf } from 'zod';
import { Entity } from '../entities';
import { PERMISSIONS_STRINGS } from './../schemas/strings';
import { DSO } from './dso';
export declare type GetPermissions<T> = (filters: DSO<T>) => string[];
declare type _Keys = TypeOf<typeof PERMISSIONS_STRINGS>[number];
export declare type GetRWRPermissions<T> = (filters: DSO<T>) => {
    [key in _Keys]: string[];
};
export declare type _PermissionReader<T> = UnionToIntersection<StringKeyAndValues<T>>;
export declare type PermissionsForEntity<T extends Entity> = {
    [key in keyof WithoutId<T>]: T[key] extends Entity ? PermissionsForEntity<T[key]> : {
        [key in _Keys]: string[];
    };
};
export declare type PermissionsReaderOne<T extends Entity> = (filters: DSO<T>) => PermissionsForEntity<T>;
export declare type PermissionsReaderMany<T extends Entity> = (filters: DSO<T>) => PermissionsForEntity<T>[];
export {};
