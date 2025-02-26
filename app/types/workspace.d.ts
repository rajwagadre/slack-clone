export interface IWorkspace {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface IWorkspaceCreate {
    name: string;
    description?: string;
    icon?: string;
  }
  
  export interface IWorkspaceUpdate {
    name?: string;
    description?: string;
    icon?: string;
  }
  
  export interface IWorkspaceMember {
    id: string;
    userId: string;
    workspaceId: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;
  }