'use strict';

var zod = require('zod');

const STATUS_STRINGS = [
    'information',
    'success',
    'redirect',
    'client-error',
    'server-error',
    'permission-error',
    'timeout-error',
];
const PERMISSIONS_STRINGS = zod.z.tuple([
    zod.literal('__read'),
    zod.literal('__write'),
    zod.literal('__remove'),
]);
const EXIST_CLAUSES = zod.z.literal('$exists');
const COMMON_CLAUSES = zod.z.tuple([
    zod.literal('$eq'),
    zod.literal('$ne'),
    zod.literal('$in'),
    zod.literal('$nin'),
]);
const NUMBER_CLAUSES = zod.z.tuple([
    zod.literal('$gt'),
    zod.literal('$gte'),
    zod.literal('$lt'),
    zod.literal('$lte'),
    zod.literal('$mod'),
]);
const STRING_CLAUSES = zod.z.tuple([
    zod.literal('$cts'),
    zod.literal('$sw'),
    zod.literal('$ew'),
    zod.literal('$regex'),
]);
const ARRAY_CLAUSES = zod.z.tuple([
    zod.literal('$all'),
    zod.literal('$em'),
    zod.literal('$size'),
]);
const LOGICAL_CLAUSES = zod.z.tuple([
    zod.literal('$and'),
    zod.literal('$not'),
    zod.literal('$or'),
    zod.literal('$nor'),
]);
const TYPE_ALIASES = zod.z.tuple([
    zod.literal('string'),
    zod.literal('number'),
    zod.literal('object'),
    zod.literal('array'),
    zod.literal('binData'),
    zod.literal('objectId'),
    zod.literal('boolean'),
    zod.literal('date'),
]);
const CLAUSES = zod.z.tuple([
    EXIST_CLAUSES,
    ...COMMON_CLAUSES.items,
    ...NUMBER_CLAUSES.items,
    ...STRING_CLAUSES.items,
    ...ARRAY_CLAUSES.items,
    ...LOGICAL_CLAUSES.items,
]);

exports.ARRAY_CLAUSES = ARRAY_CLAUSES;
exports.CLAUSES = CLAUSES;
exports.COMMON_CLAUSES = COMMON_CLAUSES;
exports.EXIST_CLAUSES = EXIST_CLAUSES;
exports.LOGICAL_CLAUSES = LOGICAL_CLAUSES;
exports.NUMBER_CLAUSES = NUMBER_CLAUSES;
exports.PERMISSIONS_STRINGS = PERMISSIONS_STRINGS;
exports.STATUS_STRINGS = STATUS_STRINGS;
exports.STRING_CLAUSES = STRING_CLAUSES;
exports.TYPE_ALIASES = TYPE_ALIASES;
//# sourceMappingURL=strings.cjs.map
