"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inStreamSearchAdapter = exports.inStreamSearchAdapterKey = void 0;
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const functions_1 = require("../functions");
const nanoid_1 = require("nanoid");
const core_promises_1 = require("core-promises");
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
                return (0, fast_deep_equal_1.default)(op, arg);
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
                return (arg) => (0, fast_deep_equal_1.default)(arg, value);
            case '$ne':
                return (arg) => !(0, fast_deep_equal_1.default)(arg, value);
            case '$in':
                return (arg) => {
                    return value.some(val => (0, fast_deep_equal_1.default)(arg, val));
                };
            case '$nin':
                return (arg) => {
                    return value.every(val => !(0, fast_deep_equal_1.default)(arg, val));
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
                return (arg) => arg.every(val => (0, fast_deep_equal_1.default)(val, value));
            case '$em':
                return (arg) => arg.some(val => (0, fast_deep_equal_1.default)(val, value));
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
exports.inStreamSearchAdapterKey = inStreamSearchAdapterKey;
function inStreamSearchAdapter(filter) {
    const funcs = [];
    if ((0, functions_1.isNotClause)(filter)) {
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
exports.inStreamSearchAdapter = inStreamSearchAdapter;
class ArrayCRUD_DB {
    /* , Permission<T> */
    constructor(_db, permissions) {
        this._db = _db;
        this.permissions = permissions;
        // readonly permissionReaderMany: PermissionsReaderMany<T> = dso => {
        //   const datas = this._db.filter(inStreamSearchAdapter(dso));
        //   const out = datas.map(getPermissions);
        //   return out;
        // };
        // readonly permissionReaderOne: PermissionsReaderOne<T> = dso =>
        //   this.permissionReaderMany(dso)[0];
        this.createMany = async ({ data: datas, options }) => {
            const inputs = datas.map(data => ({
                _id: (0, nanoid_1.nanoid)(),
                ...data,
            }));
            if (options && options.limit && options.limit < datas.length) {
                const limit = options.limit;
                const _inputs = inputs.slice(0, limit);
                this._db.push(..._inputs);
                const payload = _inputs.map(input => input._id);
                const message = 'Limit exceeded';
                const rd = new core_promises_1.ReturnData({ status: 110, payload, message });
                return rd;
            }
            this._db.push(...inputs);
            const payload = inputs.map(input => input._id);
            const rd = new core_promises_1.ReturnData({ status: 210, payload });
            return rd;
        };
        this.createOne = async ({ data }) => {
            const input = {
                _id: (0, nanoid_1.nanoid)(),
                ...data,
            };
            this._db.push(input);
            const payload = input._id;
            const rd = new core_promises_1.ReturnData({ status: 211, payload });
            return rd;
        };
        this.upsertOne = async ({ _id, data }) => {
            const _filter = inStreamSearchAdapter({ _id, ...data });
            const _exist = this._db.find(_filter);
            if (_exist) {
                const message = 'Already exists';
                return new core_promises_1.ReturnData({ status: 312, payload: _id, message });
            }
            else {
                this._db.push({ _id: _id !== null && _id !== void 0 ? _id : (0, nanoid_1.nanoid)(), ...data });
                return new core_promises_1.ReturnData({ status: 212, payload: _id });
            }
        };
        this.upsertMany = async ({ upserts, options }) => {
            const inputs = upserts.map(({ _id, data }) => ({
                _id: _id !== null && _id !== void 0 ? _id : (0, nanoid_1.nanoid)(),
                ...data,
            }));
            const alreadyExists = [];
            if (options && options.limit && options.limit < upserts.length) {
                const limit = options.limit;
                const _inputs = inputs.slice(0, limit).map(input => {
                    var _a;
                    const _filter = inStreamSearchAdapter(input);
                    const _exist = (_a = this._db.find(_filter)) === null || _a === void 0 ? void 0 : _a._id;
                    if (_exist) {
                        alreadyExists.push(_exist);
                    }
                    else {
                        this._db.push(input);
                    }
                    return input;
                });
                if (alreadyExists.length > 0) {
                    return new core_promises_1.ReturnData({
                        status: 313,
                        payload: _inputs.map(input => input._id),
                        message: `${alreadyExists} already exist`,
                    });
                }
                else {
                    return new core_promises_1.ReturnData({
                        status: 113,
                        payload: _inputs.map(input => input._id),
                    });
                }
            }
            const _inputs = inputs.map(input => {
                var _a;
                const _filter = inStreamSearchAdapter(input);
                const _exist = (_a = this._db.find(_filter)) === null || _a === void 0 ? void 0 : _a._id;
                if (_exist) {
                    alreadyExists.push(_exist);
                }
                else {
                    this._db.push(input);
                }
                return input;
            });
            if (alreadyExists.length > 0) {
                return new core_promises_1.ReturnData({
                    status: 313,
                    payload: _inputs.map(input => input._id),
                    message: `${alreadyExists} already exist`,
                });
            }
            else {
                return new core_promises_1.ReturnData({
                    status: 213,
                    payload: _inputs.map(input => input._id),
                });
            }
        };
        this.readAll = async (options) => {
            const out = this._db.slice(0, options === null || options === void 0 ? void 0 : options.limit);
            if (!out.length) {
                return new core_promises_1.ReturnData({
                    status: 514,
                    message: 'Empty',
                });
            }
            return new core_promises_1.ReturnData({
                status: 214,
                payload: this._db.slice(0, options === null || options === void 0 ? void 0 : options.limit),
            });
        };
        this.readMany = async ({ filters, options }) => {
            const reads = this._db.filter(inStreamSearchAdapter(filters));
            if (!reads.length) {
                return new core_promises_1.ReturnData({
                    status: 515,
                    message: 'Empty',
                });
            }
            if (options && options.limit && options.limit < reads.length) {
                const out = reads.slice(0, options === null || options === void 0 ? void 0 : options.limit);
                if (!out.length) {
                    return new core_promises_1.ReturnData({
                        status: 515,
                        message: 'Empty',
                    });
                }
                return new core_promises_1.ReturnData({
                    status: 115,
                    payload: out,
                    message: 'Limit exceeded',
                });
            }
            return new core_promises_1.ReturnData({
                status: 215,
                payload: reads,
            });
        };
        this.readManyByIds = async ({ ids, filters, options }) => {
            const reads1 = this._db.filter(data => ids.includes(data._id));
            if (!reads1.length) {
                return new core_promises_1.ReturnData({
                    status: 516,
                    message: 'Empty',
                });
            }
            if (!filters) {
                if (options && options.limit && options.limit < reads1.length) {
                    const out = reads1.slice(0, options === null || options === void 0 ? void 0 : options.limit);
                    if (!out.length) {
                        return new core_promises_1.ReturnData({
                            status: 516,
                            message: 'Empty',
                        });
                    }
                    return new core_promises_1.ReturnData({
                        status: 116,
                        payload: out,
                        message: 'Limit exceeded',
                    });
                }
                else {
                    return new core_promises_1.ReturnData({
                        status: 216,
                        payload: reads1,
                    });
                }
            }
            const reads2 = reads1.filter(inStreamSearchAdapter(filters));
            if (!reads2.length) {
                return new core_promises_1.ReturnData({
                    status: 516,
                    message: 'Empty',
                });
            }
            if (options && options.limit && options.limit < reads2.length) {
                return new core_promises_1.ReturnData({
                    status: 316,
                    payload: reads2.slice(0, options === null || options === void 0 ? void 0 : options.limit),
                    message: 'Limit exceeded',
                });
            }
            return new core_promises_1.ReturnData({
                status: 216,
                payload: reads1,
            });
        };
        this.readOne = async ({ filters }) => {
            const payload = this._db.find(inStreamSearchAdapter(filters));
            if (payload) {
                return new core_promises_1.ReturnData({ status: 217, payload });
            }
            return new core_promises_1.ReturnData({ status: 517, message: 'NotFound' });
        };
        this.readOneById = async ({ _id, filters }) => {
            const exits1 = this._db.find(data => data._id === _id);
            if (!filters) {
                if (!exits1) {
                    return new core_promises_1.ReturnData({ status: 518, message: 'Not Found' });
                }
                else
                    return new core_promises_1.ReturnData({ status: 218, payload: exits1 });
            }
            const exists2 = this._db
                .filter(data => data._id === _id)
                .find(inStreamSearchAdapter(filters));
            if (!exists2) {
                return new core_promises_1.ReturnData({ status: 518, message: 'Not found ' });
            }
            return new core_promises_1.ReturnData({ status: 218, payload: exists2 });
        };
        this.countAll = async () => {
            const out = this._db.length;
            if (out <= 0) {
                return new core_promises_1.ReturnData({ status: 519, message: 'Empty' });
            }
            return new core_promises_1.ReturnData({ status: 219, payload: this._db.length });
        };
        this.count = async ({ filters, options }) => {
            const payload = this._db.filter(inStreamSearchAdapter(filters)).length;
            if (payload <= 0) {
                return new core_promises_1.ReturnData({ status: 520, message: 'Empty' });
            }
            const limit = options === null || options === void 0 ? void 0 : options.limit;
            if (limit && limit < payload) {
                return new core_promises_1.ReturnData({
                    status: 120,
                    payload: limit,
                    message: 'Limit exceeded',
                });
            }
            return new core_promises_1.ReturnData({ status: 220, payload });
        };
    }
}
exports.default = ArrayCRUD_DB;
