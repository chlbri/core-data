import { z } from 'zod';
import type { Not, VSO } from './types/dso';
import { Entity, WithEntity } from './types/entities';
export declare function isSearchOperation(val: any): val is VSO;
export declare function isNotClause<T = any>(value: any): value is Not<T>;
export declare function includesMany<T>(array: T[], includes: T[]): boolean;
type IsEntityT<Z extends z.ZodRawShape> = WithEntity<z.infer<z.ZodObject<Z>>>;
export declare function isEntity<Z extends []>(value: any, ...args: Z): value is Entity;
export declare function isEntity<Z extends [shape: z.ZodRawShape]>(value: any, ...args: Z): value is IsEntityT<Z[0]>;
export {};
//# sourceMappingURL=functions.d.ts.map