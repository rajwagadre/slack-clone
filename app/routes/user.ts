import { Router } from 'express';
import * as userController from '../controllers/user';
import { userUpdateValidator } from '../validators';
import { validate } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, userController.getUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userUpdateValidator, validate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;