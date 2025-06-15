// Ejemplo de un controller si querés ya separar lógica
import { Request, Response } from 'express';

export const home = (req: Request, res: Response) => {
  res.json({ message: 'Hola desde el controller!' });
};
