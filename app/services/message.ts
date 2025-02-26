import * as messageModel from '../models/message';
import { IMessageCreate, IDirectMessageCreate } from '../types/message';

export const createMessage = async (data: IMessageCreate) => {
  return await messageModel.createMessage(data);
};

export const getChannelMessages = async (channelId: string, limit: number = 50, before?: string) => {
  return await messageModel.getChannelMessages(channelId, limit, before);
};

export const createDirectMessage = async (data: IDirectMessageCreate) => {
  return await messageModel.createDirectMessage(data);
};

export const getDirectMessages = async (
  userId1: string, 
  userId2: string, 
  limit: number = 50, 
  before?: string
) => {
  return await messageModel.getDirectMessages(userId1, userId2, limit, before);
};

export const addReaction = async (data: { userId: string; messageId?: string; directMessageId?: string; emoji: string }) => {
  return await messageModel.addReaction(data);
};

export const removeReaction = async (messageId: string, userId: string, emoji: string) => {
  return await messageModel.removeReaction(messageId, userId, emoji);
};