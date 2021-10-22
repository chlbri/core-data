export declare const STATUS_STRINGS: readonly ["information", "success", "redirect", "client-error", "server-error", "permission-error", "timeout-error"];
export declare const PERMISSIONS_STRINGS: readonly ["_read", "_update", "_delete"];
export declare const EXIST_CLAUSES: import("zod").ZodLiteral<"$exists">;
export declare const COMMON_CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$eq">, import("zod").ZodLiteral<"$ne">, import("zod").ZodLiteral<"$in">, import("zod").ZodLiteral<"$nin">], null>;
export declare const NUMBER_CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$gt">, import("zod").ZodLiteral<"$gte">, import("zod").ZodLiteral<"$lt">, import("zod").ZodLiteral<"$lte">, import("zod").ZodLiteral<"$mod">], null>;
export declare const STRING_CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$cts">, import("zod").ZodLiteral<"$sw">, import("zod").ZodLiteral<"$ew">, import("zod").ZodLiteral<"$regex">], null>;
export declare const ARRAY_CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$all">, import("zod").ZodLiteral<"$em">, import("zod").ZodLiteral<"$size">], null>;
export declare const LOGICAL_CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$and">, import("zod").ZodLiteral<"$not">, import("zod").ZodLiteral<"$or">, import("zod").ZodLiteral<"$nor">], null>;
export declare const TYPE_ALIASES: import("zod").ZodTuple<[import("zod").ZodLiteral<"string">, import("zod").ZodLiteral<"double">, import("zod").ZodLiteral<"object">, import("zod").ZodLiteral<"array">, import("zod").ZodLiteral<"binData">, import("zod").ZodLiteral<"objectId">, import("zod").ZodLiteral<"bool">], null>;
export declare const CLAUSES: import("zod").ZodTuple<[import("zod").ZodLiteral<"$exists">, import("zod").ZodLiteral<"$eq">, import("zod").ZodLiteral<"$ne">, import("zod").ZodLiteral<"$in">, import("zod").ZodLiteral<"$nin">, import("zod").ZodLiteral<"$gt">, import("zod").ZodLiteral<"$gte">, import("zod").ZodLiteral<"$lt">, import("zod").ZodLiteral<"$lte">, import("zod").ZodLiteral<"$mod">, import("zod").ZodLiteral<"$cts">, import("zod").ZodLiteral<"$sw">, import("zod").ZodLiteral<"$ew">, import("zod").ZodLiteral<"$regex">, import("zod").ZodLiteral<"$all">, import("zod").ZodLiteral<"$em">, import("zod").ZodLiteral<"$size">, import("zod").ZodLiteral<"$and">, import("zod").ZodLiteral<"$not">, import("zod").ZodLiteral<"$or">, import("zod").ZodLiteral<"$nor">], null>;
