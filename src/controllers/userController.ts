import {
  Selectors,
  User,
  UserEntity,
  UserEntities,
  UserModel,
} from '../models';

const userModel = new UserModel();

export const getAllUsers = async (): Promise<UserEntities> => {
  return userModel.getAll();
};

export const getUserById = async (id: string): Promise<UserEntity> => {
  return userModel.getBy(Selectors.id, id);
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
