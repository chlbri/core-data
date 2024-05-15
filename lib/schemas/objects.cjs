'use strict';

var zod = require('zod');

// #region Configuration
// #region permissions
const permissionsShape = {
    __read: zod.z.string().array(),
    __write: zod.z.string().array(),
    __remove: zod.z.string().array(),
};
const collectionPermissionsShape = {
    __create: zod.z.string().array(),
    ...permissionsShape,
};
// #endregion
// #endregion
const timestampsSchema = zod.z.object({
    _created: zod.z.object({ date: zod.z.date(), by: zod.z.string() }),
    _updatedAt: zod.z.object({ date: zod.z.date(), by: zod.z.string() }),
    _deletedAt: zod.z.union([
        zod.z.literal(false),
        zod.z.object({ date: zod.z.date(), by: zod.z.string() }),
    ]),
});
const _entitySchema = zod.z.object({
    _id: zod.z.string(),
    ...timestampsSchema.shape,
});
function entitySchema(...shapes) {
    const shape = shapes[0];
    if (shape) {
        return _entitySchema.extend(shape);
    }
    return _entitySchema;
}
const actorSchema = entitySchema().extend({
    // ip: string().url().optional(),
    __privateKey: zod.z.string(),
    permissions: zod.z.string().array(),
});
const loginSchema = zod.z.object({
    login: zod.z.string(),
    password: zod.z.string().min(6),
});
const userSchema = zod.z.object({ __privateKey: zod.z.string() });
const phoneNumber = zod.z.tuple([zod.z.number().array(), zod.z.number()]);
const humanSchema = zod.z.object({
    firstNames: zod.z.string().array().optional(),
    lastName: zod.z.string().min(1).optional(),
    bio: zod.z.string().min(100).optional(),
    mail: zod.z.string().email().optional(),
    phoneNumber: phoneNumber.array().optional(),
});
const user = entitySchema().extend(loginSchema.shape);
// #region Generics
const withoutID = (shape) => zod.z.object(shape).omit({ _id: true });
const perimissionsBools = {
    __read: true,
    __write: true,
    __remove: true,
};
function withoutPermissions(shape) {
    const _shape = shape;
    return zod.z.object(_shape).omit(perimissionsBools);
}
function withoutPassword(shape) {
    const _shape = shape;
    return zod.z.object(_shape).omit({
        password: true,
    });
}
function withID(shape) {
    return zod.z.object(shape).extend({ _id: zod.z.string() });
}
const atomicDataSchema = (shape) => {
    const data = (shape instanceof zod.z.ZodType ? shape : zod.z.object(shape));
    return zod.z.object({
        data,
        ...permissionsShape,
    });
};
// #endregion

exports.actorSchema = actorSchema;
exports.atomicDataSchema = atomicDataSchema;
exports.collectionPermissionsShape = collectionPermissionsShape;
exports.entitySchema = entitySchema;
exports.humanSchema = humanSchema;
exports.loginSchema = loginSchema;
exports.permissionsShape = permissionsShape;
exports.phoneNumber = phoneNumber;
exports.timestampsSchema = timestampsSchema;
exports.user = user;
exports.userSchema = userSchema;
exports.withID = withID;
exports.withoutID = withoutID;
exports.withoutPassword = withoutPassword;
exports.withoutPermissions = withoutPermissions;
//# sourceMappingURL=objects.cjs.map
