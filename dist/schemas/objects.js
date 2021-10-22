"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicDataSchema = exports.withID = exports.withoutPassword = exports.withoutPermissions = exports.withoutID = exports.humanSchema = exports.userSchema = exports.actorSchema = exports.loginSchema = exports.entitySchema = void 0;
const zod_1 = require("zod");
// #region Configuration
// #region permissions
const permissionsSchema = {
    __read: (0, zod_1.array)((0, zod_1.string)()),
    __update: (0, zod_1.array)((0, zod_1.string)()),
    __delete: (0, zod_1.array)((0, zod_1.string)()),
};
const perimissionsBools = {
    __read: true,
    __update: true,
    __delete: true,
};
// #endregion
// #endregion
exports.entitySchema = (0, zod_1.object)({
    _id: (0, zod_1.string)(),
});
exports.loginSchema = (0, zod_1.object)({
    login: (0, zod_1.string)(),
    password: (0, zod_1.string)().min(6),
});
exports.actorSchema = (0, zod_1.object)({
    ...exports.entitySchema.shape,
    login: exports.loginSchema.shape.login,
    ip: (0, zod_1.string)().url().optional(),
    permissions: (0, zod_1.array)((0, zod_1.string)()),
});
exports.userSchema = (0, zod_1.object)({ __privateKey: (0, zod_1.string)() });
exports.humanSchema = (0, zod_1.object)({
    firstNames: (0, zod_1.array)((0, zod_1.string)()).optional(),
    lastName: (0, zod_1.string)().min(1).optional(),
});
// #region Generics
const withoutID = (shape) => (0, zod_1.object)(shape).omit({ _id: true });
exports.withoutID = withoutID;
const withoutPermissions = (shape) => (0, zod_1.object)(shape).omit(perimissionsBools);
exports.withoutPermissions = withoutPermissions;
const withoutPassword = (shape) => (0, zod_1.object)(shape).omit({ password: true });
exports.withoutPassword = withoutPassword;
const withID = (shape) => (0, zod_1.object)(shape).pick({ _id: true });
exports.withID = withID;
const atomicDataSchema = (shape) => {
    const data = (shape instanceof zod_1.ZodType ? shape : (0, zod_1.object)(shape));
    return (0, zod_1.object)({
        data,
        ...permissionsSchema,
    });
};
exports.atomicDataSchema = atomicDataSchema;
// #endregion
