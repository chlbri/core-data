"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objects_1 = require("./schemas/objects");
const zod_1 = require("zod");
const perm = (0, zod_1.object)(objects_1.permissionsShape);
const colPerm = (0, zod_1.object)(objects_1.collectionPermissionsShape);
