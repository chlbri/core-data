import { object, record } from 'zod';
import { AtomicObject } from '..';
import { AtomicData, Entity, WithoutPermissions } from '../entities';
import { entitySchema, PERMISSIONS_STRINGS } from '../schemas';
import { permissionsShape } from '../schemas/objects';
import type { Not, VSO } from '../types/dso';
import { PermissionsForEntity } from '../types/permission';
import omit from 'object.omit';

export function isSearchOperation(val: any): val is VSO {
  return Object.keys(val).every(val => val.startsWith('$'));
}

export function isNotClause<T = any>(value: any): value is Not<T> {
  return Object.keys(value) === ['$not'];
}

export function includesMany<T>(array: T[], includes: T[]) {
  return includes.every(include => array.includes(include));
}

export function isEntity(value: any): value is Entity {
  return entitySchema.safeParse(value).success;
}

export function isAtomicData<T>(value: any): value is AtomicData<T> {
  return object(permissionsShape).safeParse(value).success;
}
export function isAtomicObject<T extends Entity>(
  value: any,
): value is AtomicObject<T> {
  const input = omit(value, '_id');
  const schema = record(object(permissionsShape));
  return schema.safeParse(input).success;
}

export function getPermissions<T extends Entity>(data: AtomicObject<T>) {
  const entries = Object.entries(data).filter(([key]) => key !== '_id');
  const out = entries
    .map(([key, value]) => {
      if (isAtomicData<T>(value)) {
        const { __read, __write, __remove } = value;
        return { [key]: { __read, __write, __remove } };
      } else if (isAtomicObject(value)) {
        return { [key]: getPermissions(value) };
      } else return {};
    })
    .reduce((acc, curr) => {
      return Object.assign(acc, curr);
    }) as PermissionsForEntity<T>;
  return out;
}
export function getPermissionsArray<T extends Entity>(
  data: AtomicObject<T>[],
) {
  return data.map(getPermissions);
}

//TODO: Add a better way to exit with false
export function isWithoutPermissions(
  val: any,
): val is WithoutPermissions<any> {
  return Object.keys(val).every(
    key => !PERMISSIONS_STRINGS.safeParse(key).success,
  );
}

type AD<T> = AtomicData<T>;

export function atomicData<T>(
  data: T,
  __read: AD<T>['__read'],
  __write: AD<T>['__write'],
  __remove: AD<T>['__remove'],
): AD<T> {
  return {
    data,
    __read,
    __write,
    __remove,
  };
}

export function entity<T>(_id: string, shape: T): Entity {
  return {
    _id,
    ...shape,
    _createdAt: new Date(),
    _updatedAt: new Date(),
    _deletedAt: false,
  };
}
