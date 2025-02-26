import { Request, Response } from 'express';
import * as channelService from '../services/channel.service';
import * as workspaceService from '../services/workspace.service';
import { responseHandler } from '../utils/responseHandler';
import Logger from '../utils/logger';

export const createChannel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { workspaceId } = req.body;
    
    // Check if user is a member of the workspace
    const isMember = await workspaceService.isWorkspaceMember(workspaceId, req.user.userId);
    if (!isMember) {
      return responseHandler(res, 403, 'You do not have access to this workspace');
    }
    
    const channel = await channelService.createChannel(req.body);
    
    // Add creator as a channel member
    await channelService.addChannelMember(channel.id, req.user.userId);
    
    responseHandler(res, 201, 'Channel created successfully', channel);
  } catch (error) {
    Logger.error('Error creating channel', error);
    responseHandler(res, 500, 'Error creating channel');
  }
};

export const getChannelsByWorkspace = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { workspaceId } = req.params;
    
    // Check if user is a member of the workspace
    const isMember = await workspaceService.isWorkspaceMember(workspaceId, req.user.userId);
    if (!isMember) {
      return responseHandler(res, 403, 'You do not have access to this workspace');
    }
    
    const channels = await channelService.getChannelsByWorkspace(workspaceId, req.user.userId);
    responseHandler(res, 200, 'Channels retrieved successfully', channels);
  } catch (error) {
    Logger.error('Error fetching channels', error);
    responseHandler(res, 500, 'Error fetching channels');
  }
};

export const getChannelById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const channel = await channelService.getChannelById(req.params.id);
    if (!channel) {
      return responseHandler(res, 404, 'Channel not found');
    }
    
    // Check if user is a member of the channel or if the channel is public
    const canAccess = !channel.isPrivate || 
                      await channelService.isChannelMember(channel.id, req.user.userId);
    
    if (!canAccess) {
      return responseHandler(res, 403, 'You do not have access to this channel');
    }
    
    responseHandler(res, 200, 'Channel retrieved successfully', channel);
  } catch (error) {
    Logger.error('Error fetching channel', error);
    responseHandler(res, 500, 'Error fetching channel');
  }
};

export const updateChannel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const channel = await channelService.getChannelById(req.params.id);
    if (!channel) {
      return responseHandler(res, 404, 'Channel not found');
    }
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(channel.workspaceId, req.user.userId);
    if (!isAdmin) {
      return responseHandler(res, 403, 'You do not have permission to update this channel');
    }
    
    const updatedChannel = await channelService.updateChannel(req.params.id, req.body);
    responseHandler(res, 200, 'Channel updated successfully', updatedChannel);
  } catch (error) {
    Logger.error('Error updating channel', error);
    responseHandler(res, 500, 'Error updating channel');
  }
};

export const deleteChannel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const channel = await channelService.getChannelById(req.params.id);
    if (!channel) {
      return responseHandler(res, 404, 'Channel not found');
    }
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(channel.workspaceId, req.user.userId);
    if (!isAdmin) {
      return responseHandler(res, 403, 'You do not have permission to delete this channel');
    }
    
    await channelService.deleteChannel(req.params.id);
    responseHandler(res, 200, 'Channel deleted successfully');
  } catch (error) {
    Logger.error('Error deleting channel', error);
    responseHandler(res, 500, 'Error deleting channel');
  }
};

export const addChannelMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { channelId, userId } = req.body;
    
    const channel = await channelService.getChannelById(channelId);
    if (!channel) {
      return responseHandler(res, 404, 'Channel not found');
    }
    
    // Check if user is an admin of the workspace or already a member of the channel
    const isAdmin = await workspaceService.isWorkspaceAdmin(channel.workspaceId, req.user.userId);
    const isMember = await channelService.isChannelMember(channelId, req.user.userId);
    
    if (!isAdmin && !isMember) {
      return responseHandler(res, 403, 'You do not have permission to add members to this channel');
    }
    
    const member = await channelService.addChannelMember(channelId, userId);
    responseHandler(res, 201, 'Member added to channel', member);
  } catch (error) {
    Logger.error('Error adding channel member', error);
    responseHandler(res, 500, 'Error adding channel member');
  }
};

export const removeChannelMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { channelId, userId } = req.params;
    
    const channel = await channelService.getChannelById(channelId);
    if (!channel) {
      return responseHandler(res, 404, 'Channel not found');
    }
    
    // Check if user is an admin of the workspace
    const isAdmin = await workspaceService.isWorkspaceAdmin(channel.workspaceId, req.user.userId);
    if (!isAdmin && req.user.userId !== userId) {
      return responseHandler(res, 403, 'You do not have permission to remove members from this channel');
    }
    
    await channelService.removeChannelMember(channelId, userId);
    responseHandler(res, 200, 'Member removed from channel');
  } catch (error) {
    Logger.error('Error removing channel member', error);
    responseHandler(res, 500, 'Error removing channel member');
  }
};