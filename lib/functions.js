import { z } from 'zod';
import './schemas/index.js';
import { entitySchema } from './schemas/objects.js';

function isSearchOperation(val) {
    return Object.keys(val).every(val => val.startsWith('$'));
}
function isNotClause(value) {
    return Object.keys(value)[0] === '$not';
}
function includesMany(array, includes) {
    return includes.every(include => array.includes(include));
}
function isEntity(value, ...[shape]) {
    if (shape) {
        return entitySchema(shape).safeParse(value).success;
    }
    return entitySchema().safeParse(value).success;
}
const tto = {};
const ttest = isEntity(tto);
if (ttest) {
    tto._id;
}
const ttest2 = isEntity(tto, { login: z.string() });
if (ttest2) {
    tto.login;
}

export { includesMany, isEntity, isNotClause, isSearchOperation };
//# sourceMappingURL=functions.js.map
