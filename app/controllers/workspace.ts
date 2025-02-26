import { Request, Response } from 'express';
import * as workspaceService from '../services/workspace.service';
import { responseHandler } from '../utils/responseHandler';
import Logger from '../utils/logger';

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const workspaceData = {
      ...req.body,
      creatorId: req.user.userId
    };
    
    const workspace = await workspaceService.createWorkspace(workspaceData);
    responseHandler(res, 201, 'Workspace created successfully', workspace);
  } catch (error) {
    Logger.error('Error creating workspace', error);
    responseHandler(res, 500, 'Error creating workspace');
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const workspaces = await workspaceService.getWorkspacesByUserId(req.user.userId);
    responseHandler(res, 200, 'Workspaces retrieved successfully', workspaces);
  } catch (error) {
    Logger.error('Error fetching workspaces', error);
    responseHandler(res, 500, 'Error fetching workspaces');
  }
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const workspace = await workspaceService.getWorkspaceById(req.params.id);
    if (!workspace) {
      return responseHandler(res, 404, 'Workspace not found');
    }
    
    // Check if user is a member of the workspace
    const isMember = await workspaceService.isWorkspaceMember(req.params.id, req.user.userId);
    if (!isMember) {
      return responseHandler(res, 403, 'You do not have access to this workspace');
    }
    
    responseHandler(res, 200, 'Workspace retrieved successfully', workspace);
  } catch (error) {
    Logger.error('Error fetching workspace', error);
    responseHandler(res, 500, 'Error fetching workspace');
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(req.params.id, req.user.userId);
    if (!isAdmin) {
      return responseHandler(res, 403, 'You do not have permission to update this workspace');
    }
    
    const workspace = await workspaceService.updateWorkspace(req.params.id, req.body);
    responseHandler(res, 200, 'Workspace updated successfully', workspace);
  } catch (error) {
    Logger.error('Error updating workspace', error);
    responseHandler(res, 500, 'Error updating workspace');
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    // Check if user is the owner of the workspace
    const isOwner = await workspaceService.isWorkspaceOwner(req.params.id, req.user.userId);
    if (!isOwner) {
      return responseHandler(res, 403, 'Only the workspace owner can delete it');
    }
    
    await workspaceService.deleteWorkspace(req.params.id);
    responseHandler(res, 200, 'Workspace deleted successfully');
  } catch (error) {
    Logger.error('Error deleting workspace', error);
    responseHandler(res, 500, 'Error deleting workspace');
  }
};

export const addWorkspaceMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { workspaceId, userId, role } = req.body;
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(workspaceId, req.user.userId);
    if (!isAdmin) {
      return responseHandler(res, 403, 'You do not have permission to add members');
    }
    
    const member = await workspaceService.addWorkspaceMember(workspaceId, userId, role || 'member');
    responseHandler(res, 201, 'Member added to workspace', member);
  } catch (error) {
    Logger.error('Error adding workspace member', error);
    responseHandler(res, 500, 'Error adding workspace member');
  }
};

export const removeWorkspaceMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { workspaceId, userId } = req.params;
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(workspaceId, req.user.userId);
    if (!isAdmin) {
      return responseHandler(res, 403, 'You do not have permission to remove members');
    }
    
    await workspaceService.removeWorkspaceMember(workspaceId, userId);
    responseHandler(res, 200, 'Member removed from workspace');
  } catch (error) {
    Logger.error('Error removing workspace member', error);
    responseHandler(res, 500, 'Error removing workspace member');
  }
};