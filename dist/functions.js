"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity = exports.atomicData = exports.isWithoutPermissions = exports.isOSO = exports.isNotClause = exports.isSearchOperation = void 0;
const schemas_1 = require("./schemas");
function isSearchOperation(val) {
    return Object.keys(val).every(val => val.startsWith('$'));
}
exports.isSearchOperation = isSearchOperation;
function isNotClause(value) {
    return Object.keys(value) === ['$not'];
}
exports.isNotClause = isNotClause;
function isOSO(value) {
    return Object.keys(value) === ['$not'];
}
exports.isOSO = isOSO;
//TODO: Add a better way to exit with false
function isWithoutPermissions(val) {
    return Object.keys(val).every(key => !schemas_1.PERMISSIONS_STRINGS.includes(key));
}
exports.isWithoutPermissions = isWithoutPermissions;
function atomicData(data, __read, __write, __delete) {
    return {
        data,
        __read,
        __write,
        __delete,
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
