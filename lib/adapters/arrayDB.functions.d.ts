import { type Ru } from '@bemedev/decompose';
import { z, type Primitive } from 'zod';
import type { DataSearchOperations, Projection } from '../types';
export declare function inStreamSearchAdapter<T>(filter: DataSearchOperations<T>): (val: any) => boolean;
export type ZodMatching<T extends z.ZodRawShape, B extends boolean = true, Key = keyof T> = Key extends string ? T[Key] extends z.AnyZodObject ? `${Key}.${ZodMatching<T[Key]['shape'], B>}` | (B extends true ? Key : never) : Key : never;
export declare function zodDecomposeKeys<Z extends z.ZodRawShape, B extends boolean = true>(shape: Z, addObjectKey?: B): ZodMatching<Z, B>[];
export declare function cleanProjection(...datas: string[]): string[];
export declare function isPrimitive(value?: any): value is Primitive;
export declare function intersectObjects<T extends Ru[]>(...objects: T): any;
/**
 *
 * @param data the data to reduce
 * @param projection The shape that the data will take
 */
export declare function withProjection<T extends Ru, P extends Projection<T> = []>(data: T, ...projection: P): import("@bemedev/decompose").Recompose<Pick<import("@bemedev/decompose").Decompose<T>, P[number] | `${P[number]}.${string}`>>;
/**
 * Same as {@link withProjection}, but here the data is already flatten
 * @param data Data is already flatten
 * @param projection The shape that the data will take
 */
export declare function withProjection2<T extends Ru, P extends string[]>(data: T, ...projection: P): Omit<T, P[number]>;
export declare function countOccurences<T extends string[]>(...arr: T): Record<T[number], number>;
//# sourceMappingURL=arrayDB.functions.d.ts.map