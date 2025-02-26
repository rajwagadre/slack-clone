import { body, param } from 'express-validator';

export const userUpdateValidator = [
  param('id')
    .isUUID().withMessage('Invalid user ID format'),
  
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid'),
  
  body('status')
    .optional()
    .isIn(['active', 'away', 'offline']).withMessage('Status must be active, away, or offline')
];