import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { responseHandler } from '../utils/responseHandler';

interface DecodedToken {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseHandler(res, 401, 'Authentication required');
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as DecodedToken;
    
    req.user = decoded;
    next();
  } catch (error) {
    return responseHandler(res, 401, 'Invalid or expired token');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // This would typically check if the user has admin role
  // For now, we'll just pass through as we don't have roles defined yet
  next();
};