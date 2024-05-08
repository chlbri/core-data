import { expectType } from 'tsd';
import { z } from 'zod';
import { zodDecomposeKeys } from './arrayDB.functions';

// #region Empty shape
const zod0 = zodDecomposeKeys({});
//@ts-ignore
expectType<[]>(zod0);
// #endregion

// #region simple shape
const zod1 = zodDecomposeKeys({ age: z.number(), name: z.string() });

expectType<('age' | 'name')[]>(zod1);
// #endregion

// #region complex shape #1, the object is empty
const zod2 = zodDecomposeKeys({
  age: z.number(),
  name: z.string(),
  data: z.object({}),
});

expectType<('age' | 'name' | 'data')[]>(zod2);
// #endregion

// #region complex shape #2, the object is simple
const shape = {
  age: z.number(),
  login: z.string(),
  password: z.string(),
  data: z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
  }),
};

const zod3 = zodDecomposeKeys(shape);

expectType<
  (
    | 'age'
    | 'login'
    | 'password'
    | 'data'
    | 'data.firstName'
    | 'data.lastName'
    | 'data.age'
  )[]
>(zod3);
// #endregion
