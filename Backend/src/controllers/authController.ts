import type { RequestHandler } from "express";
import passport from "../passport/index.js";
import { signToken } from "../utils/jwt.js";

const safe = (a: Express.User) => ({
  id: String(a._id),
  nombre: a.nombre,
  carnet: a.carnet,
  email: a.email,
  rol: a.rol,
  estado: a.estado,
});

export const login: RequestHandler = (req, res, next) =>
  passport.authenticate(
    "local",
    { session: false },
    (
      error: Error | null,
      admin: Express.User | false,
      info?: { message?: string }
    ) => {

      if (error) {
        return next(error);
      }

      if (!admin) {
        return res.status(401).json({
          message: info?.message ?? "Credenciales inválidas.",
        });
      }

      return res.json({
        token: signToken({
          sub: String(admin._id),
          rol: admin.rol,
        }),

        admin: safe(admin),
      });
    }
  )(req, res, next);


export const me: RequestHandler = (req, res) =>
  res.json({
    admin: safe(req.user!),
  });


export const logout: RequestHandler = (_req, res) =>
  res.json({
    message:
      "Sesión cerrada. El cliente debe descartar el token JWT.",
  });