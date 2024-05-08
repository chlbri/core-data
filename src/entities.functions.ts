import { Pipe, Unions } from 'hotscript';
import { merge } from 'ts-deepmerge';
import { DELIMITER } from './constants/strings';
import { Ru } from './types';

export function recomposeObjectUrl<T>(shape: string, value: T) {
  const obj: any = {};
  if (shape.length <= 0) return obj;

  const keys = shape.split(DELIMITER);
  if (keys.length === 1) {
    const key = keys.shift();
    obj[key!] = value;
  } else {
    const key = keys.shift();
    obj[key!] = recomposeObjectUrl(keys.join(DELIMITER), value);
  }

  return obj;
}

type Primitive = string | number | boolean | null | undefined;

export function isPrimitive(arg: any): arg is Primitive {
  return (
    typeof arg === 'number' ||
    typeof arg === 'string' ||
    typeof arg === 'boolean' ||
    arg === undefined ||
    arg === null
  );
}

export type Unionize<T extends Record<string, any>> = {
  [P in keyof T]: { [Q in P]: T[P] };
}[keyof T];

type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A
    ? K extends keyof B
      ? A[K] | B[K]
      : A[K]
    : K extends keyof B
      ? B[K]
      : never;
};

export type SpliString<
  T extends Ru,
  S extends string | never = never,
> = keyof T extends `${infer A}.${infer B}`
  ? B extends `${string}.${string}`
    ? SpliString<T[keyof T]>
    : Record<
        A,
        Pipe<{ [key in B]: T[`${A}.${B}`] }, [Unions.ToIntersection]>
      >
  : T;

type TT = SpliString<{
  'data.age': number;
  'data.name.value': string;
}>;

export function recompose<T extends Ru>(shape: T) {
  const entries = Object.entries(shape);
  const arr: any[] = [];
  entries.forEach(([key, value]) => {
    arr.push(recomposeObjectUrl(key, value));
  });
  const out = merge(...arr);
  return out as any;
}
