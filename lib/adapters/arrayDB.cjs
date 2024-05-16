'use strict';

var decompose = require('@bemedev/decompose');
var returnData = require('@bemedev/return-data');
var immer = require('immer');
var nanoid = require('nanoid');
var tsDeepmerge = require('ts-deepmerge');
require('../schemas/index.cjs');
var adapters_arrayDB_functions = require('./arrayDB.functions.cjs');
var schemas_objects = require('../schemas/objects.cjs');

/* eslint-disable @typescript-eslint/no-unused-vars */
const TEST_SUPER_ADMIN_ID = 'super-admin';
class CollectionDB {
    // #region Properties
    _collection;
    _colPermissions;
    _schema;
    _actors = [];
    _permissions;
    checkPermissions;
    test;
    // #endregion
    /**
     * Only in test mode
     */
    get collection() {
        if (this.test) {
            return this._collection;
        }
        return [];
    }
    /**
     * Only in test mode
     */
    get colPermissions() {
        if (this.test) {
            return this._colPermissions;
        }
        return [];
    }
    __update = (update, ...payload) => {
        const __db = immer.produce(this._collection, draft => {
            payload.forEach(id => {
                const index = draft.findIndex((data) => data._id === id);
                if (index !== -1) {
                    draft[index] = immer.castDraft(tsDeepmerge.merge(draft[index], update));
                }
            });
        });
        this._rinitDB();
        this._collection.push(...__db);
    };
    __seed = async (...arr) => {
        if (this.test) {
            const out = arr.map(({ _id, ...data }) => {
                return this.generateCreate(TEST_SUPER_ADMIN_ID, data, _id);
            });
            return out;
        }
        return [];
    };
    constructor({ _schema, _actors, permissions, checkPermissions, test = true, }) {
        // #region Constructore Variables
        this._schema = _schema;
        if (_actors)
            this._actors.push(..._actors);
        this._permissions = permissions;
        this.checkPermissions = !!checkPermissions;
        this.test = !!test;
        // #endregion
        this._collection = [];
        this._colPermissions = [];
    }
    get canCheckPermissions() {
        return (this.checkPermissions &&
            !!this._permissions &&
            this._actors.length > 0);
    }
    _getActor = (ID) => {
        return this._actors.find(({ actorID }) => ID === actorID);
    };
    canCreate = (actorID) => {
        if (this.canCheckPermissions) {
            const actor = this._getActor(actorID);
            if (!actor)
                return false;
            const superAdmin = actor.superAdmin === true;
            if (superAdmin)
                return true;
            const permissions = actor.permissions;
            if (!permissions)
                return false;
            if (!this._permissions)
                return false;
            return permissions.includes(this._permissions.__create);
        }
        return true;
    };
    canDeleteDoc = (actorID) => {
        if (this.canCheckPermissions) {
            const actor = this._getActor(actorID);
            if (!actor)
                return false;
            const superAdmin = actor.superAdmin === true;
            if (superAdmin)
                return true;
            const permissions = actor.permissions;
            if (!permissions)
                return false;
            if (!this._permissions)
                return false;
            return permissions.includes(this._permissions.__remove);
        }
        return true;
    };
    static generateServerError = (status, ...messages) => {
        return new returnData.ReturnData({ status, messages });
    };
    get schema() {
        return this._schema;
    }
    _rinitDB() {
        this._collection.length = 0;
        this._colPermissions.length = 0;
    }
    get length() {
        return this._collection.length;
    }
    static mapperWithoutTimestamps() {
        const mapper = ({ _created, _deleted, _updated, ...data }) => data;
        return mapper;
    }
    _withoutTimestamps = (filters, ...ids) => {
        const collection = this._withoutTimestampsByIds(...ids);
        if (!filters) {
            return collection;
        }
        const _filters = adapters_arrayDB_functions.inStreamSearchAdapter(filters);
        const out = collection.filter(_filters);
        return out;
    };
    _withoutTimestampsByIds = (...ids) => {
        const mapper = CollectionDB.mapperWithoutTimestamps();
        const check = !ids.length;
        if (!check) {
            return this._collection.map(mapper);
        }
        const _filters = ({ _id }) => {
            ids.includes(_id);
        };
        const out = this._collection.filter(_filters).map(mapper);
        return out;
    };
    _withoutTimestampsPermissions = (...ids) => {
        const rawPermissions = [];
        // #region Populate constant "rawPermissions"
        for (const { _id } of ids) {
            const permission = this._colPermissions.find(permission => permission._id === _id);
            const { _created, _deleted, _updated, ...data } = permission;
            rawPermissions.push(data);
        }
        return rawPermissions;
    };
    // #region Create
    // #region Static
    static generateCreateTimestamps = (actorID) => ({
        _created: {
            by: actorID,
            at: new Date(),
        },
        _updated: {
            by: actorID,
            at: new Date(),
        },
        _deleted: false,
    });
    static buildCreate(actorID, data, _id = nanoid.nanoid()) {
        const timestamps = this.generateCreateTimestamps(actorID);
        const input = {
            _id,
            ...timestamps,
            ...data,
        };
        return input;
    }
    static generateDefaultPermissions = () => {
        const out = {
            __read: [],
            __update: [],
            __remove: [],
        };
        return out;
    };
    static get timestampsPermissionsCreator() {
        const keys = Object.keys(schemas_objects.timestampsSchema.shape);
        const entries = keys.map(key => {
            const permissions = CollectionDB.generateDefaultPermissions();
            return [key, permissions];
        });
        const out = Object.fromEntries(entries);
        return out;
    }
    // #endregion
    // #region Private
    generatePermissionCreate = (_id) => {
        const keys = adapters_arrayDB_functions.zodDecomposeKeys(this._schema.shape, false);
        const entries = keys.map(key => {
            const permissions = CollectionDB.generateDefaultPermissions();
            return [key, permissions];
        });
        const _out1 = Object.fromEntries(entries);
        const out1 = decompose.recompose(_out1);
        const permissions = CollectionDB.timestampsPermissionsCreator;
        const out2 = {
            ...out1,
            ...permissions,
            _id,
        };
        return out2;
    };
    pushPermission = (permission) => {
        return this._colPermissions.push(permission);
    };
    pushData = (data) => {
        return this._collection.push(data);
    };
    _createPermission = (...ids) => {
        const permissions = [];
        ids.forEach(id => {
            const input = this.generatePermissionCreate(id);
            this.pushPermission(input);
            permissions.push(input);
        });
        return permissions;
    };
    _createData = (actorID, data, _id = nanoid.nanoid()) => {
        const input = CollectionDB.buildCreate(actorID, data, _id);
        this.pushData(input);
        return input;
    };
    generateCreate = (actorID, data, _id = nanoid.nanoid()) => {
        const input = this._createData(actorID, data, _id);
        this._createPermission(input._id);
        return input;
    };
    // #endregion
    // #region Creation
    createMany = async ({ actorID, data: _datas, options, }) => {
        // #region Check actor's permissions
        const canCreate = this.canCreate(actorID);
        if (!canCreate) {
            return CollectionDB.generateServerError(510, 'This actor cannot create elements');
        }
        // #endregion
        const inputs = _datas.map(data => CollectionDB.buildCreate(actorID, data));
        if (options && options.limit && options.limit < _datas.length) {
            const limit = options.limit;
            // #region Pushs
            const _inputs = inputs.slice(0, limit);
            this._collection.push(..._inputs);
            const ids = _inputs.map(({ _id }) => _id);
            this._createPermission(...ids);
            // #endregion
            const payload = _inputs.map(input => input._id);
            const messages = ['Limit exceeded'];
            const rd = new returnData.ReturnData({ status: 110, payload, messages });
            return rd;
        }
        // #region Pushs
        this._collection.push(...inputs);
        const ids = inputs.map(({ _id }) => _id);
        this._createPermission(...ids);
        // #endregion
        const payload = inputs.map(input => input._id);
        const rd = new returnData.ReturnData({ status: 210, payload });
        return rd;
    };
    createOne = async ({ data, actorID }) => {
        // #region Check actor's permissions
        const canCreate = this.canCreate(actorID);
        if (!canCreate) {
            return CollectionDB.generateServerError(511, 'This actor cannot create elements');
        }
        // #endregion
        const input = this.generateCreate(actorID, data);
        const payload = input._id;
        const rd = new returnData.ReturnData({ status: 211, payload });
        return rd;
    };
    upsertOne = async ({ actorID, id: _id, data }) => {
        // #region Check actor's permissions
        const canCreate = this.canCreate(actorID);
        if (!canCreate) {
            return CollectionDB.generateServerError(512, 'This actor cannot create elements');
        }
        // #endregion
        const _filter = (data) => _id === data._id;
        const _exist = this._collection.find(_filter);
        if (_exist) {
            const messages = ['Already exists'];
            return new returnData.ReturnData({ status: 312, payload: _id, messages });
        }
        else {
            this.generateCreate(actorID, data, _id);
            return new returnData.ReturnData({ status: 212, payload: _id });
        }
    };
    upsertMany = async ({ actorID, upserts, options }) => {
        const canCreate = this.canCreate(actorID);
        if (!canCreate) {
            return CollectionDB.generateServerError(513, 'This actor cannot create elements');
        }
        const inputs = upserts.map(({ _id, data }) => ({
            _id: _id ?? nanoid.nanoid(),
            ...data,
        }));
        let alreadyExists = 0;
        const checkLimit = options && options.limit && options.limit > upserts.length;
        if (checkLimit) {
            const limit = options.limit;
            const _inputs = inputs.slice(0, limit).map(({ _id, ...data }) => {
                const _filter = (data) => _id === data._id;
                const _exist = this._collection.find(_filter)?._id;
                if (_exist)
                    alreadyExists++;
                else {
                    // #region Pushs
                    const _input = CollectionDB.buildCreate(actorID, data, _id);
                    this._collection.push(_input);
                    this._createPermission(_input._id);
                    // #endregion
                }
                return { _id, ...data };
            });
            if (alreadyExists > 0) {
                const check = alreadyExists === upserts.length;
                if (check) {
                    return CollectionDB.generateServerError(513, 'All data exists');
                }
                return new returnData.ReturnData({
                    status: 313,
                    payload: _inputs.map(input => input._id),
                    messages: [`${alreadyExists} already exist`],
                });
            }
            else {
                return new returnData.ReturnData({
                    status: 113,
                    payload: _inputs.map(input => input._id),
                    messages: ['Limit is reached'],
                });
            }
        }
        inputs.forEach(({ _id, ...data }) => {
            const _filter = (data) => _id === data._id;
            const _exist = this._collection.find(_filter)?._id;
            if (_exist)
                alreadyExists++;
            else {
                // #region Pushs
                const _input = CollectionDB.buildCreate(actorID, data, _id);
                this._collection.push(_input);
                this._createPermission(_input._id);
                // #endregion
            }
            return { _id, ...data };
        });
        if (alreadyExists > 0) {
            return new returnData.ReturnData({
                status: 313,
                payload: inputs.map(input => input._id),
                messages: [`${alreadyExists} already exist`],
            });
        }
        else {
            return new returnData.ReturnData({
                status: 213,
                payload: inputs.map(input => input._id),
            });
        }
    };
    // #endregion
    // #endregion
    // #region Read
    // #region Private
    _canRead = (actorID) => {
        if (!this.checkPermissions)
            return true;
        const actor = this._getActor(actorID);
        if (!actor)
            return false;
        const isSuperAdmin = actor.superAdmin;
        if (isSuperAdmin)
            return true;
        return actor;
        // const { permissions, reads } = this.getDataAndPermissions(filters);
    };
    reduceByPermissions = ({ actor, filters, ids, options, key: permissionKey = '__read', }) => {
        const args = ids ? [filters, ...ids] : [filters];
        const rawReads = this._withoutTimestamps(...args);
        const isLimited = !!options?.limit && options.limit > rawReads.length;
        const slicedReads = rawReads.slice(0, options?.limit);
        const projection = (options?.projection ?? []);
        /**
         * Check if some records are resticted by permissions
         */
        let isRestricted = false;
        /**
         * Grant all permissions for superAdmin
         */
        if (actor === true) {
            const rawReadsWithProjection = slicedReads.map(data => {
                return adapters_arrayDB_functions.withProjection(data, ...projection);
            });
            return { payload: rawReadsWithProjection, isRestricted, isLimited };
        }
        if (slicedReads.length === 0) {
            const rawReadsWithProjection = slicedReads.map(data => {
                return adapters_arrayDB_functions.withProjection(data, ...projection);
            });
            return { payload: rawReadsWithProjection, isRestricted, isLimited };
        }
        const actorPermissions = actor.permissions;
        const rawPermissions = this._withoutTimestampsPermissions(...slicedReads);
        /**
         * Decompose the raw Reads for better permission checking
         */
        const flattenReads = slicedReads.map(decompose.decompose);
        /**
         * Filter keys with projection
         */
        const flattenReadsWithProjection = flattenReads.map(data => {
            return adapters_arrayDB_functions.withProjection2(data, ...projection);
        });
        /**
         * Decompose the raw Permission for better permission checking
         */
        const flattenPermissions = rawPermissions.map(decompose.decompose);
        const payload = [];
        flattenPermissions.forEach(({ _id, ...perm }, index) => {
            const permissionsEntries = Object.entries(perm);
            // #region Check if the data has no permissions restrictions
            const permissionsValues = permissionsEntries.map(([, value]) => value);
            const check1 = permissionsValues.every((val) => val.length === 0);
            if (check1) {
                const payload1 = flattenReadsWithProjection[index];
                payload.push(payload1);
            }
            // #endregion
            else {
                const restrictedKeys = [];
                // #region Check if actor has all required permissions
                permissionsEntries.forEach(([key1, value1]) => {
                    const __read = value1[permissionKey];
                    const check11 = __read.every(_read => actorPermissions.includes(_read));
                    if (!check11) {
                        restrictedKeys.push(key1);
                        if (isRestricted === false)
                            isRestricted = true;
                    }
                });
                const check2 = restrictedKeys.length === 0;
                if (check2) {
                    payload.push(rawReads[index]);
                }
                // #endregion
                else {
                    const entriesData = Object.entries(flattenReadsWithProjection[index]);
                    // #region Update the read without the restricted keys
                    const newRead = entriesData.filter(([key]) => !restrictedKeys.includes(key));
                    const updatedRead = decompose.recompose(Object.fromEntries(newRead));
                    payload.push({
                        _id,
                        ...updatedRead,
                    });
                    // #endregion
                }
            }
        });
        return { payload, isRestricted, isLimited };
    };
    _canReadExtended = (reads) => {
        return reads.some(read => {
            const keys = Object.keys(read);
            const len = keys.length;
            return len > 1;
        });
    };
    // #endregion
    readAll = async (actorID, options) => {
        const actor = this._canRead(actorID);
        if (actor !== true) {
            const out = new returnData.ReturnData({
                status: 620,
                messages: ['Only SuperAdmin can read all data'],
            });
            return out;
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(520, 'Empty');
        }
        const rawReads = this._withoutTimestamps();
        const check = !!options && options.limit && options.limit > rawReads.length;
        if (check) {
            return new returnData.ReturnData({
                status: 320,
                payload: rawReads.slice(0, options.limit),
                messages: ['Limit exceed data available'],
            });
        }
        return new returnData.ReturnData({
            status: 220,
            payload: rawReads.slice(0, options?.limit),
        });
    };
    readMany = async ({ actorID, filters, options }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 621,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(521, 'Empty');
        }
        const { payload, isRestricted, isLimited } = this.reduceByPermissions({
            actor,
            filters,
            options,
        });
        if (!payload.length) {
            return new returnData.ReturnData({
                status: 321,
                messages: ['Empty'],
            });
        }
        const canRead = this._canReadExtended(payload);
        if (!canRead) {
            return new returnData.ReturnData({
                status: 621,
                notPermitteds: ['ALL'],
                messages: [`Actor ${actorID} cannot read the data`],
                payload,
            });
        }
        if (isRestricted) {
            return new returnData.ReturnData({
                status: 321,
                payload,
                messages: ['Some data keys are restricted'],
            });
        }
        if (isLimited) {
            return new returnData.ReturnData({
                status: 121,
                payload,
                messages: ['Limit Reached'],
            });
        }
        return new returnData.ReturnData({
            status: 221,
            payload,
        });
    };
    readManyByIds = async ({ actorID, ids, filters, options, }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 622,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            CollectionDB.generateServerError(522, 'Empty');
        }
        const { payload, isRestricted, isLimited } = this.reduceByPermissions({
            actor,
            filters,
            ids,
            options,
        });
        if (!payload.length) {
            return new returnData.ReturnData({
                status: 322,
                messages: ['Empty'],
            });
        }
        const canRead = this._canReadExtended(payload);
        if (!canRead) {
            return new returnData.ReturnData({
                status: 622,
                notPermitteds: ['ALL'],
                messages: [`Actor ${actorID} cannot read the data`],
                payload,
            });
        }
        if (isRestricted) {
            return new returnData.ReturnData({
                status: 322,
                payload,
                messages: ['Some data keys are restricted'],
            });
        }
        if (isLimited) {
            return new returnData.ReturnData({
                status: 122,
                payload,
                messages: ['Limit Reached'],
            });
        }
        return new returnData.ReturnData({
            status: 222,
            payload,
        });
    };
    readOne = async ({ actorID, filters, options }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 623,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(523, 'Empty');
        }
        const { payload: payloads, isRestricted } = this.reduceByPermissions({
            actor,
            filters,
            options,
        });
        const payload = payloads[0];
        if (!payload) {
            return CollectionDB.generateServerError(523, 'Not Found');
        }
        const canRead = this._canReadExtended(payloads);
        if (!canRead) {
            return new returnData.ReturnData({
                status: 623,
                notPermitteds: ['ALL'],
                messages: [`Actor ${actorID} cannot read the data`],
                payload,
            });
        }
        if (isRestricted) {
            return new returnData.ReturnData({
                status: 323,
                payload,
                messages: ['Some data keys are restricted'],
            });
        }
        return new returnData.ReturnData({ status: 223, payload });
    };
    readOneById = async ({ actorID, id, filters, options, }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 624,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(523, 'Empty');
        }
        const { payload: payloads, isRestricted } = this.reduceByPermissions({
            actor,
            filters,
            options,
            ids: [id],
        });
        const payload = payloads[0];
        if (!payload) {
            return CollectionDB.generateServerError(524, 'Not Found');
        }
        const canRead = this._canReadExtended(payloads);
        if (!canRead) {
            return new returnData.ReturnData({
                status: 624,
                notPermitteds: ['ALL'],
                messages: [`Actor ${actorID} cannot read the data`],
                payload,
            });
        }
        if (isRestricted) {
            return new returnData.ReturnData({
                status: 324,
                payload,
                messages: ['Some data keys are restricted'],
            });
        }
        return new returnData.ReturnData({ status: 224, payload });
    };
    countAll = async (actorID) => {
        const actor = this._canRead(actorID);
        if (actor !== true) {
            return CollectionDB.generateServerError(525, 'Only superadmin can count all');
        }
        const out = this._collection.length;
        if (out <= 0) {
            return CollectionDB.generateServerError(525, 'Empty');
        }
        return new returnData.ReturnData({ status: 225, payload: out });
    };
    count = async ({ actorID, filters, options }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 626,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(526, 'Empty');
        }
        const payload = this._collection.filter(adapters_arrayDB_functions.inStreamSearchAdapter(filters)).length;
        if (payload <= 0) {
            return new returnData.ReturnData({ status: 326, messages: ['Empty'] });
        }
        const limit = options?.limit;
        if (limit && limit > payload) {
            return new returnData.ReturnData({
                status: 126,
                payload: limit,
                messages: ['Limit Reached'],
            });
        }
        return new returnData.ReturnData({ status: 226, payload });
    };
    // #endregion
    updateAll = async ({ actorID, data, options }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 627,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(527, 'Empty');
        }
        const helper = [];
        const db = tsDeepmerge.merge(helper, this._collection);
        const limit = options?.limit;
        const inputs = db
            .slice(0, limit)
            .map(_data => tsDeepmerge.merge(_data, data));
        if (limit && limit <= db.length) {
            this._collection.length = 0;
            this._collection.push(...inputs);
            return new returnData.ReturnData({
                status: 127,
                payload: inputs.map(input => input._id),
                messages: ['Limit Reached'],
            });
        }
        return new returnData.ReturnData({
            status: 227,
            payload: inputs.map(input => input._id),
        });
    };
    // #region Update
    updateMany = async ({ actorID, filters, data, options, }) => {
        const actor = this._canRead(actorID);
        if (actor === false) {
            return new returnData.ReturnData({
                status: 627,
                notPermitteds: ['ALL'],
                messages: ['Actor not exists'],
            });
        }
        if (!this._collection.length) {
            return CollectionDB.generateServerError(528, 'Empty');
        }
        const { payload: rawPayload, isLimited, isRestricted, } = this.reduceByPermissions({
            actor,
            filters,
            options,
            key: '__update',
        });
        if (!rawPayload.length) {
            return new returnData.ReturnData({
                status: 328,
                messages: ['Filters kill data'],
            });
        }
        const payload = rawPayload.map(({ _id }) => _id);
        this.__update(data, ...payload);
        if (isLimited) {
            return new returnData.ReturnData({
                status: 122,
                payload,
                messages: ['Limit Reached'],
            });
        }
        return new returnData.ReturnData({
            status: 222,
            payload,
        });
    };
    updateManyByIds = async ({ ids, filters, data, options, }) => {
        if (!this._collection.length) {
            return new returnData.ReturnData({ status: 523, messages: ['Empty'] });
        }
        const db = [...this._collection];
        const limit = options?.limit;
        // const mapper = (_data: WI<T>) => ({ ..._data, ...data });
        const inputs1 = db.filter(data => ids.includes(data._id));
        if (!inputs1.length) {
            return new returnData.ReturnData({
                status: 323,
                messages: ['ids cannot reach DB'],
            });
        }
        if (!filters) {
            const payload = inputs1.slice(0, limit).map(input => input._id);
            this.__update(data, ...payload);
            this._collection; //?
            if (limit && limit < inputs1.length) {
                return new returnData.ReturnData({
                    status: 123,
                    payload,
                    messages: ['Limit Reached'],
                });
            }
            return new returnData.ReturnData({
                status: 223,
                payload,
            });
        }
        const _filter = adapters_arrayDB_functions.inStreamSearchAdapter(filters);
        const inputs2 = inputs1.filter(_filter);
        const payload = inputs2.slice(0, limit).map(input => input._id);
        this.__update(data, ...payload);
        if (!inputs2.length) {
            return new returnData.ReturnData({
                status: 523,
                messages: ['Filters kill data'],
            });
        }
        if (limit && limit < inputs2.length) {
            return new returnData.ReturnData({
                status: 123,
                payload,
                messages: ['Limit Reached'],
            });
        }
        if (inputs2.length < inputs1.length) {
            return new returnData.ReturnData({
                status: 323,
                payload,
                messages: ['Filters slice datas'],
            });
        }
        return new returnData.ReturnData({
            status: 223,
            payload,
        });
    };
    updateOne = async () => {
        throw undefined;
    };
    updateOneById = async () => {
        throw undefined;
    };
    // #endregion
    setAll = async () => {
        throw undefined;
    };
    setMany = async () => {
        throw undefined;
    };
    setManyByIds = async () => {
        throw undefined;
    };
    setOne = async () => {
        throw undefined;
    };
    setOneById = async () => {
        throw undefined;
    };
    deleteAll = async () => {
        throw undefined;
    };
    deleteMany = async () => {
        throw undefined;
    };
    deleteManyByIds = async () => {
        throw undefined;
    };
    deleteOne = async () => {
        throw undefined;
    };
    deleteOneById = async () => {
        throw undefined;
    };
    retrieveAll = async () => {
        throw undefined;
    };
    retrieveMany = async () => {
        throw undefined;
    };
    retrieveManyByIds = async () => {
        throw undefined;
    };
    retrieveOne = async () => {
        throw undefined;
    };
    retrieveOneById = async () => {
        throw undefined;
    };
    removeAll = async () => {
        throw undefined;
    };
    removeMany = async () => {
        throw undefined;
    };
    removeManyByIds = async () => {
        throw undefined;
    };
    removeOne = async () => {
        throw undefined;
    };
    removeOneById = async () => {
        throw undefined;
    };
}

exports.CollectionDB = CollectionDB;
//# sourceMappingURL=arrayDB.cjs.map
