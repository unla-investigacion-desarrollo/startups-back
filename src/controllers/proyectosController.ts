import { Request, Response } from 'express';
import { ProyectoModel } from '../models/proyectoModel';
import { ConvocatoriaModel } from '../models/convocatoriaModel';

/**
 * Obtener todos los proyectos
 */
export const getAllProyectos = async (req: Request, res: Response): Promise<void> => {
  try {
    const proyectos = await ProyectoModel.getAll();
    res.json({ proyectos });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ message: 'Error al obtener los proyectos' });
  }
};

/**
 * Obtener proyectos ganadores
 */
export const getProyectosGanadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const proyectos = await ProyectoModel.getByGanador(true);
    res.json({ proyectos });
  } catch (error) {
    console.error('Error al obtener proyectos ganadores:', error);
    res.status(500).json({ message: 'Error al obtener los proyectos ganadores' });
  }
};

/**
 * Obtener un proyecto por ID
 */
export const getProyectoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de proyecto inválido' });
      return;
    }
    
    const proyecto = await ProyectoModel.getById(id);
    
    if (!proyecto) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    
    res.json({ proyecto });
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

/**
 * Crear un nuevo proyecto
 * Los usuarios FINAL deben poder crear proyectos
 */
export const createProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descripcion, contacto_email, contacto_campus, convocatoriaId } = req.body;
    
    // Validaciones
    if (!titulo || !descripcion) {
      res.status(400).json({ 
        message: 'Los campos titulo y descripcion son requeridos' 
      });
      return;
    }
    
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      res.status(401).json({ message: 'Debes iniciar sesión para crear un proyecto' });
      return;
    }
    
    const creadoPorId = req.user.id;
    
    // Si se especificó una convocatoria, verificar que exista y esté abierta
    if (convocatoriaId) {
      const convocatoria = await ConvocatoriaModel.getById(Number(convocatoriaId));
      
      if (!convocatoria) {
        res.status(404).json({ message: 'Convocatoria no encontrada' });
        return;
      }
      
      if (!convocatoria.abierta) {
        res.status(400).json({ message: 'Esta convocatoria ya no está abierta para nuevos proyectos' });
        return;
      }
    }
    
    // Crear el proyecto
    const nuevoProyecto = await ProyectoModel.create({
      titulo,
      descripcion,
      contacto_email,
      contacto_campus,
      convocatoriaId: convocatoriaId ? Number(convocatoriaId) : undefined,
      creadoPorId
    });
    
    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      proyecto: nuevoProyecto
    });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};

/**
 * Actualizar un proyecto existente
 * Solo el creador o un STAFF/ADMIN puede actualizar un proyecto
 */
export const updateProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de proyecto inválido' });
      return;
    }
    
    const { titulo, descripcion, contacto_email, contacto_campus, convocatoriaId } = req.body;
    
    // Verificar que el proyecto existe
    const proyectoExistente = await ProyectoModel.getById(id);
    
    if (!proyectoExistente) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    
    // Verificar que el usuario sea el creador o STAFF/ADMIN
    const userId = req.user?.id;
    const userRol = req.user?.rol;
    
    const isCreator = proyectoExistente.creadoPorId === userId;
    const isAdminOrStaff = userRol === 'STAFF' || userRol === 'ADMIN';
    
    if (!isCreator && !isAdminOrStaff) {
      res.status(403).json({ message: 'No tienes permiso para actualizar este proyecto' });
      return;
    }
    
    // Si se cambia la convocatoria, verificar que exista y esté abierta
    if (convocatoriaId && convocatoriaId !== proyectoExistente.convocatoriaId) {
      const convocatoria = await ConvocatoriaModel.getById(Number(convocatoriaId));
      
      if (!convocatoria) {
        res.status(404).json({ message: 'Convocatoria no encontrada' });
        return;
      }
      
      if (!convocatoria.abierta) {
        res.status(400).json({ message: 'Esta convocatoria ya no está abierta para nuevos proyectos' });
        return;
      }
    }
    
    // Actualizar el proyecto
    const proyectoActualizado = await ProyectoModel.update(id, {
      titulo,
      descripcion,
      contacto_email,
      contacto_campus,
      convocatoriaId: convocatoriaId ? Number(convocatoriaId) : undefined
    });
    
    res.json({
      message: 'Proyecto actualizado exitosamente',
      proyecto: proyectoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar el proyecto' });
  }
};

/**
 * Eliminar un proyecto
 * Solo el creador o un ADMIN puede eliminar un proyecto
 */
export const deleteProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de proyecto inválido' });
      return;
    }
    
    // Verificar que el proyecto existe
    const proyecto = await ProyectoModel.getById(id);
    
    if (!proyecto) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    
    // Verificar que el usuario sea el creador o un ADMIN
    const userId = req.user?.id;
    const userRol = req.user?.rol;
    
    const isCreator = proyecto.creadoPorId === userId;
    const isAdmin = userRol === 'ADMIN';
    
    if (!isCreator && !isAdmin) {
      res.status(403).json({ message: 'No tienes permiso para eliminar este proyecto' });
      return;
    }
    
    // Eliminar el proyecto
    await ProyectoModel.delete(id);
    
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

/**
 * Marcar un proyecto como ganador o quitar esta marca
 * Solo STAFF y ADMIN pueden marcar proyectos como ganadores
 */
export const toggleProyectoGanador = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de proyecto inválido' });
      return;
    }
    
    const proyectoActualizado = await ProyectoModel.toggleGanador(id);
    
    if (!proyectoActualizado) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    
    res.json({
      message: `Proyecto ${proyectoActualizado.ganador ? 'marcado como ganador' : 'desmarcado como ganador'} exitosamente`,
      proyecto: proyectoActualizado
    });
  } catch (error) {
    console.error('Error al cambiar estado de ganador:', error);
    res.status(500).json({ message: 'Error al cambiar el estado de ganador del proyecto' });
  }
};

/**
 * Obtener proyectos del usuario actual
 */
export const getMisProyectos = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Debes iniciar sesión para ver tus proyectos' });
      return;
    }
    
    const proyectos = await ProyectoModel.getByUsuario(req.user.id);
    
    res.json({ proyectos });
  } catch (error) {
    console.error('Error al obtener proyectos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener tus proyectos' });
  }
};