import { z } from 'zod';

// #region Configuration
// #region permissions
export const permissionsShape = {
  __read: z.string().array(),
  __write: z.string().array(),
  __remove: z.string().array(),
};

export const collectionPermissionsShape = {
  __create: z.string().array(),
  ...permissionsShape,
};

// #endregion
// #endregion

export const timestampsSchema = z.object({
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

export function entitySchema<T extends []>(
  ...shape: T
): typeof _entitySchema;

export function entitySchema<T extends [z.ZodRawShape]>(
  ...shape: T
): z.ZodObject<(typeof _entitySchema)['shape'] & T[0]>;

export function entitySchema<T extends [z.ZodRawShape] | []>(
  ...shapes: T
) {
  const shape = shapes[0];
  if (shape) {
    return _entitySchema.extend(shape);
  }
  return _entitySchema;
}

export const actorSchema = entitySchema().extend({
  // ip: string().url().optional(),
  __privateKey: z.string(),
  permissions: z.string().array(),
});

export const loginSchema = z.object({
  login: z.string(),
  password: z.string().min(6),
});

export const userSchema = z.object({ __privateKey: z.string() });

export const phoneNumber = z.tuple([z.number().array(), z.number()]);

export const humanSchema = z.object({
  firstNames: z.string().array().optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().min(100).optional(),
  mail: z.string().email().optional(),
  phoneNumber: phoneNumber.array().optional(),
});

export const user = entitySchema().extend(loginSchema.shape);

// #region Generics
export const withoutID = (shape: z.ZodRawShape) =>
  z.object(shape).omit({ _id: true });

const perimissionsBools = {
  __read: true,
  __write: true,
  __remove: true,
} as const;

type AddAny<T extends z.ZodRawShape, Arr extends string> = T &
  Record<Arr, z.ZodTypeAny>;

export function withoutPermissions<T extends z.ZodRawShape>(shape: T) {
  const _shape = shape as AddAny<T, keyof typeof perimissionsBools>;
  return z.object(_shape).omit(perimissionsBools);
}

export function withoutPassword<T extends z.ZodRawShape>(shape: T) {
  const _shape = shape as AddAny<T, 'password'>;
  return z.object(_shape).omit({
    password: true,
  });
}

export function withID<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).extend({ _id: z.string() });
}

export const atomicDataSchema = <T extends z.ZodRawShape | z.ZodTypeAny>(
  shape: T,
) => {
  const data = (
    shape instanceof z.ZodType ? shape : z.object(shape)
  ) as T extends z.ZodRawShape ? z.ZodObject<T> : T;

  return z.object({
    data,
    ...permissionsShape,
  });
};
// #endregion
