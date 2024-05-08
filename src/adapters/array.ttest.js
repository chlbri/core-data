import { z } from 'zod';

const _schema1 = z.object({
  age: z.number(),
  data: z.object({
    age: z.number(),
    login: z.string(),
    password: z.string(),
  }),
});

console.log(_schema1.shape);

const arr = [
  { arr: ['one', 'two', 'three'] },
  { arr: ['four', 'five', 'six'] },
];

console.log(arr.map(data => Object.values(data).flat()).flat());
