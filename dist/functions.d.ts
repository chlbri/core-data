import { AtomicData, WithoutPermissions } from './entities';
import type { Not, OSO, VSO } from './types/data';
export declare function isSearchOperation(val: any): val is VSO;
export declare function isNotClause<T = any>(value: any): value is Not<T>;
export declare function isOSO<T = any>(value: any): value is OSO<T>;
export declare function isWithoutPermissions(val: any): val is WithoutPermissions<any>;
declare type AD<T> = AtomicData<T>;
export declare function atomicData<T>(data: T, _read: AD<T>['_read'], _update: AD<T>['_update'], _delete: AD<T>['_delete']): AD<T>;
export {};
