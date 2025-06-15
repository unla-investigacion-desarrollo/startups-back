import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import routes from './routes/index';

const app: Application = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta por defecto
app.get('/', (req: Request, res: Response) => {
  res.send('Bienvenido a la API de Proyectos 🚀');
});

// Manejo de errores simples
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});

export default app;