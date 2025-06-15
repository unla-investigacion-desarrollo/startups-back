import { Router } from 'express';
import * as userController from '../controllers/userController';
import { isAdmin, isStaff, isAuthenticated } from '../controllers/authController';

const router = Router();

// Todas las rutas requieren autenticación primero
router.use(isAuthenticated);

// Ruta para obtener todos los usuarios - requiere ser STAFF o ADMIN
// Usamos una cadena de middlewares: primero verifica si está autenticado, luego si es staff
router.get('/', isStaff, userController.getAllUsers);

// Ruta para actualizar roles - solo para ADMIN
router.put('/update-role', isAdmin, userController.updateUserRole);

export default router;