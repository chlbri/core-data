import {
  AnyZodObject,
  TypeOf,
  ZodBoolean,
  ZodLiteral,
  ZodNull,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodTypeAny,
} from 'zod';

export type GetTypeOfUnion<T extends ZodLiteral<any>[]> = T extends [
  ZodLiteral<infer U>,
  ...ZodLiteral<infer U>[]
]
  ? U
  : never;

export type GetShape<T extends AnyZodObject> = T extends ZodObject<{
  [key in infer K]: ZodTypeAny;
}>
  ? { [key in K]: T['shape'][key] }
  : never;

type Test1 = GetShape<ZodObject<{ data: ZodNumber; bol: ZodBoolean }>>;

export type Partialize<
  T extends AnyZodObject,
> = ZodObject<{
  [key in keyof GetShape<T>]: ZodOptional<GetShape<T>[key]>;
}>;

type Test2 = TypeOf<
  Partialize<ZodObject<{ data: ZodNumber; bol: ZodBoolean }>>
>;

function dev(): Test2 {
  return {};
}
