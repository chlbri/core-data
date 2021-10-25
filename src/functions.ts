import { AtomicData, Entity, WithoutPermissions } from './entities';
import { PERMISSIONS_STRINGS } from './schemas';
import type { Not, OSO, VSO } from './types/data';

export function isSearchOperation(val: any): val is VSO {
  return Object.keys(val).every(val => val.startsWith('$'));
}

export function isNotClause<T = any>(value: any): value is Not<T> {
  return Object.keys(value) === ['$not'];
}
export function isOSO<T = any>(value: any): value is OSO<T> {
  return Object.keys(value) === ['$not'];
}

//TODO: Add a better way to exit with false
export function isWithoutPermissions(
  val: any,
): val is WithoutPermissions<any> {
  return Object.keys(val).every(
    key => !(PERMISSIONS_STRINGS as readonly string[]).includes(key),
  );
}

type AD<T> = AtomicData<T>;

export function atomicData<T>(
  data: T,
  __read: AD<T>['__read'],
  __write: AD<T>['__write'],
  __delete: AD<T>['__delete'],
): AD<T> {
  return {
    data,
    __read,
    __write,
    __delete,
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
