import { Router } from 'express';
import * as convocatoriaController from '../controllers/convocatoriasController';
import { isAuthenticated, isStaff } from '../controllers/authController';

const router = Router();

// Rutas públicas
router.get('/', convocatoriaController.getAllConvocatorias);
router.get('/:id', convocatoriaController.getConvocatoriaById);
router.get('/:id/proyectos', convocatoriaController.getProyectosByConvocatoria);

// Rutas protegidas (requieren autenticación y rol de STAFF o ADMIN)
router.post('/', isAuthenticated, isStaff, convocatoriaController.createConvocatoria);
router.put('/:id', isAuthenticated, isStaff, convocatoriaController.updateConvocatoria);
router.delete('/:id', isAuthenticated, isStaff, convocatoriaController.deleteConvocatoria);
router.patch('/:id/toggle-abierta', isAuthenticated, isStaff, convocatoriaController.toggleConvocatoriaAbierta);

export default router;