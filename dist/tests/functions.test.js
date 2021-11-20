"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../src/functions");
const lite_1 = require("dequal/lite");
const obj = {
    _createdAt: {
        __read: ['_createdAt_read1', '_createdAt_read2'],
        __write: ['_createdAt-write'],
        __remove: ['_createdAt-remove'],
        data: new Date(),
    },
    _deletedAt: {
        __read: ['_deletedAt-read'],
        __write: ['_deletedAt-write'],
        __remove: ['_deletedAt-remove'],
        data: new Date(),
    },
    _updatedAt: {
        __read: ['_updatedAt-read'],
        __write: ['_updatedAt-write'],
        __remove: ['_updatedAt-remove'],
        data: new Date(),
    },
    _id: '',
    firstNames: {
        __read: ['_firstNames-read'],
        __write: ['_firstNames-write'],
        __remove: ['_firstNames-remove'],
    },
};
describe('getPermissions', () => {
    it('test1', () => {
        const actual = (0, functions_1.getPermissions)(obj);
        const expected = {
            _createdAt: {
                __read: ['_createdAt_read1', '_createdAt_read2'],
                __write: ['_createdAt-write'],
                __remove: ['_createdAt-remove'],
            },
            _deletedAt: {
                __read: ['_deletedAt-read'],
                __write: ['_deletedAt-write'],
                __remove: ['_deletedAt-remove'],
            },
            _updatedAt: {
                __read: ['_updatedAt-read'],
                __write: ['_updatedAt-write'],
                __remove: ['_updatedAt-remove'],
            },
            firstNames: {
                __read: ['_firstNames-read'],
                __write: ['_firstNames-write'],
                __remove: ['_firstNames-remove'],
            },
        };
        expect((0, lite_1.dequal)(actual, expected)).toBeTruthy();
        expect(actual).toStrictEqual(expected);
    });
});
