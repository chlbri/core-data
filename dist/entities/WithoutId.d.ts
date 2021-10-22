export declare type WithoutId<T> = Omit<T, '_id'>;
export declare function isWithoutId(val: any): val is WithoutId<any>;
