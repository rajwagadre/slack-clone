import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];