"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithoutId = void 0;
function isWithoutId(val) {
    return !Object.keys(val).includes('_id');
}
exports.isWithoutId = isWithoutId;
