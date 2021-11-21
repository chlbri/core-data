import {
  collectionPermissionsShape,
  entitySchema,
  permissionsShape,
  timestampsSchema,
} from './schemas/objects';
import { object, TypeOf } from 'zod';

export type Entity = TypeOf<typeof entitySchema>;
export type WithoutId<T> = Omit<T, '_id'>;

export type WithId<T> = WithoutId<T> & { _id: string };

export type TimeStamps = TypeOf<typeof timestampsSchema>;

export type WithoutTimeStamps<T> = Omit<T, keyof TimeStamps>;

const perm = object(permissionsShape);
const colPerm = object(collectionPermissionsShape);

export type AtomicData<T> = {
  data: T;
} & TypeOf<typeof perm>;

export type CollectionPermissions = TypeOf<typeof colPerm>;

export type AtomicObject<T extends Entity> = {
  [key in keyof WithoutId<T>]: AtomicData<T[key]>;
} & { _id: T['_id'] };

type UnionPerm = keyof TypeOf<typeof perm>;

export type WithoutPermissions<T> = Omit<T, UnionPerm>;
