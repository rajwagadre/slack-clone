export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  avatar?: string;
  status?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}