import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";

interface LoginFormProps {
  error?: string;
  isSubmitting: boolean;
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
}

function LoginForm({ error, isSubmitting, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedCarnet = carnet.trim();

    if (!normalizedCarnet || !password) {
      return;
    }

    void onSubmit({
      carnet: normalizedCarnet,
      password,
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      <div className="field-group">
        <label htmlFor="carnet">Carnet de identidad (CI)</label>

        <input
          id="carnet"
          name="carnet"
          type="text"
          inputMode="numeric"
          value={carnet}
          onChange={(event) => setCarnet(event.target.value)}
          placeholder="Ingrese su CI"
          autoComplete="username"
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="password">Contraseña</label>

        <div className="password-input">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-large auth-submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>

    </form>
  );
}

export default LoginForm;
