import { AtomicData } from './AtomicData';
/**
 * Signature only
 */
export declare type Data<T extends string> = {
    [key in T]: AtomicData;
};
