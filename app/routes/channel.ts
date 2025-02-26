import { Router } from 'express';
import * as channelController from '../controllers/channel';
import { channelCreateValidator, channelUpdateValidator } from '../validators';
import { validate } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, channelCreateValidator, validate, channelController.createChannel);
router.get('/workspace/:workspaceId', authenticate, channelController.getChannelsByWorkspace);
router.get('/:id', authenticate, channelController.getChannelById);
router.put('/:id', authenticate, channelUpdateValidator, validate, channelController.updateChannel);
router.delete('/:id', authenticate, channelController.deleteChannel);

router.post('/members', authenticate, channelController.addChannelMember);
router.delete('/:channelId/members/:userId', authenticate, channelController.removeChannelMember);

export default router;