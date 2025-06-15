import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const configurePassport = (): void => {
  // Estrategia Local con configuración personalizada
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',    // Cambiar aquí: usar 'email' en vez de 'username'
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await prisma.usuario.findUnique({
          where: { email }
        });
        
        if (!user) {
          return done(null, false, { message: 'Usuario incorrecto' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // El resto queda igual
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.usuario.findUnique({
        where: { id }
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};