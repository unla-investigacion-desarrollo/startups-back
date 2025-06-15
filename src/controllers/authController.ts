import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import passport from 'passport';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Comprobar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe con ese email' });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol
      }
    });

    // Excluir la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

export const login = (req: Request, res: Response): void => {
  res.json({ message: 'Login exitoso', user: req.user });
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.json({ message: 'Sesión cerrada' });
  });
};

export const getCurrentUser = (req: Request, res: Response): void => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Inicia sesión para realizar esta acción' });
};

