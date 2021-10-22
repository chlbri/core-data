"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithId = void 0;
function isWithId(val) {
    return Object.keys(val).includes('_id');
}
exports.isWithId = isWithId;
