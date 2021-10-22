import { WithoutId } from './WithoutId';

export function isWithId(val: any): val is WithoutId<any> {
  return Object.keys(val).includes('_id');
}

export type WithId<T> = WithoutId<T> & { _id: string };
