import { Request, Response } from 'express';
import { ConvocatoriaModel } from '../models/convocatoriaModel';

/**
 * Obtener todas las convocatorias
 */
export const getAllConvocatorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const convocatorias = await ConvocatoriaModel.getAll();
    res.json({ convocatorias });
  } catch (error) {
    console.error('Error al obtener convocatorias:', error);
    res.status(500).json({ message: 'Error al obtener las convocatorias' });
  }
};

/**
 * Obtener una convocatoria por ID
 */
export const getConvocatoriaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de convocatoria inválido' });
      return;
    }
    
    const convocatoria = await ConvocatoriaModel.getById(id);
    
    if (!convocatoria) {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
      return;
    }
    
    res.json({ convocatoria });
  } catch (error) {
    console.error('Error al obtener convocatoria:', error);
    res.status(500).json({ message: 'Error al obtener la convocatoria' });
  }
};

/**
 * Crear una nueva convocatoria
 * Solo usuarios STAFF y ADMIN pueden crear convocatorias
 */
export const createConvocatoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descripcion, abierta } = req.body;
    
    // Validaciones
    if (!titulo || !descripcion) {
      res.status(400).json({ 
        message: 'Los campos titulo y descripcion son requeridos' 
      });
      return;
    }
    
    // Crear la convocatoria
    const nuevaConvocatoria = await ConvocatoriaModel.create({
      titulo,
      descripcion,
      abierta
    });
    
    res.status(201).json({
      message: 'Convocatoria creada exitosamente',
      convocatoria: nuevaConvocatoria
    });
  } catch (error) {
    console.error('Error al crear convocatoria:', error);
    res.status(500).json({ message: 'Error al crear la convocatoria' });
  }
};

/**
 * Actualizar una convocatoria existente
 */
export const updateConvocatoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de convocatoria inválido' });
      return;
    }
    
    const { titulo, descripcion, abierta } = req.body;
    
    // Verificar que la convocatoria existe
    const convocatoriaExistente = await ConvocatoriaModel.getById(id);
    
    if (!convocatoriaExistente) {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
      return;
    }
    
    // Actualizar la convocatoria
    const convocatoriaActualizada = await ConvocatoriaModel.update(id, {
      titulo,
      descripcion,
      abierta
    });
    
    res.json({
      message: 'Convocatoria actualizada exitosamente',
      convocatoria: convocatoriaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar convocatoria:', error);
    res.status(500).json({ message: 'Error al actualizar la convocatoria' });
  }
};

/**
 * Eliminar una convocatoria
 */
export const deleteConvocatoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de convocatoria inválido' });
      return;
    }
    
    // Verificar si la convocatoria existe
    const convocatoria = await ConvocatoriaModel.getById(id);
    
    if (!convocatoria) {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
      return;
    }
    
    // Verificar si tiene proyectos asociados
    const tieneProyectos = await ConvocatoriaModel.tieneProyectos(id);
    
    if (tieneProyectos) {
      res.status(400).json({ 
        message: 'No se puede eliminar la convocatoria porque tiene proyectos asociados' 
      });
      return;
    }
    
    // Eliminar la convocatoria
    await ConvocatoriaModel.delete(id);
    
    res.json({ message: 'Convocatoria eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar convocatoria:', error);
    res.status(500).json({ message: 'Error al eliminar la convocatoria' });
  }
};

/**
 * Cambiar el estado de abierta/cerrada de una convocatoria
 */
export const toggleConvocatoriaAbierta = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de convocatoria inválido' });
      return;
    }
    
    const convocatoriaActualizada = await ConvocatoriaModel.toggleAbierta(id);
    
    if (!convocatoriaActualizada) {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
      return;
    }
    
    res.json({
      message: `Convocatoria ${convocatoriaActualizada.abierta ? 'abierta' : 'cerrada'} exitosamente`,
      convocatoria: convocatoriaActualizada
    });
  } catch (error) {
    console.error('Error al cambiar estado de convocatoria:', error);
    res.status(500).json({ message: 'Error al cambiar el estado de la convocatoria' });
  }
};

/**
 * Obtener proyectos por convocatoria
 */
export const getProyectosByConvocatoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de convocatoria inválido' });
      return;
    }
    
    const proyectos = await ConvocatoriaModel.getProyectos(id);
    
    res.json({ proyectos });
  } catch (error) {
    console.error('Error al obtener proyectos por convocatoria:', error);
    res.status(500).json({ message: 'Error al obtener los proyectos de la convocatoria' });
  }
};