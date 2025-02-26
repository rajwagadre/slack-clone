export interface IChannel {
    id: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    workspaceId: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface IChannelCreate {
    name: string;
    description?: string;
    isPrivate?: boolean;
    workspaceId: string;
  }
  
  export interface IChannelUpdate {
    name?: string;
    description?: string;
    isPrivate?: boolean;
  }
  
  export interface IChannelMember {
    id: string;
    userId: string;
    channelId: string;
    created_at?: Date;
    updated_at?: Date;
  }