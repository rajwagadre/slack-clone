import * as workspaceModel from '../models/workspace';
import { IWorkspaceCreate, IWorkspaceUpdate } from '../types/workspace';

export const createWorkspace = async (data: IWorkspaceCreate & { creatorId: string }) => {
  return await workspaceModel.createWorkspace(data);
};

export const getWorkspaces = async () => {
  return await workspaceModel.getWorkspaces();
};

export const getWorkspacesByUserId = async (userId: string) => {
  return await workspaceModel.getWorkspacesByUserId(userId);
};

export const getWorkspaceById = async (id: string) => {
  return await workspaceModel.getWorkspaceById(id);
};

export const updateWorkspace = async (id: string, data: IWorkspaceUpdate) => {
  return await workspaceModel.updateWorkspace(id, data);
};

export const deleteWorkspace = async (id: string) => {
  return await workspaceModel.deleteWorkspace(id);
};

export const isWorkspaceMember = async (workspaceId: string, userId: string) => {
  return await workspaceModel.isWorkspaceMember(workspaceId, userId);
};

export const isWorkspaceAdmin = async (workspaceId: string, userId: string) => {
  return await workspaceModel.isWorkspaceAdmin(workspaceId, userId);
};

export const isWorkspaceOwner = async (workspaceId: string, userId: string) => {
  return await workspaceModel.isWorkspaceOwner(workspaceId, userId);
};

export const addWorkspaceMember = async (workspaceId: string, userId: string, role: string) => {
  return await workspaceModel.addWorkspaceMember(workspaceId, userId, role);
};

export const removeWorkspaceMember = async (workspaceId: string, userId: string) => {
  return await workspaceModel.removeWorkspaceMember(workspaceId, userId);
};