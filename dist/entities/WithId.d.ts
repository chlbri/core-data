import { WithoutId } from './WithoutId';
export declare function isWithId(val: any): val is WithoutId<any>;
export declare type WithId<T> = WithoutId<T> & {
    _id: string;
};
