import type { VSO } from './types';

export function isSearchOperation(val: any): val is VSO {
  return Object.keys(val).every((val) => val.startsWith('$'));
}
