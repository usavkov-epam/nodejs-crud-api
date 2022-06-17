import { v4 as uuidv4 } from 'uuid';

import InMemoryDB, { StorageField } from '../db/in-memory';

export interface User {
  readonly id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export enum Selectors {
  id = 'id',
  username = 'username',
  age = 'age',
  hobbies = 'hobbies',
}

export type UserEntity = Promise<User | undefined>;
export type UserEntities = Promise<User[] | undefined>;

const db = InMemoryDB.instance;

export class UserModel {
  db: InMemoryDB;

  constructor(database = db) {
    this.db = database;
    this.db.addEntity<User>('users')
  }

  private async getEntity(): Promise<StorageField<User>> {
    return this.db.getEntity<User>('users');
  }

  public async getAll(): Promise<UserEntities> {
    const usersMap = await this.getEntity();
    return Object.values(usersMap);
  }

  public async getBy(field: Selectors, value: string): Promise<UserEntity> {
    const usersMap = await this.getEntity();

    if (field === Selectors.id) return usersMap[value];
  
    return Object.values(usersMap).find(user => user[field] === value);
  }

  public async create(user: User): Promise<UserEntity> {
    const hash = uuidv4();
    const usersMap = await this.getEntity();
    const foundUser = usersMap[hash];
    return usersMap[hash] = { ...foundUser, ...user, id: hash };
  }

  public async update(id: string, user: object): Promise<UserEntity> {
    const usersMap = await this.getEntity();
    const foundUser = usersMap[id];
    return usersMap[foundUser.id] = { ...foundUser, ...user, id };
  }

  public async delete(id: string): Promise<UserEntity> {
    const usersMap = await this.getEntity();
    const foundUser = usersMap[id];
    delete usersMap[id];
    return foundUser;
  }
}
