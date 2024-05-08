export type TimeStamps = {
  _created: { by: string; at: Date };
  _updated: { by: string; at: Date };
  _deleted: false | { by: string; at: Date };
};

export type Entity = {
  _id: string;
} & TimeStamps;

export type WithEntity<T extends Re> = Entity & T;

export type WithoutId<T> = Omit<T, '_id'>;

export type WithId<T> = T & { _id: string };

export type WithoutTimeStamps<T> = Omit<T, keyof TimeStamps | '_id'>;

export type PermissionsKeys = '__read' | '__update' | '__remove';
export type Permissions = Record<PermissionsKeys, string>;

export type PermissionsArray = Record<
  PermissionsKeys,
  Permissions[PermissionsKeys][]
>;

export type PermissionsObject<T extends Re> = Record<
  keyof T,
  PermissionsArray
>;

export type Re = Record<string, unknown>;

export type CollectionPermissions = Permissions & {
  __create: string;
};

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

export type ObjectWithPermissions<T extends Re> = {
  [key in keyof T]: T[key] extends Re
    ? ObjectWithPermissions<T[key]>
    : PermissionsArray;
};

export type TimeStampsPermissions = Record<
  keyof TimeStamps,
  PermissionsArray
>;

export type EntryWithPermissions<T> = ObjectWithPermissions<
  DeepRequired<WithoutTimeStamps<T>>
> & {
  _id: string;
} & TimeStampsPermissions;

export type Actor =
  | { actorID: string; superAdmin: true }
  | {
      actorID: string;
      privateKey: string;
      permissions: string[];
      superAdmin?: false;
    };
