import {
  DataSearchOperations,
  Entity,
  IRepo,
  ReturnData,
  sleep,
  WithId,
  WithoutId,
} from "core_types";
import { nanoid } from "nanoid";
import { Readable } from "stream";
import { inStreamSearchAdapter } from "./adapters";

type RDW<T> = ReturnData<WithId<T>>;
type RDWA<T> = ReturnData<WithId<T>[]>;
type PRD<T> = Partial<WithoutId<T>>;

type ReadManyByIdsProps<T> = {
  ids: string[];
  search?: DataSearchOperations<T>;
  limit?: number;
};

type FilterCollectionProps<T> = {
  filter: DataSearchOperations<T>;
  col?: WithId<T>[];
  limit?: number;
};
type FilterCollectionByIdsProps<T> = {
  ids: String[];
  col?: WithId<T>[];
  filter?: DataSearchOperations<T>;
  limit?: number;
};

type SubscribeProps<T> = {
  subscriber: WithId<T>[];
  filter?: DataSearchOperations<T>;
  limit?: number;
};

export class InsTreamRepository<T extends Entity>
  implements IRepo<T> {
  collection: WithId<T>[] = [];
  constructor(collection?: WithId<T>[]) {
    if (collection) this.collection.push(...collection);
  }

  // #region Helper Functions
  protected get return500() {
    return <T>() => ({ status: 500 } as ReturnData<T>);
  }

  protected get return300() {
    return <T>() => ({ status: 300 } as ReturnData<T>);
  }

  private filterCollectionOne(
    filter: DataSearchOperations<T>,
    col?: WithId<T>[]
  ) {
    const find = (col ?? this.collection).find(
      inStreamSearchAdapter(filter)
    );
    return find;
  }

  private filterCollectionOneIndex(
    filter: DataSearchOperations<T>,
    col?: WithId<T>[]
  ) {
    const find = (col ?? this.collection).findIndex(
      inStreamSearchAdapter(filter)
    );
    return find;
  }

  private filterCollection({
    filter,
    col,
    limit,
  }: FilterCollectionProps<T>) {
    const out: WithId<T>[] = [];
    const collect = col ?? this.collection;
    for (const iterator of collect) {
      if (limit && out.length >= limit) break;
      const bool = inStreamSearchAdapter(filter)(iterator);

      if (bool) out.push(iterator);
    }

    return out;
  }

  private filterCollectionByIds({
    ids,
    filter,
    col,
    limit,
  }: FilterCollectionByIdsProps<T>) {
    const prevCol = col ?? this.collection;
    const collect1 = prevCol.filter((value) =>
      ids.includes(value._id)
    );
    const collect = filter
      ? this.filterCollection({ filter, col: collect1, limit })
      : collect1;
    const out: WithId<T>[] = [];

    for (const iterator of collect) {
      if (limit && out.length >= limit) break;
      out.push(iterator);
    }

    return out;
  }

  private filterCollectionOut({
    filter,
    col,
    limit,
  }: FilterCollectionProps<T>) {
    const prevCol = col ?? this.collection;
    const _ids = this.filterCollection({
      filter,
      col: prevCol,
      limit: limit,
    }).map((val) => val._id);
    const collect = this.collection.filter((val) =>
      _ids.every((_id) => _id !== val._id)
    );

    return collect;
  }

  private filterCollectionByIdsOut({
    ids,
    filter,
    col,
    limit,
  }: FilterCollectionByIdsProps<T>) {
    const prevCol = col ?? this.collection;
    const _ids = this.filterCollectionByIds({
      ids,
      filter,
      col: prevCol,
      limit,
    }).map((val) => val._id);

    const collect = this.collection.filter((val) =>
      _ids.every((_id) => _id !== val._id)
    );
    const out: WithId<T>[] = [];

    for (const iterator of collect) {
      out.push(iterator);
    }

    return out;
  }

  private assignPropsToObject(
    obj: any,
    entries: [string, unknown][]
  ) {
    entries.forEach(([key, value]) => {
      obj[key] = value;
    });
    return obj;
  }
  // #endregion

  // #region Create
  createOne = async (value: T) => {
    await sleep(100);
    const _value = { ...value, _id: value._id || nanoid() };
    this.collection.push(_value);
    return { status: 200, payload: _value } as RDW<T>;
  };

  createMany = async (values: WithoutId<T>[]) => {
    await sleep(100);
    const _values = values.map((value) => ({
      ...value,
      _id: (value as any)._id || nanoid(),
    }));
    this.collection.push(..._values);
    return { status: 200, payload: _values } as RDWA<T>;
  };

  upsertOne = async (value: WithId<T>) => {
    let output: RDW<T> = { status: 300 };
    const index = this.collection.findIndex(
      (compare) => value._id == compare._id
    );
    if (index === -1) {
      output = { status: 204, payload: value };
    } else {
      output = { status: 104, payload: value };
    }
    this.collection = [
      ...this.collection.splice(0, index - 1),
      value,
      ...this.collection.splice(index + 1),
    ];
    return output;
  };
  // #endregion

  // #region Read & SUbscribe

  readOne = async (filter?: DataSearchOperations<T>) => {
    if (!filter)
      return { status: 307, payload: this.collection[0] } as RDW<T>;
    const entries = Object.entries(filter).filter(
      ([, value]) => !!value
    );
    const find = this.collection.find(inStreamSearchAdapter(filter));

    return (find
      ? { status: 207, payload: find }
      : { status: 407 }) as RDW<T>;
  };

  readOneById = async (id: string) => {
    const find = this.collection.find(({ _id }) => _id === id);

    return (find
      ? { status: 208, payload: find }
      : { status: 408 }) as RDW<T>;
  };

  readMany = async (
    filter?: DataSearchOperations<T>,
    limit?: number
  ) => {
    if (!filter)
      return { status: 309, payload: this.collection } as RDWA<T>;

    const payload = this.collection.filter(
      inStreamSearchAdapter(filter)
    );

    return (payload.length > 0
      ? { status: 209, payload }
      : { status: 409 }) as RDWA<T>;
  };

  readManyByIds = async (
    ids: string[],
    filter?: DataSearchOperations<T>,
    limit?: number
  ) => {
    if (!ids || ids.length === 0)
      return { status: 310, payload: this.collection } as RDWA<T>;
    const col = [...this.collection];
    const payload = this.filterCollectionByIds({
      ids,
      filter,
      col,
      limit,
    });
    if (payload.length === 0) return { status: 410 } as RDWA<T>;
    return {
      status: 210,
      payload,
    } as RDWA<T>;
  };

  count = async (filter?: DataSearchOperations<T>) => {
    if (!filter)
      return {
        status: 311,
        payload: this.collection.length,
      } as ReturnData<number>;

    const payload = this.collection.filter(
      inStreamSearchAdapter(filter)
    ).length;
    return { status: 211, payload } as ReturnData<number>;
  };

  subscribe = async ({
    subscriber,
    filter,
    limit,
  }: SubscribeProps<T>) => {
    const stream = Readable.from(this.collection);
    let col = [...this.collection];
    stream.on("data", (arg) => {
      if (limit && subscriber.length >= limit) return;
      if (!filter) {
        subscriber.push(arg);
        return;
      }

      const find = this.filterCollectionOne(filter, col);
      col = col.filter((el) => !(el._id === find?._id));
      if (find) subscriber.push(find);
    });

    return subscriber;
  };

  //#endregion

  // #region Update
  updateOne = async (
    filter: DataSearchOperations<T>,
    newValue: Partial<WithoutId<T>>
  ) => {
    let data: RDW<T> = { status: 313 };
    const index = this.filterCollectionOneIndex(filter);
    if (index === -1) return data;
    const entries = Object.entries(newValue).filter(
      ([, value]) => !!value
    );

    const payload = this.assignPropsToObject(
      this.collection[index],
      entries
    );

    data = { status: 213, payload };
    const col = [
      ...this.collection.slice(0, index - 1),
      payload,
      ...this.collection.slice(index + 1),
    ];

    this.collection = col;
    return data;
  };

  updateOneById = async (
    id: string,
    newValue: Partial<WithoutId<T>>
  ) => {
    let data: RDW<T> = { status: 314 };
    const index = this.collection.findIndex((el) => el._id === id);
    if (index === -1) return data;
    const entries = Object.entries(newValue).filter(
      ([, value]) => !!value
    );
    // const newData = this.collection[index] as any;
    // entries.forEach(([key, value]) => {
    //   newData[key] = value;
    // });

    const payload = this.assignPropsToObject(
      this.collection[index],
      entries
    );

    data = { status: 214, payload };
    const col = [
      ...this.collection.slice(0, index - 1),
      payload,
      ...this.collection.slice(index + 1),
    ];

    this.collection = col;
    return data;
  };

  updateMany = async (
    filter: DataSearchOperations<T>,
    newValue: Partial<WithoutId<T>>,
    limit?: number
  ) => {
    let data: RDWA<T> = { status: 315 };
    const collection = this.filterCollection({ filter, limit });
    const collectionOut = this.filterCollectionOut({ filter });
    if (collection.length <= 0) return data;
    const entries = Object.entries(newValue).filter(
      ([, value]) => !!value
    );
    // const newData = this.collection[index] as any;
    // entries.forEach(([key, value]) => {
    //   newData[key] = value;
    // });

    const payload = collection.map((el) =>
      this.assignPropsToObject(el, entries)
    ) as WithId<T>[];

    data = { status: 215, payload };
    const col = [...payload, ...collectionOut];

    this.collection = col;
    return data;
  };

  updateManyByIds = async (
    ids: string[],
    newValue: WithoutId<Partial<T>>,
    options?: {
      filter?: DataSearchOperations<T>;
      limit?: number;
    }
  ) => {
    let data: RDWA<T> = { status: 316 };
    const collection = this.filterCollectionByIds({
      ids,
      filter: options?.filter,
      limit: options?.limit,
    });
    const collectionOut = this.filterCollectionByIdsOut({
      ids,
      filter: options?.filter,
    });
    if (collection.length <= 0) return data;
    const entries = Object.entries(newValue).filter(
      ([, value]) => !!value
    );

    const payload = collection.map((el) =>
      this.assignPropsToObject(el, entries)
    ) as WithId<T>[];
    data = { status: 216, payload };
    const col = [...payload, ...collectionOut];

    this.collection = col;
    return data;
  };
  // #endregion

  // #region Delete
  deleteOne = async (filter?: DataSearchOperations<T>) => {
    let data: RDW<T> = { status: 317 };
    if (!filter) return data;
    data = { status: 417 };
    const index = this.filterCollectionOneIndex(filter);
    if (index === -1) return data;
    const payload = this.collection[index];
    data = { status: 217, payload };
    this.collection = [
      ...this.collection.slice(0, index),
      ...this.collection.slice(index + 1),
    ];
    return data;
  };

  deleteOneById = async (id: string) => {
    let data: RDW<T> = { status: 318 };
    const index = this.collection.findIndex((val) => val._id === id);
    if (index === -1) return data;
    const payload = this.collection[index];
    data = { status: 218, payload };
    this.collection = [
      ...this.collection.slice(0, index),
      ...this.collection.slice(index + 1),
    ];
    return data;
  };

  deleteMany = async (
    filter?: DataSearchOperations<T>,
    limit?: number
  ) => {
    let data: RDWA<T> = {
      status: 319,
      payload: [...this.collection],
    };
    if (!filter) {
      this.collection.length = 0;
      return data;
    }
    const payload = this.filterCollection({ filter, limit });
    data = { status: 419 };
    if (payload.length <= 0) return data;
    data = { status: 219, payload };
    this.collection = this.filterCollectionOut({ filter, limit });
    return data;
  };

  deleteManyByIds = async (
    ids: string[],
    options?: {
      filter?: DataSearchOperations<T>;
      limit?: number;
    }
  ) => {
    let data: RDWA<T> = {
      status: 320,
    };

    const payload = this.filterCollectionByIds({
      ids,
      filter: options?.filter,
      limit: options?.limit,
    });
    if (payload.length <= 0) return data;

    data = { status: 220, payload };
    this.collection = this.filterCollectionByIdsOut({
      ids,
      filter: options?.filter,
      limit: options?.limit,
    });
    return data;
  };
  // #endregion

  // #region Collection Functions
  dropCollection = async () => {
    await sleep(100);
    this.collection.length = 0;
    return { status: 200, payload: true } as ReturnData<boolean>;
  };
  // #endregion
}
