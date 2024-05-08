import { expectNotType, expectType } from 'tsd';
import type {
  DeepRequired,
  Entity,
  EntryWithPermissions,
  PermissionsArray,
} from './entities';

// #region DeepRequired

declare const ttDP1: DeepRequired<{
  alpha?: { beta?: string };
  ceta?: string;
}>;

expectType<{
  alpha: { beta: string };
  ceta: string;
}>(ttDP1);
// #endregion

// #region CollectionWithPermissions<{ age?: number }>
declare const ttP1: EntryWithPermissions<Entity & { age?: number }>;
expectType<PermissionsArray>(ttP1._created);
expectType<PermissionsArray>(ttP1._deleted);
expectType<PermissionsArray>(ttP1._updated);
expectType<PermissionsArray>(ttP1.age);
expectType<string>(ttP1._id);

// #endregion

// #region CollectionWithPermissions<{age: number; login?: string;}>
declare const ttP2: EntryWithPermissions<
  Entity & {
    age: number;
    login?: string;
  }
>;
expectType<string>(ttP2._id);
expectType<PermissionsArray>(ttP2.age);
expectType<PermissionsArray>(ttP2.login);
expectNotType<PermissionsArray | undefined>(ttP2._created);
expectType<PermissionsArray>(ttP2._updated);
expectType<PermissionsArray>(ttP2._deleted);
// #endregion

// // #region Complex
// declare const ttP3: CollectionWithPermissions<
//   Entity & {
//     _id: string;
//     age: number;
//     login: string;
//     password: string;
//     phoneNumber?: {
//       country?: number;
//       number: number;
//     };
//   }
// >;
// expectType<
//   {
//     age: CollectionPermissions;
//     login: CollectionPermissions;
//     password: CollectionPermissions;
//     phoneNumber: {
//       country: CollectionPermissions;
//       number: CollectionPermissions;
//     };
//   } & TimeStampsPermissions
// >(ttP3);

// // #region Not Type
// expectNotType<{
//   age: CollectionPermissions;
//   login: CollectionPermissions;
//   password: CollectionPermissions;
//   phoneNumber?: {
//     country: CollectionPermissions;
//     number: CollectionPermissions;
//   };
// }>(ttP3);
// expectNotType<{
//   age: CollectionPermissions;
//   login: CollectionPermissions;
//   password: CollectionPermissions;
//   phoneNumber: {
//     country?: CollectionPermissions;
//     number: CollectionPermissions;
//   };
// }>(ttP3);
// // #endregion

// // #endregion
