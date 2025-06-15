import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes/index';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

import { configurePassport } from './config/passport';

// Declara los módulos para TypeScript
declare global {
  namespace Express {
    interface User {
      id: number;
      nombre: string;
      email: string;
      rol: string;
    }
  }
}

const app: Application = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',  // URL del frontend
  credentials: true
}));

// Configurar sesión
app.use(session({
  secret: 'unla-startups-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Rutas
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

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