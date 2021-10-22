import { AtomicData, WithoutPermissions } from './entities';
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
  _read: AD<T>['_read'],
  _update: AD<T>['_update'],
  _delete: AD<T>['_delete'],
): AD<T> {
  return {
    data,
    _read,
    _update,
    _delete,
  };
}
