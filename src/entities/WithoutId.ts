export type WithoutId<T> = Omit<T, '_id'>;

export function isWithoutId(val: any): val is WithoutId<any> {
  return !Object.keys(val).includes('_id');
}
