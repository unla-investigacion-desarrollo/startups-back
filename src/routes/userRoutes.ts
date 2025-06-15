import { Router } from 'express';
import * as userController from '../controllers/userController';
import { isAdmin } from '../controllers/authController';
import { isAuthenticated } from '../controllers/authController';

const router = Router();

// Proteger todas las rutas con autenticación y permisos de administrador
router.use(isAuthenticated);
router.use(isAdmin);

// Rutas de administración de usuarios
router.get('/', userController.getAllUsers);
router.put('/update-role', userController.updateUserRole);

export default router;