import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);


export default router;