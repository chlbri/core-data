import { z } from 'zod';
export declare const STATUS_STRINGS: readonly ["information", "success", "redirect", "client-error", "server-error", "permission-error", "timeout-error"];
export declare const PERMISSIONS_STRINGS: z.ZodTuple<[z.ZodLiteral<"__read">, z.ZodLiteral<"__write">, z.ZodLiteral<"__remove">], null>;
export declare const EXIST_CLAUSES: z.ZodLiteral<"$exists">;
export declare const COMMON_CLAUSES: z.ZodTuple<[z.ZodLiteral<"$eq">, z.ZodLiteral<"$ne">, z.ZodLiteral<"$in">, z.ZodLiteral<"$nin">], null>;
export declare const NUMBER_CLAUSES: z.ZodTuple<[z.ZodLiteral<"$gt">, z.ZodLiteral<"$gte">, z.ZodLiteral<"$lt">, z.ZodLiteral<"$lte">, z.ZodLiteral<"$mod">], null>;
export declare const STRING_CLAUSES: z.ZodTuple<[z.ZodLiteral<"$cts">, z.ZodLiteral<"$sw">, z.ZodLiteral<"$ew">, z.ZodLiteral<"$regex">], null>;
export declare const ARRAY_CLAUSES: z.ZodTuple<[z.ZodLiteral<"$all">, z.ZodLiteral<"$em">, z.ZodLiteral<"$size">], null>;
export declare const LOGICAL_CLAUSES: z.ZodTuple<[z.ZodLiteral<"$and">, z.ZodLiteral<"$not">, z.ZodLiteral<"$or">, z.ZodLiteral<"$nor">], null>;
export declare const TYPE_ALIASES: z.ZodTuple<[z.ZodLiteral<"string">, z.ZodLiteral<"number">, z.ZodLiteral<"object">, z.ZodLiteral<"array">, z.ZodLiteral<"binData">, z.ZodLiteral<"objectId">, z.ZodLiteral<"boolean">, z.ZodLiteral<"date">], null>;
export declare const CLAUSES: z.ZodTuple<[z.ZodLiteral<"$exists">, z.ZodLiteral<"$eq">, z.ZodLiteral<"$ne">, z.ZodLiteral<"$in">, z.ZodLiteral<"$nin">, z.ZodLiteral<"$gt">, z.ZodLiteral<"$gte">, z.ZodLiteral<"$lt">, z.ZodLiteral<"$lte">, z.ZodLiteral<"$mod">, z.ZodLiteral<"$cts">, z.ZodLiteral<"$sw">, z.ZodLiteral<"$ew">, z.ZodLiteral<"$regex">, z.ZodLiteral<"$all">, z.ZodLiteral<"$em">, z.ZodLiteral<"$size">, z.ZodLiteral<"$and">, z.ZodLiteral<"$not">, z.ZodLiteral<"$or">, z.ZodLiteral<"$nor">], null>;
//# sourceMappingURL=strings.d.ts.map