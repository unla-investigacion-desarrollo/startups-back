import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Modelo para operaciones relacionadas con convocatorias
 */
export class ConvocatoriaModel {
  /**
   * Obtiene todas las convocatorias
   */
  static async getAll() {
    return await prisma.convocatoria.findMany({
      orderBy: {
        creada_en: 'desc'
      }
    });
  }
  
  /**
   * Obtiene una convocatoria por ID
   */
  static async getById(id: number) {
    return await prisma.convocatoria.findUnique({
      where: { id },
      include: {
        proyectos: true
      }
    });
  }
  
  /**
   * Crea una nueva convocatoria
   */
  static async create(data: { titulo: string; descripcion: string; abierta?: boolean }) {
    return await prisma.convocatoria.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        abierta: data.abierta ?? true
      }
    });
  }
  
  /**
   * Actualiza una convocatoria existente
   */
  static async update(id: number, data: { titulo?: string; descripcion?: string; abierta?: boolean }) {
    return await prisma.convocatoria.update({
      where: { id },
      data
    });
  }
  
  /**
   * Elimina una convocatoria
   */
  static async delete(id: number) {
    return await prisma.convocatoria.delete({
      where: { id }
    });
  }
  
  /**
   * Cambia el estado abierta/cerrada de una convocatoria
   */
  static async toggleAbierta(id: number) {
    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id }
    });
    
    if (!convocatoria) {
      return null;
    }
    
    return await prisma.convocatoria.update({
      where: { id },
      data: { abierta: !convocatoria.abierta }
    });
  }
  
  /**
   * Obtiene los proyectos de una convocatoria
   */
  static async getProyectos(convocatoriaId: number) {
    return await prisma.proyecto.findMany({
      where: {
        convocatoriaId
      },
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });
  }
  
  /**
   * Verifica si una convocatoria tiene proyectos
   */
  static async tieneProyectos(id: number) {
    const proyectos = await prisma.proyecto.findMany({
      where: { convocatoriaId: id },
      select: { id: true }
    });
    
    return proyectos.length > 0;
  }
}