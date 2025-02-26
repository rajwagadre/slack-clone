import prisma from '../config/db';
import { IUserCreate, IUserUpdate } from '../types/user';

export const createUser = async (data: IUserCreate) => {
  return await prisma.user.create({ data });
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      created_at: true,
      updated_at: true
    }
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ 
    where: { id },
    include: {
      workspaces: {
        include: {
          workspace: true
        }
      }
    }
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const updateUser = async (id: string, data: IUserUpdate) => {
  return await prisma.user.update({ 
    where: { id }, 
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      created_at: true,
      updated_at: true
    }
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({ where: { id } });
};