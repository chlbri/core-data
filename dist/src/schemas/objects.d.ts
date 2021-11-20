import { ZodRawShape, ZodObject, ZodType } from 'zod';
export declare const permissionsShape: {
    __read: import("zod").ZodArray<import("zod").ZodString, "many">;
    __write: import("zod").ZodArray<import("zod").ZodString, "many">;
    __remove: import("zod").ZodArray<import("zod").ZodString, "many">;
};
export declare const collectionPermissionsShape: {
    __read: import("zod").ZodArray<import("zod").ZodString, "many">;
    __write: import("zod").ZodArray<import("zod").ZodString, "many">;
    __remove: import("zod").ZodArray<import("zod").ZodString, "many">;
    __create: import("zod").ZodArray<import("zod").ZodString, "many">;
};
export declare const entitySchema: ZodObject<{
    _id: import("zod").ZodString;
    _createdAt: import("zod").ZodDate;
    _updatedAt: import("zod").ZodDate;
    _deletedAt: import("zod").ZodUnion<[import("zod").ZodLiteral<false>, import("zod").ZodDate]>;
}, "strip", import("zod").ZodTypeAny, {
    _id: string;
    _createdAt: Date;
    _updatedAt: Date;
    _deletedAt: false | Date;
}, {
    _id: string;
    _createdAt: Date;
    _updatedAt: Date;
    _deletedAt: false | Date;
}>;
export declare const actorSchema: ZodObject<{
    _id: import("zod").ZodString;
    ip: import("zod").ZodOptional<import("zod").ZodString>;
    permissions: import("zod").ZodArray<import("zod").ZodString, "many">;
}, "strip", import("zod").ZodTypeAny, {
    ip?: string | undefined;
    _id: string;
    permissions: string[];
}, {
    ip?: string | undefined;
    _id: string;
    permissions: string[];
}>;
export declare const loginSchema: ZodObject<{
    login: import("zod").ZodString;
    password: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    login: string;
    password: string;
}, {
    login: string;
    password: string;
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
export declare const phoneNumber: import("zod").ZodTuple<[import("zod").ZodArray<import("zod").ZodNumber, "many">, import("zod").ZodNumber], null>;
export declare const humanSchemaAdd: ZodObject<{
    bio: import("zod").ZodOptional<import("zod").ZodString>;
    mail: import("zod").ZodOptional<import("zod").ZodString>;
    phoneNumber: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodTuple<[import("zod").ZodArray<import("zod").ZodNumber, "many">, import("zod").ZodNumber], null>, "many">>;
    firstNames: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    lastName: import("zod").ZodOptional<import("zod").ZodString>;
}, "strip", import("zod").ZodTypeAny, {
    firstNames?: string[] | undefined;
    lastName?: string | undefined;
    bio?: string | undefined;
    mail?: string | undefined;
    phoneNumber?: [number[], number][] | undefined;
}, {
    firstNames?: string[] | undefined;
    lastName?: string | undefined;
    bio?: string | undefined;
    mail?: string | undefined;
    phoneNumber?: [number[], number][] | undefined;
}>;
export declare const user: ZodObject<{
    __privateKey: import("zod").ZodString;
    _id: import("zod").ZodString;
    _createdAt: import("zod").ZodDate;
    _updatedAt: import("zod").ZodDate;
    _deletedAt: import("zod").ZodUnion<[import("zod").ZodLiteral<false>, import("zod").ZodDate]>;
}, "strip", import("zod").ZodTypeAny, {
    _id: string;
    _createdAt: Date;
    _updatedAt: Date;
    _deletedAt: false | Date;
    __privateKey: string;
}, {
    _id: string;
    _createdAt: Date;
    _updatedAt: Date;
    _deletedAt: false | Date;
    __privateKey: string;
}>;
export declare const withoutID: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }, "strip", import("zod").ZodTypeAny, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>[k_3]; }, { [k_5 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "_id" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "_id" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>[k_5]; }>;
export declare const withoutPermissions: <T extends ZodRawShape>(shape: T) => ZodObject<{ [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }, "strip", import("zod").ZodTypeAny, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }[k_2]["_output"]; }>[k_3]; }, { [k_5 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_4 in keyof { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }]: { [k_1 in import("zod").objectUtil.noNeverKeys<{ [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }>]: k_1 extends keyof T ? { [k in keyof T]: k extends "__read" | "__write" | "__remove" ? never : T[k]; }[k_1] : never; }[k_4]["_input"]; }>[k_5]; }>;
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
    __write: import("zod").ZodArray<import("zod").ZodString, "many">;
    __remove: import("zod").ZodArray<import("zod").ZodString, "many">;
    data: T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T;
}, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __write: string[];
    __remove: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_output"];
}>]: import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __write: string[];
    __remove: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_output"];
}>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __write: string[];
    __remove: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_input"];
}>]: import("zod").objectUtil.addQuestionMarks<{
    __read: string[];
    __write: string[];
    __remove: string[];
    data: (T extends ZodRawShape ? ZodObject<T, "strip", import("zod").ZodTypeAny, { [k_1 in keyof import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k in keyof T]: T[k]["_output"]; }>[k_1]; }, { [k_3 in keyof import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>]: import("zod").objectUtil.addQuestionMarks<{ [k_2 in keyof T]: T[k_2]["_input"]; }>[k_3]; }> : T)["_input"];
}>[k_3]; }>;
