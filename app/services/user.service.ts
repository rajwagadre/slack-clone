import * as userModel from '../models/user';
import { IUserCreate, IUserUpdate } from '../types/user';

export const createUser = async (data: IUserCreate) => {
  return await userModel.createUser(data);
};

export const getUsers = async () => {
  return await userModel.getUsers();
};

export const getUserById = async (id: string) => {
  return await userModel.getUserById(id);
};

export const getUserByEmail = async (email: string) => {
  return await userModel.getUserByEmail(email);
};

export const updateUser = async (id: string, data: IUserUpdate) => {
  return await userModel.updateUser(id, data);
};

export const deleteUser = async (id: string) => {
  return await userModel.deleteUser(id);
};