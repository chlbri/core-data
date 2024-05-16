/* eslint-disable @typescript-eslint/no-unused-vars */
import { decompose, recompose, type Ru } from '@bemedev/decompose';
import { ReturnData } from '@bemedev/return-data';
import type {
  PermissionErrorStatus,
  ServerErrorStatus,
} from '@bemedev/return-data/lib/types';
import { castDraft, produce } from 'immer';
import { nanoid } from 'nanoid';
import { merge } from 'ts-deepmerge';
import { timestampsSchema, type TransformToZodObject } from '../schemas';
import type { DSO } from '../types';
import type {
  Actor,
  CollectionPermissions,
  EntryWithPermissions,
  MaybeId,
  PermissionsArray,
  PermissionsKeys,
  SimpleActor,
  TimeStamps,
  TimeStampsPermissions,
  WithEntity,
  WithId,
  WithoutTimeStamps,
} from '../types/entities';
import type {
  Count,
  CountAll,
  CreateMany,
  CreateOne,
  DeleteAll,
  DeleteMany,
  DeleteManyByIds,
  DeleteOne,
  DeleteOneById,
  Projection,
  QueryOptions,
  Read,
  ReadAll,
  ReadMany,
  ReadManyByIds,
  ReadOne,
  ReadOneById,
  RemoveAll,
  RemoveMany,
  RemoveManyByIds,
  RemoveOne,
  RemoveOneById,
  RetrieveAll,
  RetrieveMany,
  RetrieveManyByIds,
  RetrieveOne,
  RetrieveOneById,
  SetAll,
  SetMany,
  SetManyByIds,
  SetOne,
  SetOneById,
  UpdateAll,
  UpdateMany,
  UpdateManyByIds,
  UpdateOne,
  UpdateOneById,
  UpsertMany,
  UpsertOne,
  WT,
} from '../types/repo';
import {
  inStreamSearchAdapter,
  withProjection,
  withProjection2,
  zodDecomposeKeys,
} from './arrayDB.functions';

// type Permission<T extends Entity> = {
//   permissionReader: PermissionsReaderOne<T>;
// };

export type CollectionArgs<T> = {
  _schema: TransformToZodObject<WithoutTimeStamps<T>>;
  _actors?: Actor[];
  permissions?: CollectionPermissions;
  checkPermissions?: boolean;
  test?: boolean;
};

export type ReduceByPermissionsArgs<
  T extends Ru,
  P extends Projection<WithId<WithoutTimeStamps<T>>> = [],
> = {
  actor: SimpleActor | true;
  filters?: DSO<T>;
  ids?: string[];
  options?: QueryOptions<P>;
  key?: PermissionsKeys;
};

const TEST_SUPER_ADMIN_ID = 'super-admin';

export class CollectionDB<T extends Ru> /* implements Repository<T> */ {
  // #region Properties
  private _collection: WithEntity<T>[];
  private _colPermissions: EntryWithPermissions<T>[];
  private _schema: CollectionArgs<T>['_schema'];
  private _actors: Required<CollectionArgs<T>>['_actors'] = [];
  private _permissions?: CollectionArgs<T>['permissions'];
  private checkPermissions: Required<
    CollectionArgs<T>
  >['checkPermissions'];
  private test: Required<CollectionArgs<T>>['test'];
  // #endregion

  /**
   * Only in test mode
   */
  get collection() {
    if (this.test) {
      return this._collection;
    }
    return [];
  }

  /**
   * Only in test mode
   */
  get colPermissions() {
    if (this.test) {
      return this._colPermissions;
    }
    return [];
  }

  private __update = (update: WT<T>, ...payload: string[]) => {
    const __db = produce(this._collection, draft => {
      payload.forEach(id => {
        const index = draft.findIndex((data: any) => data._id === id);
        if (index !== -1) {
          draft[index] = castDraft(
            merge(draft[index], update) as WithEntity<T>,
          );
        }
      });
    });
    this._rinitDB();
    this._collection.push(...__db);
  };

  __seed = async (...arr: MaybeId<WithoutTimeStamps<T>>[]) => {
    if (this.test) {
      const out = arr.map(({ _id, ...data }) => {
        return this.generateCreate(TEST_SUPER_ADMIN_ID, data as any, _id);
      });
      return out;
    }
    return [];
  };

