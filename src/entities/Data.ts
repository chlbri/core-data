import { AtomicData } from './AtomicData';

/**
 * Signature only
 */
export type Data<T extends string> = {
  [key in T]: AtomicData;
};
