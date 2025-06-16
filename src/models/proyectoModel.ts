import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProyectoModel {
  /**
   * Obtener todos los proyectos
   */
  static async getAll() {
    return await prisma.proyecto.findMany({
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true
      },
      orderBy: {
        creado_en: 'desc'
      }
    });
  }

  /**
   * Obtener proyectos por estado de ganador
   */
  static async getByGanador(ganador: boolean) {
    return await prisma.proyecto.findMany({
      where: { ganador },
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true
      },
      orderBy: {
        creado_en: 'desc'
      }
    });
  }

  /**
   * Obtener un proyecto por ID
   */
  static async getById(id: number) {
    return await prisma.proyecto.findUnique({
      where: { id },
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true,
        usuarioProyectos: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Crear un nuevo proyecto
   */
  static async create(data: {
    titulo: string;
    descripcion: string;
    contacto_email?: string;
    contacto_campus?: string;
    convocatoriaId?: number;
    creadoPorId: number;
  }) {
    return await prisma.proyecto.create({
      data,
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true
      }
    });
  }

  /**
   * Actualizar un proyecto existente
   */
  static async update(
    id: number,
    data: {
      titulo?: string;
      descripcion?: string;
      contacto_email?: string;
      contacto_campus?: string;
      convocatoriaId?: number;
    }
  ) {
    return await prisma.proyecto.update({
      where: { id },
      data,
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true
      }
    });
  }

  /**
   * Eliminar un proyecto
   */
  static async delete(id: number) {
    // Primero eliminamos todas las relaciones en UsuarioProyecto
    await prisma.usuarioProyecto.deleteMany({
      where: { proyectoId: id }
    });

    // Luego eliminamos el proyecto
    return await prisma.proyecto.delete({
      where: { id }
    });
  }

  /**
   * Marcar un proyecto como ganador o no ganador
   */
  static async toggleGanador(id: number) {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id }
    });

    if (!proyecto) {
      return null;
    }

    return await prisma.proyecto.update({
      where: { id },
      data: { ganador: !proyecto.ganador },
      include: {
        creador: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        convocatoria: true
      }
    });
  }

  /**
   * Añadir un usuario a un proyecto
   */
  static async addUsuario(proyectoId: number, usuarioId: number) {
    return await prisma.usuarioProyecto.create({
      data: {
        proyectoId,
        usuarioId
      },
      include: {
        usuario: true,
        proyecto: true
      }
    });
  }

  /**
   * Eliminar un usuario de un proyecto
   */
  static async removeUsuario(proyectoId: number, usuarioId: number) {
    return await prisma.usuarioProyecto.deleteMany({
      where: {
        proyectoId,
        usuarioId
      }
    });
  }

  /**
   * Verificar si un usuario es el creador de un proyecto
   */
  static async isCreator(proyectoId: number, usuarioId: number) {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId },
      select: { creadoPorId: true }
    });

    return proyecto?.creadoPorId === usuarioId;
  }

  /**
   * Obtener proyectos de un usuario específico
   */
  static async getByUsuario(usuarioId: number) {
    return await prisma.proyecto.findMany({
      where: {
        creadoPorId: usuarioId
      },
      include: {
        convocatoria: true
      },
      orderBy: {
        creado_en: 'desc'
      }
    });
  }
}