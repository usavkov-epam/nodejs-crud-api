import {
  Storage,
  StorageField,
} from '../types';

class InMemoryDB {
  private static _instance: InMemoryDB;
  private _store: Storage = {};

  private constructor() { };

  public static get instance(): InMemoryDB {
    if (!InMemoryDB._instance) {
      InMemoryDB._instance = new InMemoryDB();
    }

    return InMemoryDB._instance;
}

  public async addEntity<T>(entity: string): Promise<StorageField<T>> {
    if (this._store[entity]) this._store[entity];

    return this._store[entity] = {};
  }

  public async getEntity<T>(entity: string): Promise<StorageField<T>> {
    return this._store[entity];
  }
};

export default InMemoryDB;

