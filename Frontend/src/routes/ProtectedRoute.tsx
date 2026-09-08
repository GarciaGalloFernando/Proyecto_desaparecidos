import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Protege las rutas del panel administrativo. Por ahora solo existe el rol
// ADMIN (login estático de frontend), por lo que basta con validar la sesión.
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const usuario = authRepository.getCurrentUser();

  if (!authRepository.isAuthenticated() || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== "ADMIN" && usuario.rol !== "SUPER_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
