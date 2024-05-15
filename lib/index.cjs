'use strict';

var adapters_arrayDB = require('./adapters/arrayDB.cjs');
var functions = require('./functions.cjs');
require('./schemas/index.cjs');
var schemas_objects = require('./schemas/objects.cjs');
var schemas_strings = require('./schemas/strings.cjs');



exports.CollectionDB = adapters_arrayDB.CollectionDB;
exports.includesMany = functions.includesMany;
exports.isEntity = functions.isEntity;
exports.isNotClause = functions.isNotClause;
exports.isSearchOperation = functions.isSearchOperation;
exports.actorSchema = schemas_objects.actorSchema;
exports.atomicDataSchema = schemas_objects.atomicDataSchema;
exports.collectionPermissionsShape = schemas_objects.collectionPermissionsShape;
exports.entitySchema = schemas_objects.entitySchema;
exports.humanSchema = schemas_objects.humanSchema;
exports.loginSchema = schemas_objects.loginSchema;
exports.permissionsShape = schemas_objects.permissionsShape;
exports.phoneNumber = schemas_objects.phoneNumber;
exports.timestampsSchema = schemas_objects.timestampsSchema;
exports.user = schemas_objects.user;
exports.userSchema = schemas_objects.userSchema;
exports.withID = schemas_objects.withID;
exports.withoutID = schemas_objects.withoutID;
exports.withoutPassword = schemas_objects.withoutPassword;
exports.withoutPermissions = schemas_objects.withoutPermissions;
exports.ARRAY_CLAUSES = schemas_strings.ARRAY_CLAUSES;
exports.CLAUSES = schemas_strings.CLAUSES;
exports.COMMON_CLAUSES = schemas_strings.COMMON_CLAUSES;
exports.EXIST_CLAUSES = schemas_strings.EXIST_CLAUSES;
exports.LOGICAL_CLAUSES = schemas_strings.LOGICAL_CLAUSES;
exports.NUMBER_CLAUSES = schemas_strings.NUMBER_CLAUSES;
exports.PERMISSIONS_STRINGS = schemas_strings.PERMISSIONS_STRINGS;
exports.STATUS_STRINGS = schemas_strings.STATUS_STRINGS;
exports.STRING_CLAUSES = schemas_strings.STRING_CLAUSES;
exports.TYPE_ALIASES = schemas_strings.TYPE_ALIASES;
//# sourceMappingURL=index.cjs.map
