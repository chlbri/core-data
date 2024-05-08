import { z } from 'zod';
import type { Ra, Ru } from '../types';

export * from './objects';
export * from './strings';

export type TransformToZodShape<T extends Ra> = {
  [key in keyof T]: T[key] extends Ru
    ? z.ZodObject<TransformToZodShape<T[key]>>
    : z.ZodTypeAny;
};

const tt = z.object({
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

type TT1 = z.infer<typeof tt>;

export type TT2 = z.infer<z.ZodObject<TransformToZodShape<TT1>>>;

// export type TransformToZodShape<T extends Ru> = Record<
//   keyof T,
//   z.ZodTypeAny
// >;

export type TransformToZodObject<T extends Ru> = z.ZodObject<
  TransformToZodShape<T>
>;
