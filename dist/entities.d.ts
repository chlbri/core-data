import { entitySchema } from './schemas/objects';
import { TypeOf } from 'zod';
export declare type Entity = TypeOf<typeof entitySchema>;
export declare type WithoutId<T> = Omit<T, '_id'>;
export declare type WithId<T> = WithoutId<T> & {
    _id: string;
};
declare const perm: import("zod").ZodObject<{
    __read: import("zod").ZodArray<import("zod").ZodString, "many">;
    __write: import("zod").ZodArray<import("zod").ZodString, "many">;
    __delete: import("zod").ZodArray<import("zod").ZodString, "many">;
}, "strip", import("zod").ZodTypeAny, {
    __read: string[];
    __write: string[];
    __delete: string[];
}, {
    __read: string[];
    __write: string[];
    __delete: string[];
}>;
export declare type AtomicData<T> = {
    data: T;
} & TypeOf<typeof perm>;
declare type UnionPerm = keyof TypeOf<typeof perm>;
export declare type WithoutPermissions<T> = Omit<T, UnionPerm>;
export {};
