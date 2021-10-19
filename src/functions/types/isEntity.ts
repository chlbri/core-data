import {Entity} from '../../entities/Entity';

export function isEntity(val: any): val is Entity {
  return Object.keys(val).includes('_id');
}
