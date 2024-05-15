'use strict';

var decompose = require('@bemedev/decompose');
var dequal = require('dequal');
var zod = require('zod');
var functions = require('../functions.cjs');

function inStreamSearchAdapterKey(op) {
    // if (!op) return () => true;
    const keys = Object.keys(op);
    if (keys.every(key => !key.includes('$'))) {
        return (arg) => {
            if (typeof arg === 'string' ||
                typeof arg === 'number' ||
                typeof arg === 'bigint' ||
                typeof arg === 'boolean' ||
                typeof arg === 'undefined' ||
                Object.keys(keys) === Object.keys(arg)) {
                return dequal.dequal(op, arg);
            }
            return inStreamSearchAdapter(op)(arg);
        };
    }
    const entries = Object.entries(op);
    const switcherFunctionsByKeys = ([key, value]) => {
        switch (key) {
            // #region Object
            case '$exists':
                return (arg) => {
                    const sw = arg !== undefined && arg !== null;
                    return value ? sw : !sw;
                };
            case '$eq':
                return (arg) => dequal.dequal(arg, value);
            case '$ne':
                return (arg) => !dequal.dequal(arg, value);
            case '$in':
                return (arg) => {
                    return value.some(val => dequal.dequal(arg, val));
                };
            case '$nin':
                return (arg) => {
                    return value.every(val => !dequal.dequal(arg, val));
                };
            // #endregion
            // #region Number
            case '$gt':
                return (arg) => arg > value;
            case '$gte':
                return (arg) => arg >= value;
            case '$lt':
                return (arg) => arg < value;
            case '$lte':
                return (arg) => arg <= value;
            case '$mod':
                return (arg) => arg % value === 0;
            // #endregion
            // #region String
            case '$cts':
                return (arg) => arg.includes(value);
            case '$sw':
                return (arg) => arg.trim().startsWith(value);
            case '$ew':
                return (arg) => arg.trim().endsWith(value);
            // #endregion
            // #region Array
            case '$all':
                return (arg) => arg.every(val => dequal.dequal(val, value));
            case '$em':
                return (arg) => arg.some(val => dequal.dequal(val, value));
            case '$size':
                return (arg) => arg.length === value;
            // #endregion
            // #region Logicals
            case '$and':
                return (arg) => {
                    const val = value;
                    const out = val.reduce((acc, curr) => {
                        const search = inStreamSearchAdapterKey(curr)(arg);
                        return acc && search;
                    }, true);
                    return out;
                };
            case '$not':
                return (arg) => {
                    const val = value;
                    const out = !inStreamSearchAdapterKey(val)(arg);
                    return out;
                };
            case '$nor':
                return (arg) => {
                    const val = value;
                    const out = val.reduce((acc, curr) => {
                        const search = inStreamSearchAdapterKey(curr)(arg);
                        return acc && !search;
                    }, true);
                    return out;
                };
            case '$or':
                return (arg) => {
                    const values = value;
                    let out = false;
                    for (const curr of values) {
                        out = inStreamSearchAdapterKey(curr)(arg);
                        if (out)
                            break;
                    }
                    return out;
                };
            // #endregion
            default:
                return () => false;
        }
    };
    const funcs = entries.map(switcherFunctionsByKeys);
    const resolver = (arg) => {
        return funcs.reduce((acc, curr) => acc && curr(arg), true);
    };
    return resolver;
}
function inStreamSearchAdapter(filter) {
    const funcs = [];
    if (functions.isNotClause(filter)) {
        const entries = Object.entries(filter.$not);
        entries.forEach(([key, value]) => {
            if (value) {
                const func = (arg) => {
                    return inStreamSearchAdapterKey(value)(arg[key]);
                };
                funcs.push(func);
            }
        });
    }
    else {
        const entries = Object.entries(filter);
        entries.forEach(([key, value]) => {
            if (value) {
                const func = (arg) => {
                    return inStreamSearchAdapterKey(value)(arg[key]);
                };
                funcs.push(func);
            }
        });
    }
    const resolver = (arg) => {
        return funcs.reduce((acc, curr) => acc && curr(arg), true);
    };
    return resolver;
}
// #endregion
function _zodDecomposeKeys(shape, addObjectKey = true) {
    const entries = Object.entries(shape).sort(([key1], [key2]) => {
        return key1.localeCompare(key2);
    });
    const out = [];
    entries.forEach(([key, value]) => {
        if (value instanceof zod.z.ZodObject) {
            const virtuals = _zodDecomposeKeys(value.shape, addObjectKey).map(val1 => {
                return `${key}.${val1}`;
            });
            if (addObjectKey)
                out.push(key);
            out.push(...virtuals);
        }
        else {
            out.push(key);
        }
    });
    return out;
}
function zodDecomposeKeys(shape, addObjectKey) {
    return _zodDecomposeKeys(shape, addObjectKey);
}
function cleanProjection(...datas) {
    const out = [];
    datas.forEach(data => {
        const checkString = data.split('.')[0];
        const check = out.includes(checkString);
        if (!check)
            out.push(data);
    });
    return out;
}
/**
 *
 * @param data the data to reduce
 * @param projection The shape that the data will take
 */
function withProjection(data, ...projection) {
    const check = !projection.length;
    if (check)
        return data;
    const decomposed = decompose.decompose(data);
    const reduced = {};
    const cleaned = cleanProjection(...projection);
    cleaned.forEach(key => {
        reduced[key] = decomposed[key];
    });
    const recomposed = decompose.recompose(reduced);
    return recomposed;
}
/**
 * Same as @link {withProjection}, but here the data is already flatten
 * @param data Data is already flatten
 * @param projection The shape that the data will take
 */
function withProjection2(data, ...projection) {
    const check = !projection.length;
    if (check)
        return data;
    const reduced = {};
    const cleaned = cleanProjection(...projection);
    cleaned.forEach(key => {
        reduced[key] = data[key];
    });
    return reduced;
}

exports.inStreamSearchAdapter = inStreamSearchAdapter;
exports.withProjection = withProjection;
exports.withProjection2 = withProjection2;
exports.zodDecomposeKeys = zodDecomposeKeys;
//# sourceMappingURL=arrayDB.functions.cjs.map
