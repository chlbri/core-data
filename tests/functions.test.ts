import { getPermissions } from '../src/functions';
import { dequal } from 'dequal/lite';

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
    const actual = getPermissions(obj);
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

    expect(dequal(actual, expected)).toBeTruthy();
    expect(actual).toStrictEqual(expected);
  });

})

