import type { TuplifyUnion, NExtract } from '@core_chlbri/core';
import  {
  literal,
  object,
  TypeOf,
  ZodLiteral,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
  ZodUnion,
} from 'zod';
import { GetTypeOfUnion } from '../types/zod';

export function getLiteralValuesInArray<
  T extends [ZodLiteral<any>, ...ZodLiteral<any>[]],
>(union: ZodUnion<T>) {
  return union.options.map(un => un._def.value) as unknown as TuplifyUnion<
    GetTypeOfUnion<T>
  >;
}

export function getLiteralValuesInObject<
  T extends [ZodLiteral<any>, ...ZodLiteral<any>[]],
>(union: ZodUnion<T>) {
  return union.options
    .map(un => un._def.value)
    .reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {} as any) as {
    [key in GetTypeOfUnion<T>]: NExtract<GetTypeOfUnion<T>, key>;
  };
}

export function getLiteralValues<
  T extends [ZodLiteral<any>, ...ZodLiteral<any>[]],
>(union: ZodUnion<T>) {
  return {
    object: getLiteralValuesInObject(union),
    array: getLiteralValuesInArray(union),
  } as const;
}

export function convertUnionStringToMask<
  T extends [ZodLiteral<string>, ...ZodLiteral<string>[]],
>(union: ZodUnion<T>) {
  const processed = getLiteralValuesInArray(union) as string[];
  const out = processed
    .map(un => ({ [un]: true as const }))
    .reduce((acc, curr) => {
      Object.assign(acc, curr);
      return acc;
    }, {});
  return out as Record<GetTypeOfUnion<T>, true>;
}

export function convertObjectToArrayMask<T extends ZodRawShape>(
  obj: ZodObject<T>,
) {
  const processed = obj.shape;
  return Object.keys(processed) as TuplifyUnion<keyof T>;
}
export function convertObjectTo<
  Z extends ZodRawShape,
  T extends ZodTypeAny = ZodTypeAny,
>(obj: ZodObject<Z>, to: T) {
  const preprocesseds = convertObjectToArrayMask(obj) as string[];
  const processed = preprocesseds
    .map(processed => ({ [processed]: to }))
    .reduce((acc, curr) => {
      Object.assign(acc, curr);
      return acc;
    }, {}) as Record<keyof Z, T>;
  const out = object(processed);
  return out;
}

export function convertObjectToMask<T extends ZodRawShape>(
  obj: ZodObject<T>,
) {
  const processeds = convertObjectToArrayMask(obj) as string[];
  const out = processeds
    .map(processed => ({ [processed]: true }))
    .reduce((acc, curr) => {
      Object.assign(acc, curr);
      return acc;
    }, {});
  return out as Record<keyof T, true>;
}

const test1 = convertObjectToArrayMask(
  object({ guard: literal(true), mil: literal('yugduy') }),
);

const test2 = convertObjectToMask(
  object({ guard: literal(true), mil: literal('yugduy') }),
);

const test3 = convertObjectTo(
  object({ guard: literal(true), mil: literal('yugduy') }),
  object({ to: literal('empty') }),
);

type Test3 = TypeOf<typeof test3>;

const test4 = object({
  guard: literal(true),
  mil: literal('yugduy'),
}).shape;

type Test4 = typeof test4['guard'];
