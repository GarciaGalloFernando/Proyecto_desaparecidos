import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usuarioActual = authRepository.getCurrentUser();
  if (usuarioActual) {
    const destino =
      usuarioActual.rol === "ADMIN" || usuarioActual.rol === "SUPER_ADMIN"
        ? "/admin/personas"
        : "/";
    return <Navigate to={destino} replace />;
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    setIsSubmitting(true);
    try {
      const usuario = await authRepository.login(credentials);
      const destino =
        usuario.rol === "ADMIN" || usuario.rol === "SUPER_ADMIN" ? "/admin/personas" : "/";
      navigate(destino, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No fue posible iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        <button
          type="button"
          className="brand auth-brand"
          onClick={() => navigate("/")}
          aria-label="Ir al inicio"
        >
          <span className="brand-logo">
            <img src="/logo.png" alt="" />
          </span>

          <span>
            <strong>Personas Desaparecidas</strong>
            <small>Sucre</small>
          </span>
        </button>

        <div className="auth-heading">
          <span className="eyebrow">ACCESO AL SISTEMA</span>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa tus credenciales para acceder al panel de administración.</p>
        </div>

        <LoginForm error={error} isSubmitting={isSubmitting} onSubmit={handleLogin} />

        <button
          type="button"
          className="auth-back"
          onClick={() => navigate("/")}
        >
          ← Volver al inicio
        </button>

      </div>
    </main>
  );
}
export default LoginPage;
