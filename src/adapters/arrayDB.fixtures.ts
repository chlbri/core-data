import type {
  PermissionErrorStatus,
  RedirectStatus,
  ServerErrorStatus,
  Status,
} from '@bemedev/return-data';
import { beforeAll, expect, test } from 'vitest';
import { z } from 'zod';
import type { Actor, PromiseRD } from '../types';
import { CollectionDB } from './arrayDB';

export const SUPER_ADMIN_ID = 'super-admin';

const _schema1 = z.object({
  age: z.number(),
});

const permissions1 = {
  __create: 'create',
  __read: 'read',
  __update: 'update',
  __remove: 'remove',
};

export const testColl = (...actors: Actor[]) =>
  new CollectionDB({
    _schema: _schema1,
    _actors: [
      {
        actorID: SUPER_ADMIN_ID,
        superAdmin: true,
      },
      ...actors,
    ],
    checkPermissions: true,
    permissions: permissions1,
  });

export const generateData = (len = 10) => {
  const array = [];
  for (let index = 0; index < len; index++) {
    const data = {
      age: index + 15,
    };
    array.push(data);
  }
  return array;
};

export const generateSeed = (len = 10) => {
  return generateData(len).map((data, index) => {
    return CollectionDB.buildCreate<{ age: number }>(
      SUPER_ADMIN_ID,
      data,
      `existed@${index}`,
    );
  });
};

export const assignUndefined = <T>(value?: T) => value as T | undefined;

export type TestActorNotExists<T = any> = [
  status: PermissionErrorStatus,
  rd: () => PromiseRD<T>,
  ...messages: string[],
];

export const testsActorNotExists = <T>(
  ...[permissionStatus, rd, ...__messages]: TestActorNotExists<T>
) => {
  let status = assignUndefined<Status>();
  let payload = assignUndefined<any>();
  let notPermitteds = assignUndefined<Record<string, number>>();
  let messages = assignUndefined<string[]>();

  beforeAll(async () => {
    const _rd = await rd();

    _rd.maybeMap({
      /* v8 ignore next 3 */
      else: () => {
        throw 'not defined';
      },
      /**
       * Better type notPermitteds
       */
      permission: (_status, _payload, _notPermitteds, _messages) => {
        status = _status;
        payload = _payload;
        notPermitteds = _notPermitteds;
        messages = _messages;
      },
    });
  });

  test(`#1 => Status is : ${permissionStatus}`, () => {
    expect(status).toBe(permissionStatus);
  });

  test('#2 => Payload is undefined', () => {
    expect(payload).toBeUndefined();
  });

  test('#3 => NotPermitteds is undefined', () => {
    expect(notPermitteds).toBeUndefined();
  });

  test('#4 => Check messages', () => {
    expect(messages).toStrictEqual(expect.arrayContaining(__messages));
  });
};

export type TestsDBisEmpty<T = any> = [
  status: ServerErrorStatus,
  rd: () => PromiseRD<T>,
  name?: string,
];

export const testsDBisEmpty = (
  ...[serverStatus, rd, name = 'test']: TestsDBisEmpty
) => {
  let status = assignUndefined<Status>();
  let messages = assignUndefined<string[]>();

  beforeAll(async () => {
    const _rd = await rd();

    _rd.maybeMap({
      else: () => {
        throw 'not defined';
      },

      server: (_status, _messages) => {
        status = _status;
        messages = _messages;
      },
    });
  });

  test(`#1 => Status is : ${serverStatus}`, () => {
    expect(status).toBe(serverStatus);
  });

  test('#2 => Check messages', () => {
    expect(messages?.[0]).toStrictEqual(
      `This collection (${name}) is empty`,
    );
  });
};

export type TestsRequestEmpty<T = any> = [
  status: RedirectStatus,
  rd: () => PromiseRD<T>,
  ...messages: string[],
];

export const testsRequestEmpty = (
  ...[redirectStatus, rd, ...__messages]: TestsRequestEmpty
) => {
  let status = assignUndefined<Status>();
  let payload = assignUndefined<any>();
  let messages = assignUndefined<string[]>();

  beforeAll(async () => {
    const _rd = await rd();

    _rd.maybeMap({
      else: () => {
        throw 'not defined';
      },

      redirect: (_status, _payload, _messages) => {
        status = _status;
        payload = _payload;
        messages = _messages;
      },
    });
  });

  test(`#1 => Status is : ${redirectStatus}`, () => {
    expect(status).toBe(redirectStatus);
  });

  test('#2 => Payload is undefined', () => {
    expect(payload).toBeUndefined();
  });

  test('#3 => Check messages', () => {
    expect(messages).toStrictEqual(expect.arrayContaining(__messages));
  });
};
