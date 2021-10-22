import { PERMISSIONS_STRINGS } from '../schemas/strings';
import { OmitRecursive } from 'core';
export declare type PermissionStrings = typeof PERMISSIONS_STRINGS[number];
export declare type WithoutPermissions<T> = OmitRecursive<T, PermissionStrings>;
