import { entitySchema, permissionsSchema } from './schemas/objects';
import { object, TypeOf } from 'zod';

export type Entity = TypeOf<typeof entitySchema>;
export type WithoutId<T> = Omit<T, '_id'>;

export type WithId<T> = WithoutId<T> & { _id: string };

const perm = object(permissionsSchema);

export type AtomicData<T> = {
  data: T;
} & TypeOf<typeof perm>;

type UnionPerm = keyof TypeOf<typeof perm>;

export type WithoutPermissions<T> = Omit<T, UnionPerm>;
