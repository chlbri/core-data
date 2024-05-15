import { z } from 'zod';
export declare const permissionsShape: {
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
};
export declare const collectionPermissionsShape: {
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    __create: z.ZodArray<z.ZodString, "many">;
};
export declare const timestampsSchema: z.ZodObject<{
    _created: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _updatedAt: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _deletedAt: z.ZodUnion<[z.ZodLiteral<false>, z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
}, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
}>;
declare const _entitySchema: z.ZodObject<{
    _created: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _updatedAt: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _deletedAt: z.ZodUnion<[z.ZodLiteral<false>, z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>]>;
    _id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
}, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
}>;
export declare function entitySchema<T extends []>(...shape: T): typeof _entitySchema;
export declare function entitySchema<T extends [z.ZodRawShape]>(...shape: T): z.ZodObject<(typeof _entitySchema)['shape'] & T[0]>;
export declare const actorSchema: z.ZodObject<z.objectUtil.extendShape<{
    _created: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _updatedAt: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _deletedAt: z.ZodUnion<[z.ZodLiteral<false>, z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>]>;
    _id: z.ZodString;
}, {
    __privateKey: z.ZodString;
    permissions: z.ZodArray<z.ZodString, "many">;
}>, "strip", z.ZodTypeAny, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
    __privateKey: string;
    permissions: string[];
}, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
    __privateKey: string;
    permissions: string[];
}>;
export declare const loginSchema: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    login: string;
    password: string;
}, {
    login: string;
    password: string;
}>;
export declare const userSchema: z.ZodObject<{
    __privateKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    __privateKey: string;
}, {
    __privateKey: string;
}>;
export declare const phoneNumber: z.ZodTuple<[z.ZodArray<z.ZodNumber, "many">, z.ZodNumber], null>;
export declare const humanSchema: z.ZodObject<{
    firstNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    lastName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    mail: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodArray<z.ZodTuple<[z.ZodArray<z.ZodNumber, "many">, z.ZodNumber], null>, "many">>;
}, "strip", z.ZodTypeAny, {
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
export declare const user: z.ZodObject<z.objectUtil.extendShape<{
    _created: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _updatedAt: z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>;
    _deletedAt: z.ZodUnion<[z.ZodLiteral<false>, z.ZodObject<{
        date: z.ZodDate;
        by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        by: string;
    }, {
        date: Date;
        by: string;
    }>]>;
    _id: z.ZodString;
}, {
    login: z.ZodString;
    password: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
    login: string;
    password: string;
}, {
    _created: {
        date: Date;
        by: string;
    };
    _updatedAt: {
        date: Date;
        by: string;
    };
    _deletedAt: false | {
        date: Date;
        by: string;
    };
    _id: string;
    login: string;
    password: string;
}>;
export declare const withoutID: (shape: z.ZodRawShape) => z.ZodObject<Omit<z.ZodRawShape, "_id">, "strip", z.ZodTypeAny, {
    [x: string]: any;
    [x: number]: any;
}, {
    [x: string]: any;
    [x: number]: any;
}>;
type AddAny<T extends z.ZodRawShape, Arr extends string> = T & Record<Arr, z.ZodTypeAny>;
export declare function withoutPermissions<T extends z.ZodRawShape>(shape: T): z.ZodObject<Omit<AddAny<T, "__read" | "__write" | "__remove">, "__read" | "__write" | "__remove">, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<AddAny<T, "__read" | "__write" | "__remove">, "__read" | "__write" | "__remove">>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<AddAny<T, "__read" | "__write" | "__remove">, "__read" | "__write" | "__remove">>, any>[k]; } : never, z.baseObjectInputType<Omit<AddAny<T, "__read" | "__write" | "__remove">, "__read" | "__write" | "__remove">> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<Omit<AddAny<T, "__read" | "__write" | "__remove">, "__read" | "__write" | "__remove">>[k_1]; } : never>;
export declare function withoutPassword<T extends z.ZodRawShape>(shape: T): z.ZodObject<Omit<AddAny<T, "password">, "password">, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<AddAny<T, "password">, "password">>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<AddAny<T, "password">, "password">>, any>[k]; } : never, z.baseObjectInputType<Omit<AddAny<T, "password">, "password">> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<Omit<AddAny<T, "password">, "password">>[k_1]; } : never>;
export declare function withID<T extends z.ZodRawShape>(shape: T): z.ZodObject<z.objectUtil.extendShape<T, {
    _id: z.ZodString;
}>, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<z.objectUtil.extendShape<T, {
    _id: z.ZodString;
}>>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<z.objectUtil.extendShape<T, {
    _id: z.ZodString;
}>>, any>[k]; } : never, z.baseObjectInputType<z.objectUtil.extendShape<T, {
    _id: z.ZodString;
}>> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<z.objectUtil.extendShape<T, {
    _id: z.ZodString;
}>>[k_1]; } : never>;
export declare const atomicDataSchema: <T extends z.ZodRawShape | z.ZodTypeAny>(shape: T) => z.ZodObject<{
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    data: T extends z.ZodRawShape ? z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<T>[k_1]; } : never> : T;
}, "strip", z.ZodTypeAny, { [k_2 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    data: T extends z.ZodRawShape ? z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<T>[k_1]; } : never> : T;
}>, any>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    data: T extends z.ZodRawShape ? z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<T>[k_1]; } : never> : T;
}>, any>[k_2]; }, { [k_1_1 in keyof z.baseObjectInputType<{
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    data: T extends z.ZodRawShape ? z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<T>[k_1]; } : never> : T;
}>]: z.baseObjectInputType<{
    __read: z.ZodArray<z.ZodString, "many">;
    __write: z.ZodArray<z.ZodString, "many">;
    __remove: z.ZodArray<z.ZodString, "many">;
    data: T extends z.ZodRawShape ? z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<T>[k_1]; } : never> : T;
}>[k_1_1]; }>;
export {};
//# sourceMappingURL=objects.d.ts.map