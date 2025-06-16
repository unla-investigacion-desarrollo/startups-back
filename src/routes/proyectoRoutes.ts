import { Router } from 'express';
import * as proyectoController from '../controllers/proyectosController';
import { isAuthenticated, isAdmin, isStaff } from '../controllers/authController';

const router = Router();

// Rutas públicas
router.get('/', proyectoController.getAllProyectos);
router.get('/ganadores', proyectoController.getProyectosGanadores);
router.get('/:id', proyectoController.getProyectoById);

// Rutas que requieren autenticación
router.use(isAuthenticated);

// Rutas para usuarios autenticados
router.get('/usuario/mis-proyectos', proyectoController.getMisProyectos);
router.post('/', proyectoController.createProyecto);
router.put('/:id', proyectoController.updateProyecto);
router.delete('/:id', proyectoController.deleteProyecto);

// Rutas solo para STAFF y ADMIN
router.patch('/:id/toggle-ganador', isStaff, proyectoController.toggleProyectoGanador);

export default router;