import { createTests } from '@bemedev/vitest-extended';
import { describe } from 'vitest';
import { z } from 'zod';
import {
  intersectObjects,
  isPrimitive,
  zodDecomposeKeys,
} from './arrayDB.functions';

describe('#1 => Functions', () => {
  describe('#1 => ZodDecomposeKeys', () => {
    const useTests = createTests(zodDecomposeKeys);

    useTests(
      //@ts-expect-error eret
      ['Empty shape', [{}], []],
      [
        'simple shape',
        [{ age: z.number(), name: z.string() }],
        ['age', 'name'],
      ],
      [
        'complex shape #1, the object is empty',
        [{ age: z.number(), name: z.string(), data: z.object({}) }],
        ['age', 'data', 'name'],
      ],
      [
        'complex shape #2, the object is simple',
        [
          {
            age: z.number(),
            login: z.string(),
            password: z.string(),
            data: z.object({
              firstName: z.string(),
              lastName: z.string(),
              age: z.number(),
            }),
          },
        ],
        [
          'age',
          'data',
          'data.age',
          'data.firstName',
          'data.lastName',
          'login',
          'password',
        ],
      ],
      [
        'complex shape #3, the object is recurscive',
        [
          {
            age: z.number(),
            login: z.string(),
            password: z.string(),
            data: z.object({
              firstName: z.string(),
              lastName: z.string(),
              age: z.number(),
              phoneNumber: z.object({
                country: z.number(),
                number: z.number(),
              }),
            }),
          },
        ],
        [
          'age',
          'data',
          'data.age',
          'data.firstName',
          'data.lastName',
          'data.phoneNumber',
          'data.phoneNumber.country',
          'data.phoneNumber.number',
          'login',
          'password',
        ],
      ],
    );
  });

  describe('#2 => isPrimitive', () => {
    const useTests = createTests(isPrimitive);

    useTests(
      ['string => true', ['str'], true],
      ['number --  25 => true', [25], true],
      ['number --  0 => true', [0], true],
      ['boolean -- true => true', [true], true],
      ['boolean -- false => true', [false], true],
      ['null => true', [null], true],
      ['undefined => true', [undefined], true],
      ['Empty object => false', [{}], false],
      ['Simple object => false', [{ age: 45, login: 'login' }], false],
    );
  });

  describe('#3 => intersectionObjects', () => {
    const useTests = createTests(intersectObjects);

    useTests(
      ['#0 No object => Empty object', [], undefined],
      ['#1 One object => Empty object', [{}], {}],
      [
        '#1 One object => Simple object',
        [{ age: 64, login: 'login' }],
        { age: 64, login: 'login' },
      ],
      [
        '#1 One object => Recursive object',
        [
          {
            _id: 'id',
            data: {
              age: 64,
              login: 'login',
            },
          },
        ],
        {
          _id: 'id',
          data: {
            age: 64,
            login: 'login',
          },
        },
      ],
      ['#2 Many objects -> Empty objects', [{}, {}, {}], {}],
      [
        '#2 Many objects -> Same objects',
        [
          { age: 64, login: 'login' },
          { age: 64, login: 'login' },
        ],
        { age: 64, login: 'login' },
      ],
      [
        '#2 Many objects -> Different simple objects, first example',
        [
          { age: 64, login: 'login' },
          { age2: 64, login3: 'login' },
        ],
        {},
      ],
      [
        '#2 Many objects -> Different simple objects, second example',
        [
          { age: 64, login: 'login', stats: 54 },
          { age: 54, login: 'login34', other: true },
        ],
        { age: 54, login: 'login34' },
      ],
      [
        '#2 Many objects -> Different simple objects, third example',
        [
          { age: 64, login: 'login', stats: 54 },
          { age: 54, login: 'login34', other: true },
          { age: 40, login2: 'login34', other: true },
        ],
        { age: 40 },
      ],
      [
        '#2 Many objects -> Different recursive objects, first example',
        [
          { data: { age: 64, login: 'login' }, stats: 54 },
          { data: { age: 54, login: 'login34' }, other: true },
        ],
        { data: { age: 54, login: 'login34' } },
      ],

      [
        '#2 Many objects -> Different recursive objects, second example',
        [
          { data: { age: 64, login: 'login' }, stats: 54 },
          { data: { age: 54, login: 'login34' }, stats: true },
          { data: { age: 54, login2: 'login34' }, stats: false },
        ],
        { data: { age: 54 }, stats: false },
      ],

      [
        '#2 Many objects -> Different recursive objects, third example',
        [
          { data: { age: 64, login: 'login' }, stats: 54 },
          { data: { age: 54, login: 'login34' }, other: true },
          { data: { age: 54, login2: 'login34' }, stats: false },
          { data: { age: 54, login2: 'login34' }, stats: false },
        ],
        { data: { age: 54 } },
      ],

      [
        '#2 Many objects -> Different recursive objects, fourth example',
        [
          { data: { age: 64, login: 'login' }, stats: 54 },
          { data: { age: 54, login: 'login34' }, other: true },
          { data: { age: 54, login2: 'login34' }, stats: false },
          { data2: { age: 54, login2: 'login34' }, stats: false },
        ],
        {},
      ],
    );
  });
});
