import { PERMISSIONS_STRINGS } from '../schemas/strings';
import { OmitRecursive } from 'core';

export type PermissionStrings = typeof PERMISSIONS_STRINGS[number];

export type WithoutPermissions<T> = OmitRecursive<T, PermissionStrings>;
