import { PERMISSIONS_STRINGS } from '../constants/strings';
import {OmitRecursive} from 'core'

export type PermissionStrings =
  typeof PERMISSIONS_STRINGS[number];

export type WithoutPermissions<T> = OmitRecursive<
  T,
  PermissionStrings
>;

//TODO: Add a better way to exit with false
export function isWithoutPermissions(
  val: any,
): val is WithoutPermissions<any> {
  return Object.keys(val).every(
    (val) =>
      !(PERMISSIONS_STRINGS as readonly string[]).includes(val),
  );
}
