"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCRUD_DB = exports.inStreamSearchAdapter = exports.inStreamSearchAdapterKey = void 0;
const core_promises_1 = require("core-promises");
const lite_1 = require("dequal/lite");
const nanoid_1 = require("nanoid");
const immer_1 = require("immer");
const functions_1 = require("../functions");
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
                return (0, lite_1.dequal)(op, arg);
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
                return (arg) => (0, lite_1.dequal)(arg, value);
            case '$ne':
                return (arg) => !(0, lite_1.dequal)(arg, value);
            case '$in':
                return (arg) => {
                    return value.some(val => (0, lite_1.dequal)(arg, val));
                };
            case '$nin':
                return (arg) => {
                    return value.every(val => !(0, lite_1.dequal)(arg, val));
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
                return (arg) => arg.every(val => (0, lite_1.dequal)(val, value));
            case '$em':
                return (arg) => arg.some(val => (0, lite_1.dequal)(val, value));
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
// type Permission<T extends Entity> = {
//   permissionReader: PermissionsReaderOne<T>;
// };
class ArrayCRUD_DB {
    /* , Permission<T> */
    constructor(_db, permissions) {
        this._db = _db;
        this.permissions = permissions;
        this.__update = (payload, update) => {
            const __db = (0, immer_1.produce)([...this._db], draft => {
                payload.forEach(id => {
                    const index = draft.findIndex((data) => data._id === id);
                    if (index !== -1) {
                        draft[index].login = update.login;
                    }
                });
            });
            this.rinitDB();
            this._db.push(...__db);
            this._db; //?
        };
        // readonly permissionReaderMany: PermissionsReaderMany<T> = dso => {
        //   const datas = this._db.filter(inStreamSearchAdapter(dso));
        //   const out = datas.map(getPermissions);
        //   return out;
        // };
        // readonly permissionReaderOne: PermissionsReaderOne<T> = dso =>
        //   this.permissionReaderMany(dso)[0];
        // #region Create
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
                const messages = ['Limit exceeded'];
                const rd = new core_promises_1.ReturnData({ status: 110, payload, messages });
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
                const messages = ['Already exists'];
                return new core_promises_1.ReturnData({ status: 312, payload: _id, messages });
            }
            else {
                this._db.push({ _id: _id !== null && _id !== void 0 ? _id : (0, nanoid_1.nanoid)(), ...data });
                return new core_promises_1.ReturnData({ status: 212, payload: _id });
            }
        };
        this.upsertMany = async ({ upserts, options }) => {
            const inputs = upserts.map(({ _id, data }) => ({
                _id,
                ...data,
            }));
            const alreadyExists = [];
            if (options && options.limit && options.limit < upserts.length) {
                const limit = options.limit;
                const _inputs = inputs.slice(0, limit).map(input => {
                    var _a, _b;
                    const _filter = inStreamSearchAdapter(input);
                    const _exist = (_a = this._db.find(_filter)) === null || _a === void 0 ? void 0 : _a._id;
                    if (_exist) {
                        alreadyExists.push(_exist);
                    }
                    else {
                        this._db.push({ ...input, _id: (_b = input._id) !== null && _b !== void 0 ? _b : (0, nanoid_1.nanoid)() });
                    }
                    return input;
                });
                if (alreadyExists.length > 0) {
                    return new core_promises_1.ReturnData({
                        status: 313,
                        payload: _inputs.map(input => input._id),
                        messages: [`${alreadyExists.length} already exist`],
                    });
                }
                else {
                    return new core_promises_1.ReturnData({
                        status: 113,
                        payload: _inputs.map(input => input._id),
                    });
                }
            }
            inputs.forEach(input => {
                var _a, _b;
                const _filter = inStreamSearchAdapter(input);
                const _exist = (_a = this._db.find(_filter)) === null || _a === void 0 ? void 0 : _a._id;
                if (_exist) {
                    alreadyExists.push(_exist);
                }
                else {
                    this._db.push({ ...input, _id: (_b = input._id) !== null && _b !== void 0 ? _b : (0, nanoid_1.nanoid)() });
                }
                return input;
            });
            if (alreadyExists.length > 0) {
                return new core_promises_1.ReturnData({
                    status: 313,
                    payload: inputs.map(input => input._id),
                    messages: [`${alreadyExists.length} already exist`],
                });
            }
            else {
                return new core_promises_1.ReturnData({
                    status: 213,
                    payload: inputs.map(input => input._id),
                });
            }
        };
        // #endregion
        // #region Read
        this.readAll = async (options) => {
            if (options && options.limit && options.limit < this._db.length) {
                return new core_promises_1.ReturnData({
                    status: 314,
                    payload: this._db.slice(0, options.limit),
                    messages: ['Limit Reached'],
                });
            }
            if (!this._db.length) {
                return new core_promises_1.ReturnData({
                    status: 514,
                    messages: ['Empty'],
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
                    messages: ['Empty'],
                });
            }
            if (options && options.limit && options.limit < reads.length) {
                return new core_promises_1.ReturnData({
                    status: 115,
                    payload: reads.slice(0, options.limit),
                    messages: ['Limit Reached'],
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
                    messages: ['Empty'],
                });
            }
            if (!filters) {
                if (options && options.limit && options.limit < reads1.length) {
                    return new core_promises_1.ReturnData({
                        status: 116,
                        payload: reads1.slice(0, options.limit),
                        messages: ['Limit Reached'],
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
                    messages: ['Filters kill data'],
                });
            }
            if (options && options.limit && options.limit < reads2.length) {
                return new core_promises_1.ReturnData({
                    status: 116,
                    payload: reads2.slice(0, options.limit),
                    messages: ['Limit Reached'],
                });
            }
            if (reads2.length < reads1.length) {
                return new core_promises_1.ReturnData({
                    status: 316,
                    payload: reads2,
                    messages: ['Filters slice datas'],
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
            return new core_promises_1.ReturnData({ status: 517, messages: ['NotFound'] });
        };
        this.readOneById = async ({ _id, filters }) => {
            const exits1 = this._db.find(data => data._id === _id);
            if (!filters) {
                if (!exits1) {
                    return new core_promises_1.ReturnData({ status: 518, messages: ['NotFound'] });
                }
                else
                    return new core_promises_1.ReturnData({ status: 218, payload: exits1 });
            }
            const exists2 = this._db
                .filter(data => data._id === _id)
                .find(inStreamSearchAdapter(filters));
            if (!exists2) {
                return new core_promises_1.ReturnData({
                    status: 518,
                    messages: exits1 ? ['Not found'] : ['Filters kill data'],
                });
            }
            return new core_promises_1.ReturnData({ status: 218, payload: exists2 });
        };
        this.countAll = async () => {
            const out = this._db.length;
            if (out <= 0) {
                return new core_promises_1.ReturnData({ status: 519, messages: ['Empty'] });
            }
            return new core_promises_1.ReturnData({ status: 219, payload: this._db.length });
        };
        this.count = async ({ filters, options }) => {
            const payload = this._db.filter(inStreamSearchAdapter(filters)).length;
            if (payload <= 0) {
                return new core_promises_1.ReturnData({ status: 520, messages: ['Empty'] });
            }
            const limit = options === null || options === void 0 ? void 0 : options.limit;
            if (limit && limit < payload) {
                return new core_promises_1.ReturnData({
                    status: 120,
                    payload: limit,
                    messages: ['Limit Reached'],
                });
            }
            return new core_promises_1.ReturnData({ status: 220, payload });
        };
        // #endregion
        this.updateAll = async ({ data, options }) => {
            const db = [...this._db];
            if (!db.length) {
                return new core_promises_1.ReturnData({ status: 521, messages: ['Empty'] });
            }
            const limit = options === null || options === void 0 ? void 0 : options.limit;
            const inputs = db
                .slice(0, limit)
                .map(_data => ({ ..._data, ...data }));
            if (limit && limit < db.length) {
                this._db.length = 0;
                this._db.push(...inputs);
                return new core_promises_1.ReturnData({
                    status: 121,
                    payload: inputs.map(input => input._id),
                    messages: ['Limit Reached'],
                });
            }
            return new core_promises_1.ReturnData({
                status: 221,
                payload: inputs.map(input => input._id),
            });
        };
        this.updateMany = async ({ filters, data, options }) => {
            const db = [...this._db];
            if (!db.length) {
                return new core_promises_1.ReturnData({ status: 522, messages: ['Empty'] });
            }
            const _filter = inStreamSearchAdapter(filters);
            const limit = options === null || options === void 0 ? void 0 : options.limit;
            const inputs = db.filter(_filter);
            const payload = inputs.slice(0, limit).map(input => input._id);
            if (!inputs.length) {
                return new core_promises_1.ReturnData({
                    status: 522,
                    messages: ['Filters kill data'],
                });
            }
            if (limit && limit < inputs.length) {
                this.__update(payload /*?*/, data);
                return new core_promises_1.ReturnData({
                    status: 122,
                    payload,
                    messages: ['Limit Reached'],
                });
            }
            return new core_promises_1.ReturnData({
                status: 222,
                payload,
            });
        };
        this.updateManyByIds = async ({ ids, filters, data, options, }) => {
            const db = [...this._db];
            if (!db.length) {
                return new core_promises_1.ReturnData({ status: 523, messages: ['Empty'] });
            }
            const limit = options === null || options === void 0 ? void 0 : options.limit;
            // const mapper = (_data: WI<T>) => ({ ..._data, ...data });
            const inputs1 = db.filter(data => ids.includes(data._id));
            if (!inputs1.length) {
                return new core_promises_1.ReturnData({
                    status: 523,
                    messages: ['ids cannot reach DB'],
                });
            }
            if (!filters) {
                const payload = inputs1.slice(0, limit).map(input => input._id);
                this.__update(payload, data);
                this._db; //?
                if (limit && limit < inputs1.length) {
                    return new core_promises_1.ReturnData({
                        status: 123,
                        payload,
                        messages: ['Limit Reached'],
                    });
                }
                return new core_promises_1.ReturnData({
                    status: 223,
                    payload,
                });
            }
            const _filter = inStreamSearchAdapter(filters);
            const inputs2 = inputs1.filter(_filter);
            inputs2.length; //?
            const payload = inputs2.slice(0, limit).map(input => input._id);
            this.__update(payload, data);
            if (!inputs2.length) {
                return new core_promises_1.ReturnData({
                    status: 523,
                    messages: ['Filters kill data'],
                });
            }
            if (limit && limit < inputs2.length) {
                return new core_promises_1.ReturnData({
                    status: 123,
                    payload,
                    messages: ['Limit Reached'],
                });
            }
            if (inputs2.length < inputs1.length) {
                return new core_promises_1.ReturnData({
                    status: 323,
                    payload,
                    messages: ['Filters slice datas'],
                });
            }
            return new core_promises_1.ReturnData({
                status: 223,
                payload,
            });
        };
        this.updateOne = async () => {
            throw undefined;
        };
        this.updateOneById = async () => {
            throw undefined;
        };
        this.setAll = async () => {
            throw undefined;
        };
        this.setMany = async () => {
            throw undefined;
        };
        this.setManyByIds = async () => {
            throw undefined;
        };
        this.setOne = async () => {
            throw undefined;
        };
        this.setOneById = async () => {
            throw undefined;
        };
        this.deleteAll = async () => {
            throw undefined;
        };
        this.deleteMany = async () => {
            throw undefined;
        };
        this.deleteManyByIds = async () => {
            throw undefined;
        };
        this.deleteOne = async () => {
            throw undefined;
        };
        this.deleteOneById = async () => {
            throw undefined;
        };
        this.retrieveAll = async () => {
            throw undefined;
        };
        this.retrieveMany = async () => {
            throw undefined;
        };
        this.retrieveManyByIds = async () => {
            throw undefined;
        };
        this.retrieveOne = async () => {
            throw undefined;
        };
        this.retrieveOneById = async () => {
            throw undefined;
        };
        this.removeAll = async () => {
            throw undefined;
        };
        this.removeMany = async () => {
            throw undefined;
        };
        this.removeManyByIds = async () => {
            throw undefined;
        };
        this.removeOne = async () => {
            throw undefined;
        };
        this.removeOneById = async () => {
            throw undefined;
        };
    }
    rinitDB() {
        this._db.length = 0;
    }
    get length() {
        return this._db.length;
    }
}
exports.ArrayCRUD_DB = ArrayCRUD_DB;