  constructor({
    _schema,
    _actors,
    permissions,
    checkPermissions,
    test = true,
  }: CollectionArgs<T>) {
    // #region Constructore Variables
    this._schema = _schema;
    if (_actors) this._actors.push(..._actors);
    this._permissions = permissions;
    this.checkPermissions = !!checkPermissions;
    this.test = !!test;
    // #endregion

    this._collection = [];
    this._colPermissions = [];
  }

  get canCheckPermissions() {
    return (
      this.checkPermissions &&
      !!this._permissions &&
      this._actors.length > 0
    );
  }

  private _getActor = (ID: string) => {
    return this._actors.find(({ actorID }) => ID === actorID);
  };

  canCreate = (actorID: string) => {
    if (this.canCheckPermissions) {
      const actor = this._getActor(actorID);
      if (!actor) return false;
      const superAdmin = actor.superAdmin === true;
      if (superAdmin) return true;

      const permissions = actor.permissions;
      if (!permissions) return false;
      if (!this._permissions) return false;
      return permissions.includes(this._permissions.__create);
    }
    return true;
  };

  canDeleteDoc = (actorID: string) => {
    if (this.canCheckPermissions) {
      const actor = this._getActor(actorID);
      if (!actor) return false;
      const superAdmin = actor.superAdmin === true;
      if (superAdmin) return true;

      const permissions = actor.permissions;
      if (!permissions) return false;
      if (!this._permissions) return false;
      return permissions.includes(this._permissions.__remove);
    }
    return true;
  };

  static generateServerError = (
    status: ServerErrorStatus,
    ...messages: string[]
  ) => {
    return new ReturnData({ status, messages });
  };

  get schema() {
    return this._schema;
  }

  _rinitDB() {
    this._collection.length = 0;
    this._colPermissions.length = 0;
  }

  get length() {
    return this._collection.length;
  }

  static mapperWithoutTimestamps<T extends Ru = Ru>() {
    const mapper = ({
      _created,
      _deleted,
      _updated,
      ...data
    }: WithEntity<T>) => data as WithId<WithoutTimeStamps<T>>;
    return mapper;
  }

  private _withoutTimestamps = (
    filters?: DSO<WT<T>>,
    ...ids: string[]
  ) => {
    const collection = this._withoutTimestampsByIds(...ids);

    if (!filters) {
      return collection;
    }
    const _filters = inStreamSearchAdapter(filters);

    const out = collection.filter(_filters);
    return out;
  };

  private _withoutTimestampsByIds = (...ids: string[]) => {
    const mapper = CollectionDB.mapperWithoutTimestamps<T>();
    const check = !ids.length;

    if (!check) {
      return this._collection.map(mapper);
    }
    const _filters = ({ _id }: WithEntity<T>) => {
      ids.includes(_id);
    };
    const out = this._collection.filter(_filters).map(mapper);
    return out;
  };

  private _withoutTimestampsPermissions = (...ids: WithId<unknown>[]) => {
    const rawPermissions: WithId<
      WithoutTimeStamps<EntryWithPermissions<T>>
    >[] = [];

    // #region Populate constant "rawPermissions"
    for (const { _id } of ids) {
      const permission = this._colPermissions.find(
        permission => permission._id === _id,
      );
      const { _created, _deleted, _updated, ...data } = permission!;
      rawPermissions.push(data as any);
    }
    return rawPermissions;
  };

  // #region Create
  // #region Static
  static generateCreateTimestamps = (actorID: string): TimeStamps => ({
    _created: {
      by: actorID,
      at: new Date(),
    },
    _updated: {
      by: actorID,
      at: new Date(),
    },
    _deleted: false,
  });

  static buildCreate<T extends Ru>(
    actorID: string,
    data: WT<T>,
    _id = nanoid(),
  ) {
    const timestamps = this.generateCreateTimestamps(actorID);
    const input = {
      _id,
      ...timestamps,
      ...data,
    } as WithEntity<T>;
    return input;
  }

  static generateDefaultPermissions = () => {
    const out: PermissionsArray = {
      __read: [],
      __update: [],
      __remove: [],
    };
    return out;
  };

