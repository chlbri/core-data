import { ReturnData, ServerErrorStatus } from '@bemedev/return-data';
import { castDraft, produce } from 'immer';
import { nanoid } from 'nanoid';
import { merge } from 'ts-deepmerge';
import {
  Actor,
  CollectionPermissions,
  EntryWithPermissions,
  ObjectWithPermissions,
  Re,
  TimeStamps,
  WithEntity,
  WithId,
} from '../entities';
import { recompose } from '../entities.functions';
import { TransformToZodObject, timestampsSchema } from '../schemas';
import { DSO } from '../types';
import {
  Count,
  CountAll,
  CreateMany,
  CreateOne,
  DeleteAll,
  DeleteMany,
  DeleteManyByIds,
  DeleteOne,
  DeleteOneById,
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
  Repository,
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
import { Entity, PermissionsArray } from './../entities';
import {
  inStreamSearchAdapter,
  zodDecomposeKeys,
} from './arrayDB.functions';

// type Permission<T extends Entity> = {
//   permissionReader: PermissionsReaderOne<T>;
// };

export type CollectionArgs<T> = {
  _schema: TransformToZodObject<WT<T>>;
  _actors?: Actor[];
  permissions?: CollectionPermissions;
  checkPermissions?: boolean;
  test?: boolean;
};

export class CollectionDB<T extends Re> implements Repository<Entity & T> {
  /* , Permission<T> */
  private _collection: WithEntity<T>[];
  private test: boolean;
  private _colPermissions: EntryWithPermissions<T>[];
  private _schema: TransformToZodObject<WT<T>>;
  private _actors: Actor[] = [];
  private _permissions?: CollectionPermissions;
  private checkPermissions: boolean;

  get collection() {
    if (this.test) {
      return this._collection;
    }
    return [];
  }

  get colPermissions() {
    if (this.test) {
      return this._colPermissions;
    }
    return [];
  }

  __update = (payload: string[], update: WT<T>) => {
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

  __seed = async (...arr: WithEntity<T>[]) => {
    if (this.test) this._collection.push(...arr);
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

  private getActor = (ID: string) => {
    return this._actors.find(({ actorID }) => ID === actorID);
  };

  private canCreate = (actorID: string) => {
    if (this.canCheckPermissions) {
      const actor = this.getActor(actorID);
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

  private canDeleteDoc = (actorID: string) => {
    if (this.canCheckPermissions) {
      const actor = this.getActor(actorID);
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

  private generateServerError = (
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

  private reduceByPermissions = (filters: DSO<WT<T>>) => {
    const _reads = this._collection.filter(inStreamSearchAdapter(filters));
    const reads: WithEntity<T>[] = [];

    for (const { _id, ...data } of _reads) {
      const permission = this._colPermissions.find(
        permission => permission._id === _id,
      );
      if (!permission) return;
    }
    const ids = _reads.map(({ _id }) => _id);
    const _permissions = this._colPermissions.filter(({ _id }) =>
      ids.includes(_id),
    );
    const permissions = _permissions.map(
      ({ _created, _updated, _deleted, ...perm }) => {
        return perm;
      },
    ) as WithId<ObjectWithPermissions<T>>[];
    return { permissions, reads: _reads } as const;
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

  static generateCreateData<T extends Re>(
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

  // #endregion

  // #region Private
  static get timestampsPermissionsCreator() {
    const keys = Object.keys(
      timestampsSchema.shape,
    ) as (keyof TimeStamps)[];
    const entries = keys.map(key => {
      const permissions = CollectionDB.generateDefaultPermissions();
      return [key, permissions] as const;
    });
    type O = Record<(typeof keys)[number], PermissionsArray>;
    const out = Object.fromEntries(entries);
    return out as O;
  }

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
    } as EntryWithPermissions<T>;
    return out2;
  };

  private createPermissionInputs = (...ids: string[]) => {
    ids.forEach(id => {
      const input = this.generatePermissionCreate(id);
      this._colPermissions.push(input);
    });
  };

  private generateCreate = (
    actorID: string,
    data: WT<T>,
    _id = nanoid(),
  ) => {
    const input = CollectionDB.generateCreateData(actorID, data, _id);
    this._collection.push(input);
    this.createPermissionInputs(input._id);
    return input;
  };
  // #endregion

  createMany: CreateMany<T> = async ({
    actorID,
    data: _datas,
    options,
  }) => {
    // #region Check actor's permissions
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return this.generateServerError(
        510,
        'This actor cannot create elements',
      );
    }
    // #endregion

    const inputs = _datas.map(data =>
      CollectionDB.generateCreateData(actorID, data),
    );

    if (options && options.limit && options.limit < _datas.length) {
      const limit = options.limit;

      // #region Pushs
      const _inputs = inputs.slice(0, limit);
      this._collection.push(..._inputs);
      const ids = _inputs.map(({ _id }) => _id);
      this.createPermissionInputs(...ids);
      // #endregion

      const payload = _inputs.map(input => input._id);
      const messages = ['Limit exceeded'];
      const rd = new ReturnData({ status: 110, payload, messages });
      return rd;
    }

    // #region Pushs
    this._collection.push(...inputs);
    const ids = inputs.map(({ _id }) => _id);
    this.createPermissionInputs(...ids);
    // #endregion

    const payload = inputs.map(input => input._id) as string[];
    const rd = new ReturnData({ status: 210, payload });
    return rd;
  };

  createOne: CreateOne<T> = async ({ data, actorID }) => {
    // #region Check actor's permissions
    const canCreate = this.canCreate(actorID);
    if (!canCreate) {
      return this.generateServerError(
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
      return this.generateServerError(
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
      return this.generateServerError(
        513,
        'This actor cannot create elements',
      );
    }
    const inputs = upserts.map(({ _id, data }) => ({
      _id: _id ?? nanoid(),
      ...data,
    })) as WithId<WT<T>>[];
    const alreadyExists: string[] = [];
    if (options && options.limit && options.limit < upserts.length) {
      const limit = options.limit;
      const _inputs = inputs.slice(0, limit).map(({ _id, ...data }) => {
        const _filter = (data: WithEntity<T>) => _id === data._id;
        const _exist = this._collection.find(_filter)?._id;
        if (_exist) {
          alreadyExists.push(_exist);
        } else {
          // #region Pushs
          const _input = CollectionDB.generateCreateData<T>(
            actorID,
            data as any,
            _id,
          );
          this._collection.push(_input);
          this.createPermissionInputs(_input._id);
          // #endregion
        }
        return { _id, ...data };
      });
      if (alreadyExists.length > 0) {
        return new ReturnData({
          status: 313,
          payload: _inputs.map(input => input._id),
          messages: [`${alreadyExists.length} already exist`],
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

      if (_exist) {
        alreadyExists.push(_exist);
      } else {
        // #region Pushs
        const _input = CollectionDB.generateCreateData<T>(
          actorID,
          data as any,
          _id,
        );
        this._collection.push(_input);
        this.createPermissionInputs(_input._id);
        // #endregion
      }
      return { _id, ...data };
    });

    if (alreadyExists.length > 0) {
      return new ReturnData({
        status: 313,
        payload: inputs.map(input => input._id),
        messages: [`${alreadyExists.length} already exist`],
      });
    } else {
      return new ReturnData({
        status: 213,
        payload: inputs.map(input => input._id),
      });
    }
  };

  // #endregion

  // #region Read

  // #region Private
  private canRead = (actorID: string, filters: DSO<WT<T>>) => {
    if (!this.checkPermissions) return true;
    const actor = this.getActor(actorID);
    if (!actor) return false;
    const isSuperAdmin = actor.superAdmin;
    if (isSuperAdmin) return true;
    actor.permissions;
    // const { permissions, reads } = this.getDataAndPermissions(filters);
  };
  private readPermissions = (filters: DSO<WT<T>>) => {
    const all = this.reduceByPermissions(filters);
    // const ids = reads.map(data => {
    //   data
    // });
    // const reads = all.map(({ _id, ...data }) => {
    //   const _data = data as unknown as ObjectWithPermissions<T>;
    //   const values = Object.values(_data);
    //   return { _id, __read: _data };
    // });
  };
  // #endregion

  readAll: ReadAll<T> = async (actorID, options) => {
    const isSuperAdmin = this.getActor(actorID)?.superAdmin;
    if (!isSuperAdmin) {
      return this.generateServerError(
        520,
        'Only SuperAdmin can read all data',
      );
    }
    if (!this._collection.length) {
      return new ReturnData({
        status: 520,
        messages: ['Empty'],
      });
    }

    const check2 =
      !!options &&
      options.limit &&
      options.limit < this._collection.length;

    if (check2) {
      return new ReturnData({
        status: 320,
        payload: this._collection.slice(0, options.limit),
        messages: ['Limit Reached'],
      });
    }

    return new ReturnData({
      status: 220,
      payload: this._collection.slice(0, options?.limit),
    });
  };

  readMany: ReadMany<T> = async ({ actorID, filters, options }) => {
    const actor = this.getActor(actorID);
    if (!this._collection.length) {
      return this.generateServerError(521, 'Empty');
    }

    const reads = this._collection.filter(inStreamSearchAdapter(filters));
    if (!reads.length) {
      return new ReturnData({
        status: 321,
        messages: ['Empty'],
      });
    }
    if (options && options.limit && options.limit < reads.length) {
      return new ReturnData({
        status: 121,
        payload: reads.slice(0, options.limit),
        messages: ['Limit Reached'],
      });
    }
    return new ReturnData({
      status: 221,
      payload: reads,
    });
  };

  readManyByIds: ReadManyByIds<T> = async ({
    actorID,
    ids,
    filters,
    options,
  }) => {
    if (!this._collection.length) {
      this.generateServerError(522, 'Empty');
    }

    const reads1 = this._collection.filter(data => ids.includes(data._id));
    if (!reads1.length) {
      return new ReturnData({
        status: 322,
        messages: ['Empty request'],
      });
    }
    if (!filters) {
      if (options && options.limit && options.limit < reads1.length) {
        return new ReturnData({
          status: 122,
          payload: reads1.slice(0, options.limit),
          messages: ['Limit Reached'],
        });
      } else {
        return new ReturnData({
          status: 222,
          payload: reads1,
        });
      }
    }
    const reads2 = reads1.filter(inStreamSearchAdapter(filters));
    if (!reads2.length) {
      return new ReturnData({
        status: 322,
        messages: ['Filters kill data'],
      });
    }

    if (reads2.length < reads1.length) {
      return new ReturnData({
        status: 122,
        payload: reads2,
        messages: ['Filters slice datas'],
      });
    }
    return new ReturnData({
      status: 222,
      payload: reads2,
    });
  };

  readOne: ReadOne<T> = async ({ actorID, filters }) => {
    if (!this._collection.length) {
      return this.generateServerError(523, 'Empty');
    }
    const payload = this._collection.find(inStreamSearchAdapter(filters));
    if (payload) {
      return new ReturnData({ status: 223, payload });
    }
    return new ReturnData({ status: 523, messages: ['NotFound'] });
  };

  readOneById: ReadOneById<T> = async ({ actorID, id, filters }) => {
    if (!this._collection.length) {
      return this.generateServerError(524, 'Empty');
    }

    const exits1 = this._collection.find(data => data._id === id);
    if (!filters) {
      if (!exits1) {
        return new ReturnData({ status: 524, messages: ['NotFound'] });
      } else return new ReturnData({ status: 224, payload: exits1 });
    }
    const exists2 = this._collection
      .filter(data => data._id === id)
      .find(inStreamSearchAdapter(filters));

    if (!exists2) {
      return new ReturnData({
        status: 324,
        messages: exits1 ? ['Not found'] : ['Filters kill data'],
      });
    }
    return new ReturnData({ status: 218, payload: exists2 });
  };

  countAll: CountAll = async actorID => {
    const out = this._collection.length;
    if (out <= 0) {
      return this.generateServerError(525, 'Empty');
    }
    return new ReturnData({ status: 219, payload: out });
  };

  count: Count<T> = async ({ actorID, filters, options }) => {
    if (!this._collection.length) {
      return this.generateServerError(526, 'Empty');
    }

    const payload = this._collection.filter(
      inStreamSearchAdapter(filters),
    ).length;
    if (payload <= 0) {
      return new ReturnData({ status: 326, messages: ['Empty'] });
    }
    const limit = options?.limit;
    if (limit && limit < payload) {
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
    if (!this._collection.length) {
      return this.generateServerError(527, 'Empty');
    }

    const db = [...this._collection];
    const limit = options?.limit;
    const inputs = db
      .slice(0, limit)
      .map(_data => ({ ..._data, ...data }));
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

  updateMany: UpdateMany<T> = async ({
    actorID,
    filters,
    data,
    options,
  }) => {
    if (!this._collection.length) {
      return this.generateServerError(528, 'Empty');
    }
    const db = [...this._collection];

    const _filter = inStreamSearchAdapter(filters);
    const limit = options?.limit;
    const inputs = db.filter(_filter);

    const payload = inputs.slice(0, limit).map(input => input._id);
    if (!inputs.length) {
      return new ReturnData({
        status: 328,
        messages: ['Filters kill data'],
      });
    }

    if (limit && limit < inputs.length) {
      this.__update(payload, data);
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

      this.__update(payload, data);
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

    this.__update(payload, data);

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
