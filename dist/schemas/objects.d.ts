import type { ZodRawShape } from 'zod';
import { ZodObject, ZodType } from 'zod';
export declare const entitySchema: ZodObject<{
    _id: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    _id: string;
}, {
    _id: string;
}>;
export declare const loginSchema: ZodObject<{
    login: import("zod").ZodString;
    password: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    password: string;
    login: string;
}, {
    password: string;
    login: string;
}>;
export declare const actorSchema: ZodObject<{
    login: import("zod").ZodString;
    ip: import("zod").ZodOptional<import("zod").ZodString>;
    permissions: import("zod").ZodArray<import("zod").ZodString, "many">;
    _id: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    ip?: string | undefined;
    _id: string;
    login: string;
    permissions: string[];
}, {
    ip?: string | undefined;
    _id: string;
    login: string;
    permissions: string[];
}>;
export declare const userSchema: ZodObject<{
    __privateKey: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    __privateKey: string;
}, {
    __privateKey: string;
}>;
export declare const humanSchema: ZodObject<{
    firstNames: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    lastName: import("zod").ZodOptional<import("zod").ZodString>;
}, "strip", import("zod").ZodTypeAny, {
    firstNames?: string[] | undefined;
    lastName?: string | undefined;
}, {
    firstNames?: string[] | undefined;
    lastName?: string | undefined;
}>;
export declare const withoutID: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }, "strip", import("zod").ZodTypeAny, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>[k_3]; }, { [k_5 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>[k_5]; }>;
export declare const withoutPermissions: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }, "strip", import("zod").ZodTypeAny, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>[k_3]; }, { [k_5 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__update" | "__delete" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>[k_5]; }>;
export declare const withoutPassword: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }, "strip", import("zod").ZodTypeAny, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>[k_3]; }, { [k_5 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "password" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "password" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>[k_5]; }>;
export declare const withID: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }, "strip", import("zod").ZodTypeAny, { [k_2 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_1 in keyof { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }]: { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }[k_1]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_1 in keyof { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }]: { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }[k_1]["_output"]; }>[k_2]; }, { [k_4 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_3 in keyof { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }]: { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }[k_3]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_3 in keyof { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }]: { [k in ["_id" extends keyof T ? T[keyof T & "_id"] : never] extends [never] ? never : "_id"]: k extends "_id" ? {
    _id: "_id" extends keyof T ? T[keyof T & "_id"] : never;
}[k] : never; }[k_3]["_input"]; }>[k_4]; }>;
export declare const atomicDataSchema: <T extends ZodRawShape | ZodType<any, import("zod").ZodTypeDef, any>>(shape: T) => ZodObject<{
    __read: import("zod").ZodArray<import("zod").ZodString, "many">;
    __update: import("zod").ZodArray<import("zod").ZodString, "many">;
    __delete: import("zod").ZodArray<import("zod").ZodString, "many">;
    data: T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T;
}, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __update: string[];
    __delete: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_output"];
}>]: import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __update: string[];
    __delete: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_output"];
}>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __update: string[];
    __delete: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_input"];
}>]: import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __update: string[];
    __delete: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_input"];
}>[k_3]; }>;
