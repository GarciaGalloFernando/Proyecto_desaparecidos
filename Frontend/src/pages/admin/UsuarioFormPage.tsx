import { useEffect, useState } from "react";
import type { FormEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { usuarioAdminRepository } from "../../repositories/usuarioAdminRepository";
import { ROLES_USUARIO, type RolUsuario, type UsuarioFormData } from "../../types/usuarioAdmin";

const FORM_INICIAL: UsuarioFormData = {
  nombre: "",
  carnet: "",
  email: "",
  rol: "ADMIN",
  password: "",
};

function UsuarioFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const modoEdicion = Boolean(id);

  const [form, setForm] = useState<UsuarioFormData>(FORM_INICIAL);
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(modoEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const cargarUsuario = async () => {
      try {
        setCargando(true);
        setError("");

        const usuario = await usuarioAdminRepository.obtener(id);
        if (cancelado) return;

        if (!usuario) {
          setError("El usuario que intenta editar no existe.");
          return;
        }

        setForm({
          nombre: usuario.nombre,
          carnet: usuario.carnet,
          email: usuario.email,
          rol: usuario.rol,
          password: "",
        });
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error ? err.message : "No fue posible cargar el usuario.",
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargarUsuario();

    return () => {
      cancelado = true;
    };
  }, [id]);

  const setCampo = <K extends keyof UsuarioFormData>(campo: K, valor: UsuarioFormData[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.nombre.trim()) {
      setError('El campo "Nombre completo" es obligatorio.');
      return;
    }

    if (!form.carnet.trim()) {
      setError('El campo "Carnet de identidad" es obligatorio.');
      return;
    }

    if (!form.email.trim()) {
      setError('El campo "Correo electrónico" es obligatorio.');
      return;
    }

    // La contraseña es obligatoria solo al crear; al editar puede dejarse
    // en blanco para no cambiarla.
    if (!modoEdicion && !form.password) {
      setError("Debes definir una contraseña temporal para el nuevo usuario.");
      return;
    }

    if (form.password && form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password && form.password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setGuardando(true);

      if (modoEdicion && id) {
        await usuarioAdminRepository.actualizar(id, form);
      } else {
        await usuarioAdminRepository.crear(form);
      }

      navigate("/admin/usuarios", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible guardar el usuario.",
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="state-message">
        <div className="loader"></div>
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">
            {modoEdicion ? "EDITAR USUARIO" : "NUEVO USUARIO"}
          </span>
          <h1>{modoEdicion ? "Editar usuario administrador" : "Nuevo usuario administrador"}</h1>
          <p>
            {modoEdicion
              ? "Actualiza los datos de acceso de este usuario."
              : "Registra a una nueva persona con acceso administrativo."}
          </p>
        </div>
      </div>

      <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
        <section className="admin-form-section">
          <h2>Datos del usuario</h2>

          <div className="admin-form-grid">
            <div className="field-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={(event) => setCampo("nombre", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="carnet">Carnet de identidad</label>
              <input
                id="carnet"
                type="text"
                value={form.carnet}
                onChange={(event) => setCampo("carnet", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setCampo("email", event.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                value={form.rol}
                onChange={(event) => setCampo("rol", event.target.value as RolUsuario)}
              >
                {ROLES_USUARIO.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Acceso</h2>
          <p className="admin-form-hint">
            {modoEdicion
              ? "Deja estos campos en blanco si no deseas cambiar la contraseña."
              : "Define una contraseña temporal. El usuario podrá cambiarla luego."}
          </p>

          <div className="admin-form-grid">
            <div className="field-group">
              <label htmlFor="password">
                {modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setCampo("password", event.target.value)}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="field-group">
              <label htmlFor="confirmarPassword">Confirmar contraseña</label>
              <input
                id="confirmarPassword"
                type="password"
                value={confirmarPassword}
                onChange={(event) => setConfirmarPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="form-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate("/admin/usuarios")}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button type="submit" className="btn btn-primary btn-large" disabled={guardando}>
            {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioFormPage;
