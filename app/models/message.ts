import prisma from '../config/db';
import { IMessageCreate, IDirectMessageCreate } from '../types/message';

export const createMessage = async (data: IMessageCreate) => {
  return await prisma.message.create({
    data,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      }
    }
  });
};

export const getChannelMessages = async (channelId: string, limit: number = 50, before?: string) => {
  const whereClause: any = { channelId };
  
  if (before) {
    whereClause.created_at = {
      lt: new Date(before)
    };
  }
  
  return await prisma.message.findMany({
    where: whereClause,
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      reactions: {
        include: {
          message: true
        }
      }
    }
  });
};

export const createDirectMessage = async (data: IDirectMessageCreate) => {
  return await prisma.directMessage.create({
    data,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      }
    }
  });
};

export const getDirectMessages = async (
  userId1: string, 
  userId2: string, 
  limit: number = 50, 
  before?: string
) => {
  const whereClause: any = {
    OR: [
      {
        senderId: userId1,
        receiverId: userId2
      },
      {
        senderId: userId2,
        receiverId: userId1
      }
    ]
  };
  
  if (before) {
    whereClause.created_at = {
      lt: new Date(before)
    };
  }
  
  return await prisma.directMessage.findMany({
    where: whereClause,
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      reactions: true
    }
  });
};

export const addReaction = async (data: { userId: string; messageId?: string; directMessageId?: string; emoji: string }) => {
  return await prisma.reaction.create({
    data,
    include: {
      message: true,
      directMessage: true
    }
  });
};

export const removeReaction = async (messageId: string, userId: string, emoji: string) => {
  return await prisma.reaction.deleteMany({
    where: {
      messageId,
      userId,
      emoji
    }
  });
};