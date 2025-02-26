import { Request, Response } from 'express';
import * as messageService from '../services/message';
import * as channelService from '../services/channel.service';
import { responseHandler } from '../utils/responseHandler';
import { producer } from '../kafka/kafka';
import Logger from '../utils/logger';

export const createMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { content, channelId } = req.body;
    
    // Check if user is a member of the channel
    const isMember = await channelService.isChannelMember(channelId, req.user.userId);
    if (!isMember) {
      return responseHandler(res, 403, 'You do not have access to this channel');
    }
    
    const messageData = {
      content,
      channelId,
      senderId: req.user.userId
    };
    
    const message = await messageService.createMessage(messageData);
    
    // Send message to Kafka
    await producer.send({
      topic: 'messages',
      messages: [
        { 
          value: JSON.stringify({
            type: 'CHANNEL_MESSAGE',
            payload: message
          })
        }
      ]
    });
    
    responseHandler(res, 201, 'Message sent successfully', message);
  } catch (error) {
    Logger.error('Error creating message', error);
    responseHandler(res, 500, 'Error sending message');
  }
};

export const getChannelMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { channelId } = req.params;
    const { limit = '50', before } = req.query;
    
    // Check if user is a member of the channel
    const isMember = await channelService.isChannelMember(channelId, req.user.userId);
    if (!isMember) {
      return responseHandler(res, 403, 'You do not have access to this channel');
    }
    
    const messages = await messageService.getChannelMessages(
      channelId, 
      parseInt(limit as string), 
      before as string
    );
    
    responseHandler(res, 200, 'Messages retrieved successfully', messages);
  } catch (error) {
    Logger.error('Error fetching messages', error);
    responseHandler(res, 500, 'Error fetching messages');
  }
};

export const createDirectMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { content, receiverId } = req.body;
    
    const messageData = {
      content,
      senderId: req.user.userId,
      receiverId
    };
    
    const message = await messageService.createDirectMessage(messageData);
    
    // Send message to Kafka
    await producer.send({
      topic: 'direct-messages',
      messages: [
        { 
          value: JSON.stringify({
            type: 'DIRECT_MESSAGE',
            payload: message
          })
        }
      ]
    });
    
    responseHandler(res, 201, 'Direct message sent successfully', message);
  } catch (error) {
    Logger.error('Error creating direct message', error);
    responseHandler(res, 500, 'Error sending direct message');
  }
};

export const getDirectMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { userId } = req.params;
    const { limit = '50', before } = req.query;
    
    const messages = await messageService.getDirectMessages(
      req.user.userId,
      userId,
      parseInt(limit as string),
      before as string
    );
    
    responseHandler(res, 200, 'Direct messages retrieved successfully', messages);
  } catch (error) {
    Logger.error('Error fetching direct messages', error);
    responseHandler(res, 500, 'Error fetching direct messages');
  }
};

export const addReaction = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { messageId, emoji } = req.body;
    
    const reaction = await messageService.addReaction({
      userId: req.user.userId,
      messageId,
      emoji
    });
    
    responseHandler(res, 201, 'Reaction added successfully', reaction);
  } catch (error) {
    Logger.error('Error adding reaction', error);
    responseHandler(res, 500, 'Error adding reaction');
  }
};

export const removeReaction = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const { messageId, emoji } = req.params;
    
    await messageService.removeReaction(messageId, req.user.userId, emoji);
    
    responseHandler(res, 200, 'Reaction removed successfully');
  } catch (error) {
    Logger.error('Error removing reaction', error);
    responseHandler(res, 500, 'Error removing reaction');
  }
};