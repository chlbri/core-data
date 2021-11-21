"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicDataSchema = exports.withID = exports.withoutPassword = exports.withoutPermissions = exports.withoutID = exports.user = exports.humanSchemaAdd = exports.phoneNumber = exports.humanSchema = exports.userSchema = exports.loginSchema = exports.actorSchema = exports.entitySchema = exports.timestampsSchema = exports.collectionPermissionsShape = exports.permissionsShape = void 0;
const zod_1 = require("zod");
// #region Configuration
// #region permissions
exports.permissionsShape = {
    __read: (0, zod_1.array)((0, zod_1.string)()),
    __write: (0, zod_1.array)((0, zod_1.string)()),
    __remove: (0, zod_1.array)((0, zod_1.string)()),
};
exports.collectionPermissionsShape = {
    __create: (0, zod_1.array)((0, zod_1.string)()),
    ...exports.permissionsShape,
};
const perimissionsBools = {
    __read: true,
    __write: true,
    __remove: true,
};
// #endregion
// #endregion
exports.timestampsSchema = (0, zod_1.object)({
    _createdAt: (0, zod_1.date)(),
    _updatedAt: (0, zod_1.date)(),
    _deletedAt: (0, zod_1.union)([(0, zod_1.literal)(false), (0, zod_1.date)()]),
});
exports.entitySchema = (0, zod_1.object)({
    _id: (0, zod_1.string)(),
    ...exports.timestampsSchema.shape,
});
exports.actorSchema = (0, zod_1.object)({
    _id: exports.entitySchema.shape._id,
    ip: (0, zod_1.string)().url().optional(),
    permissions: (0, zod_1.array)((0, zod_1.string)()),
});
exports.loginSchema = (0, zod_1.object)({
    login: (0, zod_1.string)(),
    password: (0, zod_1.string)().min(6),
});
exports.userSchema = (0, zod_1.object)({ __privateKey: (0, zod_1.string)() });
exports.humanSchema = (0, zod_1.object)({
    firstNames: (0, zod_1.array)((0, zod_1.string)()).optional(),
    lastName: (0, zod_1.string)().min(1).optional(),
});
exports.phoneNumber = (0, zod_1.tuple)([(0, zod_1.array)((0, zod_1.number)()), (0, zod_1.number)()]);
exports.humanSchemaAdd = (0, zod_1.object)({
    ...exports.humanSchema.shape,
    bio: (0, zod_1.string)().min(100).optional(),
    mail: (0, zod_1.string)().email().optional(),
    phoneNumber: (0, zod_1.array)(exports.phoneNumber).optional(),
});
exports.user = (0, zod_1.object)({
    ...exports.entitySchema.shape,
    __privateKey: (0, zod_1.string)(),
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
        ...exports.permissionsShape,
    });
};
exports.atomicDataSchema = atomicDataSchema;
// #endregion
