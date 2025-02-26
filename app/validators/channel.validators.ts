import { body, param } from 'express-validator';

export const channelCreateValidator = [
  body('name')
    .notEmpty().withMessage('Channel name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean'),
  
  body('workspaceId')
    .notEmpty().withMessage('Workspace ID is required')
    .isUUID().withMessage('Invalid workspace ID format')
];

export const channelUpdateValidator = [
  param('id')
    .isUUID().withMessage('Invalid channel ID format'),
  
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean')
];