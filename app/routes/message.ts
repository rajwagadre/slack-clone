import { Router } from 'express';
import * as messageController from '../controllers/message';
import { messageCreateValidator, directMessageCreateValidator } from '../validators';
import { validate } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Channel messages
router.post('/', authenticate, messageCreateValidator, validate, messageController.createMessage);
router.get('/channel/:channelId', authenticate, messageController.getChannelMessages);

// Direct messages
router.post('/direct', authenticate, directMessageCreateValidator, validate, messageController.createDirectMessage);
router.get('/direct/:userId', authenticate, messageController.getDirectMessages);

// Reactions
router.post('/reaction', authenticate, messageController.addReaction);
router.delete('/reaction/:messageId/:emoji', authenticate, messageController.removeReaction);

export default router;