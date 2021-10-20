import { array, number, object, string, ZodObject, ZodType } from 'zod';

import type { TypeOf, ZodRawShape } from 'zod';

// #region Configuration
// #region permissions
const permissionsSchema = {
  __read: array(string()),
  __update: array(string()),
  __delete: array(string()),
};

const perimissionsBools = {
  __read: true,
  __update: true,
  __delete: true,
} as const;
// #endregion
// #endregion

export const entitySchema = object({
  _id: string(),
});

export const loginSchema = object({
  login: string(),
  password: string().min(6),
});

export const actorSchema = object({
  ...entitySchema.shape,
  login: loginSchema.shape.login,
  ip: string().url().optional(),
  permissions: array(string()),
});

export const userSchema = object({ __privateKey: string() });

export const humanSchema = object({
  firstNames: array(string()).optional(),
  lastName: string().min(1).optional(),
});

// #region Generics
export const withoutID = <T extends ZodRawShape>(shape: T) =>
  object(shape).omit({ _id: true });

export const withoutPermissions = <T extends ZodRawShape>(shape: T) =>
  object(shape).omit(perimissionsBools);

export const withoutPassword = <T extends ZodRawShape>(shape: T) =>
  object(shape).omit({ password: true });

export const withID = <T extends ZodRawShape>(shape: T) =>
  object(shape).pick({ _id: true });

export const atomicDataSchema = <T extends ZodRawShape | ZodType<any>>(
  shape: T,
) => {
  const data = (
    shape instanceof ZodType ? shape : object(shape)
  ) as T extends ZodRawShape ? ZodObject<T> : T;

  return object({
    data,
    ...permissionsSchema,
  });
};
// #endregion

const dert = atomicDataSchema({ go: string(), _iod: number() });

type Test = TypeOf<typeof dert>;
