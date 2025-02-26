import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import { responseHandler } from '../utils/responseHandler';
import { IUserCreate, IUserLogin, IAuthResponse } from '../types/user';
import Logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const userData: IUserCreate = req.body;
    
    // Check if user already exists
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      return responseHandler(res, 400, 'User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    
    // Create user
    const user = await userService.createUser(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    const response: IAuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    responseHandler(res, 201, 'User registered successfully', response);
  } catch (error) {
    Logger.error('Error in register controller', error);
    responseHandler(res, 500, 'Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUserLogin = req.body;
    
    // Find user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return responseHandler(res, 401, 'Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseHandler(res, 401, 'Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    const response: IAuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    responseHandler(res, 200, 'Login successful', response);
  } catch (error) {
    Logger.error('Error in login controller', error);
    responseHandler(res, 500, 'Error during login');
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return responseHandler(res, 401, 'Not authenticated');
    }
    
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return responseHandler(res, 404, 'User not found');
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    responseHandler(res, 200, 'User retrieved successfully', userWithoutPassword);
  } catch (error) {
    Logger.error('Error in getMe controller', error);
    responseHandler(res, 500, 'Error retrieving user');
  }
};