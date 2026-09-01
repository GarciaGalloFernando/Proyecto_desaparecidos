import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (authRepository.isAuthenticated()) return <Navigate to="/" replace />;

  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    setIsSubmitting(true);
    try {
      await authRepository.login(credentials);
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No fue posible iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main><LoginForm error={error} isSubmitting={isSubmitting} onSubmit={handleLogin} /></main>;
}
export default LoginPage;
