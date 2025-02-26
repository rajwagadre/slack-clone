import { body, param } from 'express-validator';

export const messageCreateValidator = [
  body('content')
    .notEmpty().withMessage('Message content is required')
    .isString().withMessage('Content must be a string'),
  
  body('channelId')
    .notEmpty().withMessage('Channel ID is required')
    .isUUID().withMessage('Invalid channel ID format')
];

export const directMessageCreateValidator = [
  body('content')
    .notEmpty().withMessage('Message content is required')
    .isString().withMessage('Content must be a string'),
  
  body('receiverId')
    .notEmpty().withMessage('Receiver ID is required')
    .isUUID().withMessage('Invalid receiver ID format')
];