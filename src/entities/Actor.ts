import { Entity } from './Entity';
import { WithoutPermissions } from './WithoutPermissions';

export interface Actor
  extends Required<WithoutPermissions<Entity>> {
  login: string;
  ip: string;
  location?: string;
  permissions: string[];
}
