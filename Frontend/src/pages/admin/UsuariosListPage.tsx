import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../../components/admin/ConfirmDialog";
import EstadoUsuarioBadge from "../../components/admin/EstadoUsuarioBadge";
import RolBadge from "../../components/admin/RolBadge";
import { authRepository } from "../../repositories/authRepository";
import { usuarioAdminRepository } from "../../repositories/usuarioAdminRepository";
import { ROLES_USUARIO, type UsuarioAdmin } from "../../types/usuarioAdmin";

function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";

  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "—";

  return valor.toLocaleDateString("es-BO");
}

function UsuariosListPage() {
  const navigate = useNavigate();
  const usuarioActual = authRepository.getCurrentUser();

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [usuarioCambiarEstado, setUsuarioCambiarEstado] = useState<UsuarioAdmin | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorCambiarEstado, setErrorCambiarEstado] = useState("");

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const resultado = await usuarioAdminRepository.listar();
      setUsuarios(resultado);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible cargar los usuarios.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const coincideTexto =
        !texto ||
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.email.toLowerCase().includes(texto) ||
        usuario.carnet.toLowerCase().includes(texto);

      const coincideRol = !filtroRol || usuario.rol === filtroRol;
      const coincideEstado = !filtroEstado || usuario.estado === filtroEstado;

      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroRol("");
    setFiltroEstado("");
  };

  const esUsuarioActual = (usuario: UsuarioAdmin) =>
    usuarioActual?.email.toLowerCase() === usuario.email.toLowerCase();

  const confirmarCambioEstado = async () => {
    if (!usuarioCambiarEstado) return;

    try {
      setCambiandoEstado(true);
      setErrorCambiarEstado("");

      const nuevoEstado = usuarioCambiarEstado.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      const actualizado = await usuarioAdminRepository.cambiarEstado(
        usuarioCambiarEstado.id,
        nuevoEstado,
      );

      setUsuarios((prev) =>
        prev.map((usuario) => (usuario.id === actualizado.id ? actualizado : usuario)),
      );
      setUsuarioCambiarEstado(null);
    } catch (err) {
      setErrorCambiarEstado(
        err instanceof Error ? err.message : "No fue posible actualizar el estado.",
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">GESTIÓN DE USUARIOS</span>
          <h1>Usuarios administradores</h1>
          <p>
            Consulta, crea, edita y activa o desactiva a las personas con
            acceso administrativo a la plataforma. (Datos de prueba, sin
            conexión a backend real.)
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={() => navigate("/admin/usuarios/nuevo")}
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="admin-filters">
        <div className="search-field search-field-large">
          <label htmlFor="busqueda-usuario">Buscar</label>
          <input
            id="busqueda-usuario"
            type="text"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Nombre, carnet o correo"
          />
        </div>

        <div className="search-field">
          <label htmlFor="filtro-rol">Rol</label>
          <select
            id="filtro-rol"
            value={filtroRol}
            onChange={(event) => setFiltroRol(event.target.value)}
          >
            <option value="">Todos</option>
            {ROLES_USUARIO.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="filtro-estado-usuario">Estado</label>
          <select
            id="filtro-estado-usuario"
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
          >
            <option value="">Todos</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <div className="search-buttons">
          <button type="button" className="btn btn-light" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>
      </div>

      {loading && (
        <div className="state-message">
          <div className="loader"></div>
          <p>Cargando usuarios...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-message error-message">
          <h3>No se pudieron cargar los usuarios</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => void cargarUsuarios()}>
            Intentar nuevamente
          </button>
        </div>
      )}

      {!loading && !error && usuariosFiltrados.length === 0 && (
        <div className="state-message">
          <div className="empty-icon">⌕</div>
          <h3>No se encontraron usuarios</h3>
          <p>Ajusta los filtros o crea un nuevo usuario.</p>
        </div>
      )}

      {!loading && !error && usuariosFiltrados.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table admin-table-compact">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carnet</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th aria-label="Acciones"></th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((usuario) => {
                const esActual = esUsuarioActual(usuario);

                return (
                  <tr key={usuario.id}>
                    <td>
                      <strong>{usuario.nombre}</strong>
                      {esActual && <span className="table-muted"> (tú)</span>}
                    </td>

                    <td>{usuario.carnet || "—"}</td>

                    <td>{usuario.email}</td>

                    <td>
                      <RolBadge rol={usuario.rol} />
                    </td>

                    <td>
                      <EstadoUsuarioBadge estado={usuario.estado} />
                    </td>

                    <td>{formatearFecha(usuario.fechaCreacion)}</td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-light btn-small"
                          onClick={() => navigate(`/admin/usuarios/${usuario.id}/editar`)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className={`btn btn-small ${usuario.estado === "ACTIVO" ? "btn-danger-outline" : "btn-success-outline"}`}
                          onClick={() => {
                            setErrorCambiarEstado("");
                            setUsuarioCambiarEstado(usuario);
                          }}
                          disabled={esActual}
                          title={esActual ? "No puedes desactivar tu propia cuenta" : undefined}
                        >
                          {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {usuarioCambiarEstado && (
        <ConfirmDialog
          title={usuarioCambiarEstado.estado === "ACTIVO" ? "Desactivar usuario" : "Activar usuario"}
          message={
            usuarioCambiarEstado.estado === "ACTIVO"
              ? `¿Deseas desactivar a ${usuarioCambiarEstado.nombre}? No podrá iniciar sesión mientras esté inactivo.`
              : `¿Deseas activar a ${usuarioCambiarEstado.nombre}? Podrá volver a iniciar sesión.`
          }
          confirmLabel={usuarioCambiarEstado.estado === "ACTIVO" ? "Desactivar" : "Activar"}
          danger={usuarioCambiarEstado.estado === "ACTIVO"}
          isSubmitting={cambiandoEstado}
          error={errorCambiarEstado}
          onConfirm={() => void confirmarCambioEstado()}
          onCancel={() => setUsuarioCambiarEstado(null)}
        />
      )}
    </div>
  );
}

export default UsuariosListPage;
