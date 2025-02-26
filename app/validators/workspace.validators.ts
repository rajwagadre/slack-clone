import { body, param } from 'express-validator';

export const workspaceCreateValidator = [
  body('name')
    .notEmpty().withMessage('Workspace name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
];

export const workspaceUpdateValidator = [
  param('id')
    .isUUID().withMessage('Invalid workspace ID format'),
  
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
];