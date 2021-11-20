"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLAUSES = exports.TYPE_ALIASES = exports.LOGICAL_CLAUSES = exports.ARRAY_CLAUSES = exports.STRING_CLAUSES = exports.NUMBER_CLAUSES = exports.COMMON_CLAUSES = exports.EXIST_CLAUSES = exports.PERMISSIONS_STRINGS = exports.STATUS_STRINGS = void 0;
const zod_1 = require("zod");
exports.STATUS_STRINGS = [
    'information',
    'success',
    'redirect',
    'client-error',
    'server-error',
    'permission-error',
    'timeout-error',
];
exports.PERMISSIONS_STRINGS = (0, zod_1.tuple)([
    (0, zod_1.literal)('__read'),
    (0, zod_1.literal)('__write'),
    (0, zod_1.literal)('__remove'),
]);
exports.EXIST_CLAUSES = (0, zod_1.literal)('$exists');
exports.COMMON_CLAUSES = (0, zod_1.tuple)([
    (0, zod_1.literal)('$eq'),
    (0, zod_1.literal)('$ne'),
    (0, zod_1.literal)('$in'),
    (0, zod_1.literal)('$nin'),
]);
exports.NUMBER_CLAUSES = (0, zod_1.tuple)([
    (0, zod_1.literal)('$gt'),
    (0, zod_1.literal)('$gte'),
    (0, zod_1.literal)('$lt'),
    (0, zod_1.literal)('$lte'),
    (0, zod_1.literal)('$mod'),
]);
exports.STRING_CLAUSES = (0, zod_1.tuple)([
    (0, zod_1.literal)('$cts'),
    (0, zod_1.literal)('$sw'),
    (0, zod_1.literal)('$ew'),
    (0, zod_1.literal)('$regex'),
]);
exports.ARRAY_CLAUSES = (0, zod_1.tuple)([
    (0, zod_1.literal)('$all'),
    (0, zod_1.literal)('$em'),
    (0, zod_1.literal)('$size'),
]);
exports.LOGICAL_CLAUSES = (0, zod_1.tuple)([
    (0, zod_1.literal)('$and'),
    (0, zod_1.literal)('$not'),
    (0, zod_1.literal)('$or'),
    (0, zod_1.literal)('$nor'),
]);
exports.TYPE_ALIASES = (0, zod_1.tuple)([
    (0, zod_1.literal)('string'),
    (0, zod_1.literal)('number'),
    (0, zod_1.literal)('object'),
    (0, zod_1.literal)('array'),
    (0, zod_1.literal)('binData'),
    (0, zod_1.literal)('objectId'),
    (0, zod_1.literal)('boolean'),
    (0, zod_1.literal)('date'),
]);
exports.CLAUSES = (0, zod_1.tuple)([
    exports.EXIST_CLAUSES,
    ...exports.COMMON_CLAUSES.items,
    ...exports.NUMBER_CLAUSES.items,
    ...exports.STRING_CLAUSES.items,
    ...exports.ARRAY_CLAUSES.items,
    ...exports.LOGICAL_CLAUSES.items,
]);
