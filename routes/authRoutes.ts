import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';

const router = express.Router();

// Esta ruta debería usar el middleware de autenticación de passport
router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

router.post('/register', authController.register);
export default router;