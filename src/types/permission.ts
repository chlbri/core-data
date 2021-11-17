import { WithoutId } from './../entities';
import { StringKeyAndValues, StringKeys, UnionToIntersection } from 'core';
import { TypeOf } from 'zod';
import { Entity } from '../entities';
import { PERMISSIONS_STRINGS } from './../schemas/strings';
import { DSO } from './dso';

export type GetPermissions<T> = (filters: DSO<T>) => string[];

type _Keys = TypeOf<typeof PERMISSIONS_STRINGS>[number];

export type GetRWRPermissions<T> = (filters: DSO<T>) => {
  [key in _Keys]: string[];
};

export type _PermissionReader<T> = UnionToIntersection<
  StringKeyAndValues<T>
>;
export type PermissionsForEntity<T extends Entity> = {
  [key in keyof WithoutId<T>]: T[key] extends Entity
    ? PermissionsForEntity<T[key]>
    : { [key in _Keys]: string[] };
};

export type PermissionsReader<T extends Entity> = (
  filters: DSO<T>,
) => PermissionsForEntity<T>;

type Test = PermissionsForEntity<
  {
    _id: string;
    data: Entity & { bourg: number };
  } & Entity
>;

const test1: Test = {
  data: {
    _createdAt: { _read: [], _write: [], _remove: [] },
    _deletedAt: { _read: [], _write: [], _remove: [] },
    _updatedAt: { _read: [], _write: [], _remove: [] },
    bourg: { _read: [], _write: [], _remove: [] },
  },
  _createdAt: { _read: [], _write: [], _remove: [] },
  _updatedAt: { _read: [], _write: [], _remove: [] },
  _deletedAt: { _read: [], _write: [], _remove: [] },
};
