import * as channelModel from '../models/channel';
import { IChannelCreate, IChannelUpdate } from '../types/channel';

export const createChannel = async (data: IChannelCreate) => {
  return await channelModel.createChannel(data);
};

export const getChannelsByWorkspace = async (workspaceId: string, userId: string) => {
  return await channelModel.getChannelsByWorkspace(workspaceId, userId);
};

export const getChannelById = async (id: string) => {
  return await channelModel.getChannelById(id);
};

export const updateChannel = async (id: string, data: IChannelUpdate) => {
  return await channelModel.updateChannel(id, data);
};

export const deleteChannel = async (id: string) => {
  return await channelModel.deleteChannel(id);
};

export const isChannelMember = async (channelId: string, userId: string) => {
  return await channelModel.isChannelMember(channelId, userId);
};

export const addChannelMember = async (channelId: string, userId: string) => {
  return await channelModel.addChannelMember(channelId, userId);
};

export const removeChannelMember = async (channelId: string, userId: string) => {
  return await channelModel.removeChannelMember(channelId, userId);
};