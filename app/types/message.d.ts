export interface IMessage {
    id: string;
    content: string;
    senderId: string;
    channelId: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface IMessageCreate {
    content: string;
    senderId: string;
    channelId: string;
  }
  
  export interface IDirectMessage {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface IDirectMessageCreate {
    content: string;
    senderId: string;
    receiverId: string;
  }