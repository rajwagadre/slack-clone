import { Router } from 'express';
import * as workspaceController from '../controllers/workspace';
import { workspaceCreateValidator, workspaceUpdateValidator } from '../validators';
import { validate } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, workspaceCreateValidator, validate, workspaceController.createWorkspace);
router.get('/', authenticate, workspaceController.getWorkspaces);
router.get('/:id', authenticate, workspaceController.getWorkspaceById);
router.put('/:id', authenticate, workspaceUpdateValidator, validate, workspaceController.updateWorkspace);
router.delete('/:id', authenticate, workspaceController.deleteWorkspace);

router.post('/members', authenticate, workspaceController.addWorkspaceMember);
router.delete('/:workspaceId/members/:userId', authenticate, workspaceController.removeWorkspaceMember);

export default router;