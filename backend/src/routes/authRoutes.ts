import express from 'express';
import { googleLogin, register, login } from '../controllers/authController';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/register', register);
router.post('/login', login);

export default router; 