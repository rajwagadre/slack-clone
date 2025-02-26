import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../utils/responseHandler';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseHandler(res, 400, 'Validation error', { errors: errors.array() });
  }
  next();
};

export * from './auth.validator';
export * from './user.validator';
export * from './workspace.validators';
export * from './channel.validators';
export * from './message.validatoor';