import {ZodTuple, ZodLiteral, tuple} from 'zod';
import type {Not, OSO, VSO} from './types';

export function isSearchOperation(val: any): val is VSO {
  return Object.keys(val).every(val => val.startsWith('$'));
}

export function isNotClause<T = any>(value: any): value is Not<T> {
  return Object.keys(value) === ['$not'];
}
export function isOSO<T = any>(value: any): value is OSO<T> {
  return Object.keys(value) === ['$not'];
}

export function concatTuple<
  T extends [ZodLiteral<any>, ...ZodLiteral<any>[]],
>(...args: T) {
  return tuple(args);
}