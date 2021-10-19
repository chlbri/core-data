import { AtomicData } from './AtomicData';

/**
 * SIgnature only
 */
export type Data<T extends string> = {
  [key in T]: AtomicData;
};
