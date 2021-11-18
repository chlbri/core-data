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

export type PermissionsReaderOne<T extends Entity> = (
  filters: DSO<T>,
) => PermissionsForEntity<T>;

export type PermissionsReaderMany<T extends Entity> = (
  filters: DSO<T>,
) => PermissionsForEntity<T>[];

type Test = PermissionsForEntity<
  {
    _id: string;
    data: Entity & { bourg: number };
  } & Entity
>;

const test1: Test = {
  data: {
    _createdAt: { __read: [], __write: [], __remove: [] },
    _deletedAt: { __read: [], __write: [], __remove: [] },
    _updatedAt: { __read: [], __write: [], __remove: [] },
    bourg: { __read: [], __write: [], __remove: [] },
  },
  _createdAt: { __read: [], __write: [], __remove: [] },
  _updatedAt: { __read: [], __write: [], __remove: [] },
  _deletedAt: { __read: [], __write: [], __remove: [] },
};
