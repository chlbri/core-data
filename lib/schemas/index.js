import { z } from 'zod';
export { actorSchema, atomicDataSchema, collectionPermissionsShape, entitySchema, humanSchema, loginSchema, permissionsShape, phoneNumber, timestampsSchema, user, userSchema, withID, withoutID, withoutPassword, withoutPermissions } from './objects.js';
export { ARRAY_CLAUSES, CLAUSES, COMMON_CLAUSES, EXIST_CLAUSES, LOGICAL_CLAUSES, NUMBER_CLAUSES, PERMISSIONS_STRINGS, STATUS_STRINGS, STRING_CLAUSES, TYPE_ALIASES } from './strings.js';

z.object({
    age: z.number(),
    login: z.string(),
    password: z.string(),
    data: z.object({
        phoneNumber: z.object({
            country: z.number(),
            number: z.number(),
            ex: z.object({
                one: z.number(),
                two: z.boolean(),
            }),
        }),
    }),
});
//# sourceMappingURL=index.js.map
