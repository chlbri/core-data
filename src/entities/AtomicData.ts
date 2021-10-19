export interface AtomicData<T = any> {
  _read: string;
  _update: string;
  _delete: string;
  data: T;
}
