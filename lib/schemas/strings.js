import { z, literal } from 'zod';

const STATUS_STRINGS = [
    'information',
    'success',
    'redirect',
    'client-error',
    'server-error',
    'permission-error',
    'timeout-error',
];
const PERMISSIONS_STRINGS = z.tuple([
    literal('__read'),
    literal('__write'),
    literal('__remove'),
]);
const EXIST_CLAUSES = z.literal('$exists');
const COMMON_CLAUSES = z.tuple([
    literal('$eq'),
    literal('$ne'),
    literal('$in'),
    literal('$nin'),
]);
const NUMBER_CLAUSES = z.tuple([
    literal('$gt'),
    literal('$gte'),
    literal('$lt'),
    literal('$lte'),
    literal('$mod'),
]);
const STRING_CLAUSES = z.tuple([
    literal('$cts'),
    literal('$sw'),
    literal('$ew'),
    literal('$regex'),
]);
const ARRAY_CLAUSES = z.tuple([
    literal('$all'),
    literal('$em'),
    literal('$size'),
]);
const LOGICAL_CLAUSES = z.tuple([
    literal('$and'),
    literal('$not'),
    literal('$or'),
    literal('$nor'),
]);
const TYPE_ALIASES = z.tuple([
    literal('string'),
    literal('number'),
    literal('object'),
    literal('array'),
    literal('binData'),
    literal('objectId'),
    literal('boolean'),
    literal('date'),
]);
const CLAUSES = z.tuple([
    EXIST_CLAUSES,
    ...COMMON_CLAUSES.items,
    ...NUMBER_CLAUSES.items,
    ...STRING_CLAUSES.items,
    ...ARRAY_CLAUSES.items,
    ...LOGICAL_CLAUSES.items,
]);

export { ARRAY_CLAUSES, CLAUSES, COMMON_CLAUSES, EXIST_CLAUSES, LOGICAL_CLAUSES, NUMBER_CLAUSES, PERMISSIONS_STRINGS, STATUS_STRINGS, STRING_CLAUSES, TYPE_ALIASES };
//# sourceMappingURL=strings.js.map
