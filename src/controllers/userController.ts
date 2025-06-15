import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creado_en: true
        // Excluimos password por seguridad
      }
    });

    res.json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
};

// Actualizar el rol de un usuario (solo para administradores)
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, newRole } = req.body;

    // Validaciones
    if (!userId || !newRole) {
      res.status(400).json({ message: 'Se requiere userId y newRole' });
      return;
    }

    // Verificar roles válidos
    const validRoles = ['ADMIN', 'STAFF', 'FINAL'];
    if (!validRoles.includes(newRole)) {
      res.status(400).json({ message: `Rol inválido. Debe ser uno de: ${validRoles.join(', ')}` });
      return;
    }

    // No permitir cambiar el rol propio para evitar quedarse sin administradores
    if (userId === req.user?.id) {
      res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
      return;
    }

    // Actualizar el rol del usuario
    const updatedUser = await prisma.usuario.update({
      where: { id: Number(userId) },
      data: { rol: newRole },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true
      }
    });

    res.json({
      message: `Rol de usuario actualizado exitosamente a ${newRole}`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    
    // Manejo específico de errores
    if ((error as any).code === 'P2025') {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
  }
};