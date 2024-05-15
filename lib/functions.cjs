'use strict';

var zod = require('zod');
require('./schemas/index.cjs');
var schemas_objects = require('./schemas/objects.cjs');

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
        return schemas_objects.entitySchema(shape).safeParse(value).success;
    }
    return schemas_objects.entitySchema().safeParse(value).success;
}
const tto = {};
const ttest = isEntity(tto);
if (ttest) {
    tto._id;
}
const ttest2 = isEntity(tto, { login: zod.z.string() });
if (ttest2) {
    tto.login;
}

exports.includesMany = includesMany;
exports.isEntity = isEntity;
exports.isNotClause = isNotClause;
exports.isSearchOperation = isSearchOperation;
//# sourceMappingURL=functions.cjs.map
