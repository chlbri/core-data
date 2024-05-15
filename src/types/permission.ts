import { TypeOf } from 'zod';
import { PERMISSIONS_STRINGS } from './../schemas/strings';
import { DSO } from './dso';
import { Entity, WithoutId } from './entities';

export type GetPermissions<T> = (filters: DSO<T>) => string[];

type _Keys = TypeOf<typeof PERMISSIONS_STRINGS>[number];

export type GetRWRPermissions<T> = (filters: DSO<T>) => {
  [key in _Keys]: string[];
};

export type PermissionsForEntity<T extends Entity> = {
  [key in keyof WithoutId<T>]?: T[key] extends Entity
    ? PermissionsForEntity<T[key]>
    : { [key in _Keys]?: string[] };
};

export type PermissionsReaderOne<T extends Entity> = (
  filters: DSO<T>,
) => PermissionsForEntity<T>;

export type PermissionsReaderMany<T extends Entity> = (
  filters: DSO<T>,
) => PermissionsForEntity<T>[];
