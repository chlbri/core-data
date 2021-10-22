export interface AtomicData<T = any> {
    _read: (string | number)[];
    _update: (string | number)[];
    _delete: (string | number)[];
    data: T;
}
