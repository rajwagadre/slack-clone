import { Router } from 'express';
import * as authController from '../controllers/auth';
import { registerValidator, loginValidator } from '../validators';
import { validate } from '../validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;