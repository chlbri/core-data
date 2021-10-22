"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicData = exports.isWithoutPermissions = exports.isOSO = exports.isNotClause = exports.isSearchOperation = void 0;
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
function atomicData(data, _read, _update, _delete) {
    return {
        data,
        _read,
        _update,
        _delete,
    };
}
exports.atomicData = atomicData;