  static get timestampsPermissionsCreator() {
    const keys = Object.keys(
      timestampsSchema.shape,
    ) as (keyof TimeStamps)[];
    const entries = keys.map(key => {
      const permissions = CollectionDB.generateDefaultPermissions();
      return [key, permissions] as const;
    });
    const out = Object.fromEntries(entries);
    return out as TimeStampsPermissions;
  }
  // #endregion

  // #region Private
  private generatePermissionCreate = (_id: string) => {
    const keys = zodDecomposeKeys(this._schema.shape, false);
    const entries = keys.map(key => {
      const permissions = CollectionDB.generateDefaultPermissions();
      return [key, permissions] as const;
    });

    const _out1 = Object.fromEntries(entries);
    const out1 = recompose(_out1);
    const permissions = CollectionDB.timestampsPermissionsCreator;
    const out2 = {
      ...out1,
      ...permissions,
      _id,
    };
    return out2 as EntryWithPermissions<T>;
  };

  protected pushPermission = (permission: EntryWithPermissions<T>) => {
    return this._colPermissions.push(permission);
  };

  protected pushData = (data: WithEntity<T>) => {
    return this._collection.push(data);
  };

  private _createPermission = (...ids: string[]) => {
    const permissions: EntryWithPermissions<T>[] = [];
    ids.forEach(id => {
      const input = this.generatePermissionCreate(id);
      this.pushPermission(input);
      permissions.push(input);
    });

    return permissions;
  };

  private _createData = (actorID: string, data: WT<T>, _id = nanoid()) => {
    const input = CollectionDB.buildCreate(actorID, data, _id);
    this.pushData(input);
    return input;
  };

  private generateCreate = (
    actorID: string,
    data: WithoutTimeStamps<T>,
    _id = nanoid(),
  ) => {
    const input = this._createData(actorID, data, _id);
    this._createPermission(input._id);
    return input;
  };

  // #endregion

  // #region Creation
  createMany: CreateMany<T> = async ({
    actorID,
    data: _datas,
    options,
  }) => {
    // #region Check actor's permissions
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return CollectionDB.generateServerError(
        510,
        'This actor cannot create elements',
      );
    }
    // #endregion

    const inputs = _datas.map(data =>
      CollectionDB.buildCreate(actorID, data),
    );

    if (options && options.limit && options.limit < _datas.length) {
      const limit = options.limit;

      // #region Pushs
      const _inputs = inputs.slice(0, limit);
      this._collection.push(..._inputs);
      const ids = _inputs.map(({ _id }) => _id);
      this._createPermission(...ids);
      // #endregion

      const payload = _inputs.map(input => input._id);
      const messages = ['Limit exceeded'];
      const rd = new ReturnData({ status: 110, payload, messages });
      return rd;
    }

    // #region Pushs
    this._collection.push(...inputs);
    const ids = inputs.map(({ _id }) => _id);
    this._createPermission(...ids);
    // #endregion

