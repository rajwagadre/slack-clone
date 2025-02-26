import prisma from '../config/db';
import { IWorkspaceCreate, IWorkspaceUpdate } from '../types/workspace';

export const createWorkspace = async (data: IWorkspaceCreate & { creatorId: string }) => {
  const { creatorId, ...workspaceData } = data;
  
  return await prisma.$transaction(async (tx) => {
    // Create the workspace
    const workspace = await tx.workspace.create({
      data: workspaceData
    });
    
    // Add the creator as a member with 'owner' role
    await tx.workspaceMember.create({
      data: {
        userId: creatorId,
        workspaceId: workspace.id,
        role: 'owner'
      }
    });
    
    // Create a default "general" channel
    await tx.channel.create({
      data: {
        name: 'general',
        description: 'General discussion',
        workspaceId: workspace.id,
        isPrivate: false,
        members: {
          create: {
            userId: creatorId
          }
        }
      }
    });
    
    return workspace;
  });
};

export const getWorkspaces = async () => {
  return await prisma.workspace.findMany({
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

export const getWorkspacesByUserId = async (userId: string) => {
  return await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId
        }
      }
    },
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

export const getWorkspaceById = async (id: string) => {
  return await prisma.workspace.findUnique({
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
      },
      channels: {
        where: {
          isPrivate: false
        }
      }
    }
  });
};

export const updateWorkspace = async (id: string, data: IWorkspaceUpdate) => {
  return await prisma.workspace.update({
    where: { id },
    data
  });
};

export const deleteWorkspace = async (id: string) => {
  return await prisma.workspace.delete({
    where: { id }
  });
};

export const isWorkspaceMember = async (workspaceId: string, userId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId
      }
    }
  });
  
  return !!member;
};

export const isWorkspaceAdmin = async (workspaceId: string, userId: string) => {
  const member = await prisma.workspaceMember.findUn
}