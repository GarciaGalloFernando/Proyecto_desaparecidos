import type { RequestHandler } from "express";
import passport from "../passport/index.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (error: any, user: Express.User | false, info: any) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(401).json({
          message: "No autenticado",
          detalle: info?.message ?? "Token inválido o ausente."
        });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (
    !req.user ||
    !["ADMIN", "SUPER_ADMIN"].includes(req.user.rol)
  ) {
    return res.status(403).json({
      message: "No tiene permisos para esta acción."
    });
  }

  next();
};