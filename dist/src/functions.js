"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity = exports.atomicData = exports.isWithoutPermissions = exports.getPermissionsArray = exports.getPermissions = exports.isAtomicObject = exports.isAtomicData = exports.isEntity = exports.includesMany = exports.isNotClause = exports.isSearchOperation = void 0;
const zod_1 = require("zod");
const schemas_1 = require("./schemas");
const objects_1 = require("./schemas/objects");
function isSearchOperation(val) {
    return Object.keys(val).every(val => val.startsWith('$'));
}
exports.isSearchOperation = isSearchOperation;
function isNotClause(value) {
    return Object.keys(value) === ['$not'];
}
exports.isNotClause = isNotClause;
function includesMany(array, includes) {
    return includes.every(include => array.includes(include));
}
exports.includesMany = includesMany;
function isEntity(value) {
    return schemas_1.entitySchema.safeParse(value).success;
}
exports.isEntity = isEntity;
function isAtomicData(value) {
    return (0, zod_1.object)(objects_1.permissionsShape).safeParse(value).success;
}
exports.isAtomicData = isAtomicData;
function isAtomicObject(value) {
    const { _id, ...input } = value;
    const schema = (0, zod_1.record)((0, zod_1.object)(objects_1.permissionsShape));
    return schema.safeParse(input).success;
}
exports.isAtomicObject = isAtomicObject;
function getPermissions(data) {
    const entries = Object.entries(data).filter(([key]) => key !== '_id');
    const out = entries
        .map(([key, value]) => {
        if (isAtomicData(value)) {
            const { __read, __write, __remove } = value;
            return { [key]: { __read, __write, __remove } };
        }
        else if (isAtomicObject(value)) {
            return { [key]: getPermissions(value) };
        }
        else
            return {};
    })
        .reduce((acc, curr) => {
        return Object.assign(acc, curr);
    });
    return out;
}
exports.getPermissions = getPermissions;
function getPermissionsArray(data) {
    return data.map(getPermissions);
}
exports.getPermissionsArray = getPermissionsArray;
//TODO: Add a better way to exit with false
function isWithoutPermissions(val) {
    return Object.keys(val).every(key => !schemas_1.PERMISSIONS_STRINGS.safeParse(key).success);
}
exports.isWithoutPermissions = isWithoutPermissions;
function atomicData(data, __read, __write, __remove) {
    return {
        data,
        __read,
        __write,
        __remove,
    };
}
exports.atomicData = atomicData;
function entity(_id, shape) {
    return {
        _id,
        ...shape,
        _createdAt: new Date(),
        _updatedAt: new Date(),
        _deletedAt: false,
    };
}
exports.entity = entity;
