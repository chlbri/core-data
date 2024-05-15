import { z } from 'zod';

// #region Configuration
// #region permissions
const permissionsShape = {
    __read: z.string().array(),
    __write: z.string().array(),
    __remove: z.string().array(),
};
const collectionPermissionsShape = {
    __create: z.string().array(),
    ...permissionsShape,
};
// #endregion
// #endregion
const timestampsSchema = z.object({
    _created: z.object({ date: z.date(), by: z.string() }),
    _updatedAt: z.object({ date: z.date(), by: z.string() }),
    _deletedAt: z.union([
        z.literal(false),
        z.object({ date: z.date(), by: z.string() }),
    ]),
});
const _entitySchema = z.object({
    _id: z.string(),
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
    __privateKey: z.string(),
    permissions: z.string().array(),
});
const loginSchema = z.object({
    login: z.string(),
    password: z.string().min(6),
});
const userSchema = z.object({ __privateKey: z.string() });
const phoneNumber = z.tuple([z.number().array(), z.number()]);
const humanSchema = z.object({
    firstNames: z.string().array().optional(),
    lastName: z.string().min(1).optional(),
    bio: z.string().min(100).optional(),
    mail: z.string().email().optional(),
    phoneNumber: phoneNumber.array().optional(),
});
const user = entitySchema().extend(loginSchema.shape);
// #region Generics
const withoutID = (shape) => z.object(shape).omit({ _id: true });
const perimissionsBools = {
    __read: true,
    __write: true,
    __remove: true,
};
function withoutPermissions(shape) {
    const _shape = shape;
    return z.object(_shape).omit(perimissionsBools);
}
function withoutPassword(shape) {
    const _shape = shape;
    return z.object(_shape).omit({
        password: true,
    });
}
function withID(shape) {
    return z.object(shape).extend({ _id: z.string() });
}
const atomicDataSchema = (shape) => {
    const data = (shape instanceof z.ZodType ? shape : z.object(shape));
    return z.object({
        data,
        ...permissionsShape,
    });
};
// #endregion

export { actorSchema, atomicDataSchema, collectionPermissionsShape, entitySchema, humanSchema, loginSchema, permissionsShape, phoneNumber, timestampsSchema, user, userSchema, withID, withoutID, withoutPassword, withoutPermissions };
//# sourceMappingURL=objects.js.map
