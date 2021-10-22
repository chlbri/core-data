import type { DataSearchOperations, SearchOperation } from '../types/data';
export declare function inStreamSearchAdapterKey<T>(op: SearchOperation<T>): (arg: T) => boolean;
export declare function inStreamSearchAdapter<T>(filter: DataSearchOperations<T>): (arg: any) => boolean;