    const payload = inputs.map(input => input._id) as string[];
    const rd = new ReturnData({ status: 210, payload });
    return rd;
  };

  createOne: CreateOne<T> = async ({ data, actorID }) => {
    // #region Check actor's permissions
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return CollectionDB.generateServerError(
        511,
        'This actor cannot create elements',
      );
    }
    // #endregion

    const input = this.generateCreate(actorID, data);
    const payload = input._id;
    const rd = new ReturnData({ status: 211, payload });
    return rd;
  };

  upsertOne: UpsertOne<T> = async ({ actorID, id: _id, data }) => {
    // #region Check actor's permissions
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return CollectionDB.generateServerError(
        512,
        'This actor cannot create elements',
      );
    }
    // #endregion

    const _filter = (data: WithEntity<T>) => _id === data._id;
    const _exist = this._collection.find(_filter);
    if (_exist) {
      const messages = ['Already exists'];
      return new ReturnData({ status: 312, payload: _id, messages });
    } else {
      this.generateCreate(actorID, data, _id);
      return new ReturnData({ status: 212, payload: _id });
    }
  };

  upsertMany: UpsertMany<T> = async ({ actorID, upserts, options }) => {
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return CollectionDB.generateServerError(
        513,
        'This actor cannot create elements',
      );
    }
    const inputs = upserts.map(({ _id, data }) => ({
      _id: _id ?? nanoid(),
      ...data,
    })) as WithId<WT<T>>[];

    let alreadyExists = 0;

    const checkLimit =
      options && options.limit && options.limit > upserts.length;
    if (checkLimit) {
      const limit = options.limit;
      const _inputs = inputs.slice(0, limit).map(({ _id, ...data }) => {
        const _filter = (data: WithEntity<T>) => _id === data._id;
        const _exist = this._collection.find(_filter)?._id;
        if (_exist) alreadyExists++;
        else {
          // #region Pushs
          const _input = CollectionDB.buildCreate<T>(
            actorID,
            data as any,
            _id,
          );
          this._collection.push(_input);
          this._createPermission(_input._id);
          // #endregion
        }
        return { _id, ...data };
      });
      if (alreadyExists > 0) {
        const check = alreadyExists === upserts.length;
        if (check) {
          return CollectionDB.generateServerError(513, 'All data exists');
        }
        return new ReturnData({
          status: 313,
          payload: _inputs.map(input => input._id),
          messages: [`${alreadyExists} already exist`],
        });
      } else {
        return new ReturnData({
          status: 113,
          payload: _inputs.map(input => input._id),
          messages: ['Limit is reached'],
        });
      }
    }

    inputs.forEach(({ _id, ...data }) => {
      const _filter = (data: WithEntity<T>) => _id === data._id;
      const _exist = this._collection.find(_filter)?._id;

      if (_exist) alreadyExists++;
      else {
        // #region Pushs
        const _input = CollectionDB.buildCreate<T>(
          actorID,
          data as any,
          _id,
        );
        this._collection.push(_input);
        this._createPermission(_input._id);
        // #endregion
      }
      return { _id, ...data };
    });

    if (alreadyExists > 0) {
      return new ReturnData({
        status: 313,
        payload: inputs.map(input => input._id),
        messages: [`${alreadyExists} already exist`],
      });
    } else {
      return new ReturnData({
        status: 213,
        payload: inputs.map(input => input._id),
      });
    }
  };
  // #endregion
  // #endregion

  // #region Read

  // #region Private
  private _canRead = (actorID: string) => {
    if (!this.checkPermissions) return true;
    const actor = this._getActor(actorID);
    if (!actor) return false;
    const isSuperAdmin = actor.superAdmin;
    if (isSuperAdmin) return true;
    return actor;
    // const { permissions, reads } = this.getDataAndPermissions(filters);
  };

  private reduceByPermissions = <
    P extends Projection<WithoutTimeStamps<T>> = [],
  >({
    actor,
    filters,
    ids,
    options,
    key: permissionKey = '__read',
  }: ReduceByPermissionsArgs<T, P>) => {
    const args = ids ? ([filters, ...ids] as const) : ([filters] as const);
    const rawReads = this._withoutTimestamps(...args);
    const isLimited = !!options?.limit && options.limit > rawReads.length;

    const slicedReads = rawReads.slice(0, options?.limit);
    type Out = Read<T, P>[];
    const projection = (options?.projection ?? []) as P;

    /**
     * Check if some records are resticted by permissions
     */
    let isRestricted = false;

    /**
     * Grant all permissions for superAdmin
     */
    if (actor === true) {
      const rawReadsWithProjection = slicedReads.map(data => {
        return withProjection(data, ...projection);
      }) as unknown as Out;
      return { payload: rawReadsWithProjection, isRestricted, isLimited };
    }

    if (slicedReads.length === 0) {
      const rawReadsWithProjection = slicedReads.map(data => {
        return withProjection(data, ...projection);
      }) as unknown as Out;
      return { payload: rawReadsWithProjection, isRestricted, isLimited };
    }

    const actorPermissions = actor.permissions;
    const rawPermissions = this._withoutTimestampsPermissions(
      ...slicedReads,
    );

    /**
     * Decompose the raw Reads for better permission checking
     */
    const flattenReads = slicedReads.map(decompose);

    /**
     * Filter keys with projection
     */
    const flattenReadsWithProjection = flattenReads.map(data => {
      return withProjection2(data, ...projection);
    });

    /**
     * Decompose the raw Permission for better permission checking
     */
    const flattenPermissions = rawPermissions.map(
      decompose,
    ) as unknown as WithId<Record<string, PermissionsArray>>[];

    const payload: Out = [];

    flattenPermissions.forEach(({ _id, ...perm }, index) => {
      const permissionsEntries = Object.entries(perm);

      // #region Check if the data has no permissions restrictions
      const permissionsValues = permissionsEntries.map(
        ([, value]) => value,
      );

      const check1 = permissionsValues.every(
        (val: any) => val.length === 0,
      );
      if (check1) {
        const payload1 = flattenReadsWithProjection[index] as Out[number];
        payload.push(payload1);
      }
      // #endregion
      else {
        const restrictedKeys: string[] = [];

        // #region Check if actor has all required permissions
        permissionsEntries.forEach(([key1, value1]) => {
          const __read = value1[permissionKey];
          const check11 = __read.every(_read =>
            actorPermissions.includes(_read),
          );
          if (!check11) {
            restrictedKeys.push(key1);
            if (isRestricted === false) isRestricted = true;
          }
        });
        const check2 = restrictedKeys.length === 0;
        if (check2) {
          payload.push(rawReads[index] as any);
        }
        // #endregion
        else {
          const entriesData = Object.entries(
            flattenReadsWithProjection[index],
          );
          // #region Update the read without the restricted keys
          const newRead = entriesData.filter(
            ([key]) => !restrictedKeys.includes(key),
          );

          const updatedRead = recompose(Object.fromEntries(newRead));
          payload.push({
            _id,
            ...updatedRead,
          } as any);
          // #endregion
        }
      }
    });

    return { payload, isRestricted, isLimited };
  };

  private _canReadExtended = (reads: any[]) => {
    return reads.some(read => {
      const keys = Object.keys(read);
      const len = keys.length;
      return len > 1;
    });
  };

  // #endregion

  readAll: ReadAll<T> = async (actorID, options) => {
    const actor = this._canRead(actorID);
    if (actor !== true) {
      const out = new ReturnData({
        status: 620,
        messages: ['Only SuperAdmin can read all data'],
      });
      return out;
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(520, 'Empty');
    }
    const rawReads = this._withoutTimestamps();

    const check =
      !!options && options.limit && options.limit > rawReads.length;

    if (check) {
      return new ReturnData({
        status: 320,
        payload: rawReads.slice(0, options.limit),
        messages: ['Limit exceed data available'],
      });
    }

    return new ReturnData({
      status: 220,
      payload: rawReads.slice(0, options?.limit),
    });
  };

  readMany: ReadMany<T> = async ({ actorID, filters, options }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return new ReturnData({
        status: 621,
        // notPermitteds: ['ALL'],
        messages: ['Actor not exists'],
      });
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(521, 'Empty');
    }

    const { payload, isRestricted, isLimited } = this.reduceByPermissions({
      actor,
      filters,
      options,
    });

    if (!payload.length) {
      return new ReturnData({
        status: 321,
        messages: ['Empty'],
      });
    }

    const canRead = this._canReadExtended(payload);
    if (!canRead) {
      return new ReturnData({
        status: 621,
        // notPermitteds: ['ALL'],
        messages: [`Actor ${actorID} cannot read the data`],
        payload,
      });
    }

    if (isRestricted) {
      return new ReturnData({
        status: 321,
        payload,
        messages: ['Some data keys are restricted'],
      });
    }

    if (isLimited) {
      return new ReturnData({
        status: 121,
        payload,
        messages: ['Limit Reached'],
      });
    }

    return new ReturnData({
      status: 221,
      payload,
    });
  };

  private generateNoActor = (
    status: PermissionErrorStatus,
    actorID?: string,
  ) =>
    new ReturnData({
      status,
      messages: [
        `This actor ${actorID ? `${actorID} :` : ':'} not exists`,
      ],
    });

  private generateActorCannotPerform = ({
    status,
    actorID,
    action = 'read',
  }: {
    status: PermissionErrorStatus;
    actorID?: string;
    action?: 'read' | 'update' | 'delete' | 'create';
  }) =>
    new ReturnData({
      status,
      messages: [
        `This actor ${actorID ? `${actorID} :` : ':'} cannot ${action} data`,
      ],
    });

  readManyByIds: ReadManyByIds<T> = async ({
    actorID,
    ids,
    filters,
    options,
  }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return this.generateNoActor(622, actorID);
    }

    if (!this._collection.length) {
      CollectionDB.generateServerError(522, 'Empty');
    }

    const { payload, isRestricted, isLimited } = this.reduceByPermissions({
      actor,
      filters,
      ids,
      options,
    });

    if (!payload.length) {
      return new ReturnData({
        status: 322,
        messages: ['Empty'],
      });
    }

    const canRead = this._canReadExtended(payload);
    if (!canRead) {
      return new ReturnData({
        status: 622,
        // notPermitteds: ['ALL'],
        messages: [`Actor ${actorID} cannot read the data`],
        payload,
      });
    }

    if (isRestricted) {
      return new ReturnData({
        status: 322,
        payload,
        messages: ['Some data keys are restricted'],
      });
    }

    if (isLimited) {
      return new ReturnData({
        status: 122,
        payload,
        messages: ['Limit Reached'],
      });
    }

    return new ReturnData({
      status: 222,
      payload,
    });
  };

  readOne: ReadOne<T> = async ({ actorID, filters, options }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return new ReturnData({
        status: 623,
        // notPermitteds: ['ALL'],
        messages: ['Actor not exists'],
      });
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(523, 'Empty');
    }

    const { payload: payloads, isRestricted } = this.reduceByPermissions({
      actor,
      filters,
      options,
    });

    const payload = payloads[0];
    if (!payload) {
      return CollectionDB.generateServerError(523, 'Not Found');
    }

    const canRead = this._canReadExtended(payloads);
    if (!canRead) {
      return new ReturnData({
        status: 623,
        // notPermitteds: ['ALL'],
        messages: [`Actor ${actorID} cannot read the data`],
        payload,
      });
    }

    if (isRestricted) {
      return new ReturnData({
        status: 323,
        payload,
        messages: ['Some data keys are restricted'],
      });
    }

    return new ReturnData({ status: 223, payload });
  };

  readOneById: ReadOneById<T> = async ({
    actorID,
    id,
    filters,
    options,
  }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return new ReturnData({
        status: 624,
        // notPermitteds: ['ALL'],
        messages: ['Actor not exists'],
      });
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(523, 'Empty');
    }

    const { payload: payloads, isRestricted } = this.reduceByPermissions({
      actor,
      filters,
      options,
      ids: [id],
    });

    const payload = payloads[0];
    if (!payload) {
      return CollectionDB.generateServerError(524, 'Not Found');
    }

    const canRead = this._canReadExtended(payloads);
    if (!canRead) {
      return this.generateActorCannotPerform({ status: 624, actorID });
    }

    if (isRestricted) {
      return new ReturnData({
        status: 324,
        payload,
        messages: ['Some data keys are restricted'],
      });
    }

    return new ReturnData({ status: 224, payload });
  };

  countAll: CountAll = async actorID => {
    const actor = this._canRead(actorID);

    if (actor !== true) {
      return CollectionDB.generateServerError(
        525,
        'Only superadmin can count all',
      );
    }
    const out = this._collection.length;
    if (out <= 0) {
      return CollectionDB.generateServerError(525, 'Empty');
    }

    return new ReturnData({ status: 225, payload: out });
  };

  count: Count<T> = async ({ actorID, filters, options }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return this.generateNoActor(626, actorID);
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(526, 'Empty');
    }

    const payload = this._collection.filter(
      inStreamSearchAdapter(filters),
    ).length;

    if (payload <= 0) {
      return new ReturnData({ status: 326, messages: ['Empty'] });
    }

    const limit = options?.limit;
    if (limit && limit > payload) {
      return new ReturnData({
        status: 126,
        payload: limit,
        messages: ['Limit Reached'],
      });
    }

    return new ReturnData({ status: 226, payload });
  };

  // #endregion

  updateAll: UpdateAll<T> = async ({ actorID, data, options }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return this.generateNoActor(627, actorID);
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(527, 'Empty');
    }

    const helper: WithEntity<T>[] = [];
    const db = merge(helper, this._collection) as WithEntity<T>[];

    const limit = options?.limit;
    const inputs = db
      .slice(0, limit)
      .map(_data => merge(_data, data)) as WithEntity<T>[];

    if (limit && limit <= db.length) {
      this._collection.length = 0;
      this._collection.push(...inputs);
      return new ReturnData({
        status: 127,
        payload: inputs.map(input => input._id),
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 227,
      payload: inputs.map(input => input._id),
    });
  };

  // #region Update
  updateMany: UpdateMany<T> = async ({
    actorID,
    filters,
    data,
    options,
  }) => {
    const actor = this._canRead(actorID);

    if (actor === false) {
      return this.generateNoActor(628, actorID);
    }

    if (!this._collection.length) {
      return CollectionDB.generateServerError(528, 'Empty');
    }

    const {
      payload: rawPayload,
      isLimited,
      // isRestricted,
    } = this.reduceByPermissions({
      actor,
      filters,
      options,
      key: '__update',
    });

    if (!rawPayload.length) {
      return new ReturnData({
        status: 328,
        messages: ['Filters kill data'],
      });
    }

    const payload = rawPayload.map(({ _id }) => _id);

    this.__update(data, ...payload);
    if (isLimited) {
      return new ReturnData({
        status: 122,
        payload,
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 222,
      payload,
    });
  };

  updateManyByIds: UpdateManyByIds<T> = async ({
    ids,
    filters,
    data,
    options,
  }) => {
    if (!this._collection.length) {
      return new ReturnData({ status: 523, messages: ['Empty'] });
    }
    const db = [...this._collection];
    const limit = options?.limit;

    // const mapper = (_data: WI<T>) => ({ ..._data, ...data });

    const inputs1 = db.filter(data => ids.includes(data._id));

    if (!inputs1.length) {
      return new ReturnData({
        status: 323,
        messages: ['ids cannot reach DB'],
      });
    }
    if (!filters) {
      const payload = inputs1.slice(0, limit).map(input => input._id);

      this.__update(data, ...payload);
      this._collection; //?
      if (limit && limit < inputs1.length) {
        return new ReturnData({
          status: 123,
          payload,
          messages: ['Limit Reached'],
        });
      }
      return new ReturnData({
        status: 223,
        payload,
      });
    }
    const _filter = inStreamSearchAdapter(filters);
    const inputs2 = inputs1.filter(_filter);
    inputs2.length; //?
    const payload = inputs2.slice(0, limit).map(input => input._id);

    this.__update(data, ...payload);

    if (!inputs2.length) {
      return new ReturnData({
        status: 523,
        messages: ['Filters kill data'],
      });
    }
    if (limit && limit < inputs2.length) {
      return new ReturnData({
        status: 123,
        payload,
        messages: ['Limit Reached'],
      });
    }

    if (inputs2.length < inputs1.length) {
      return new ReturnData({
        status: 323,
        payload,
        messages: ['Filters slice datas'],
      });
    }

    return new ReturnData({
      status: 223,
      payload,
    });
  };

  updateOne: UpdateOne<T> = async () => {
    throw undefined;
  };
  updateOneById: UpdateOneById<T> = async () => {
    throw undefined;
  };
  // #endregion

  setAll: SetAll<T> = async () => {
    throw undefined;
  };
  setMany: SetMany<T> = async () => {
    throw undefined;
  };
  setManyByIds: SetManyByIds<T> = async () => {
    throw undefined;
  };
  setOne: SetOne<T> = async () => {
    throw undefined;
  };
  setOneById: SetOneById<T> = async () => {
    throw undefined;
  };
  deleteAll: DeleteAll = async () => {
    throw undefined;
  };
  deleteMany: DeleteMany<T> = async () => {
    throw undefined;
  };
  deleteManyByIds: DeleteManyByIds<T> = async () => {
    throw undefined;
  };
  deleteOne: DeleteOne<T> = async () => {
    throw undefined;
  };
  deleteOneById: DeleteOneById<T> = async () => {
    throw undefined;
  };
  retrieveAll: RetrieveAll = async () => {
    throw undefined;
  };
  retrieveMany: RetrieveMany<T> = async () => {
    throw undefined;
  };
  retrieveManyByIds: RetrieveManyByIds<T> = async () => {
    throw undefined;
  };
  retrieveOne: RetrieveOne<T> = async () => {
    throw undefined;
  };
  retrieveOneById: RetrieveOneById<T> = async () => {
    throw undefined;
  };
  removeAll: RemoveAll = async () => {
    throw undefined;
  };
  removeMany: RemoveMany<T> = async () => {
    throw undefined;
  };
  removeManyByIds: RemoveManyByIds<T> = async () => {
    throw undefined;
  };
  removeOne: RemoveOne<T> = async () => {
    throw undefined;
  };
  removeOneById: RemoveOneById<T> = async () => {
    throw undefined;
  };
}
