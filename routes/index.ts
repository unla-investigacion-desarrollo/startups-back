import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Acá después agregás: router.use('/proyectos', proyectosRouter)
// router.use('/auth', authRouter) etc.

export default router;
