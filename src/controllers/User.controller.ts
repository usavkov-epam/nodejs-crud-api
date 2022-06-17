import {
  IncomingMessage,
  ServerResponse,
} from 'http';

import {
  Selectors,
  UserModel,
} from '../models';
import {
  HandlerOptions,
  User,
  UserEntity,
} from '../types';

const userModel = new UserModel();

export const getAllUsers = async (_req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const users = await userModel.getAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error }));
  }
};

export const getUserById = async (
  _req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions,
): Promise<void> => {
  userModel.getBy(Selectors.id, params?.id);
  try {
    const users = await userModel.getAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error }));
  }
}

export const addUser = async (user: User): Promise<UserEntity> => {
  return userModel.create(user);
};

export const updateUser = async (id: string, user: object): Promise<UserEntity> => {
  return userModel.update(id, user);
};

export const deleteUser = async (id: string): Promise<UserEntity> => {
  return userModel.delete(id);
};
