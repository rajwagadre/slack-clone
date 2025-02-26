import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import workspaceRoutes from './workspace';
import channelRoutes from './channel';
import messageRoutes from './message';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/channels', channelRoutes);
router.use('/messages', messageRoutes);

export default router;