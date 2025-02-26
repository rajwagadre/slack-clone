import prisma from '../config/db';
import { IChannelCreate, IChannelUpdate } from '../types/channel';

export const createChannel = async (data: IChannelCreate) => {
  return await prisma.channel.create({
    data
  });
};

export const getChannelsByWorkspace = async (workspaceId: string, userId: string) => {
  // Get all public channels in the workspace
  const publicChannels = await prisma.channel.findMany({
    where: {
      workspaceId,
      isPrivate: false
    }
  });
  
  // Get all private channels the user is a member of
  const privateChannels = await prisma.channel.findMany({
    where: {
      workspaceId,
      isPrivate: true,
      members: {
        some: {
          userId
        }
      }
    }
  });
  
  return [...publicChannels, ...privateChannels];
};

export const getChannelById = async (id: string) => {
  return await prisma.channel.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      }
    }
  });
};

export const updateChannel = async (id: string, data: IChannelUpdate) => {
  return await prisma.channel.update({
    where: { id },
    data
  });
};

export const deleteChannel = async (id: string) => {
  return await prisma.channel.delete({
    where: { id }
  });
};

export const isChannelMember = async (channelId: string, userId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId }
  });
  
  // If channel is public, user has access
  if (channel && !channel.isPrivate) {
    return true;
  }
  
  // Otherwise, check if user is a member
  const member = await prisma.channelMember.findUnique({
    where: {
      userId_channelId: {
        userId,
        channelId
      }
    }
  });
  
  return !!member;
};

export const addChannelMember = async (channelId: string, userId: string) => {
  return await prisma.channelMember.create({
    data: {
      userId,
      channelId
    },
    include: {
      user: {
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

export const removeChannelMember = async (channelId: string, userId: string) => {
  return await prisma.channelMember.delete({
    where: {
      userId_channelId: {
        userId,
        channelId
      }
    }
  });
};