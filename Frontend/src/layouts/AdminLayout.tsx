import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "../logo-policia.css";

function AdminLayout() {
  const navigate = useNavigate();
  const usuario = authRepository.getCurrentUser();

  const cerrarSesion = async () => {
    await authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button
          type="button"
          className="brand admin-brand"
          onClick={() => navigate("/")}
          aria-label="Ir al inicio"
        >
          <span className="brand-logo">
            <img src="/logo-policia.jpeg" alt="Logo de la Policía Boliviana" />
          </span>

          <span>
            <strong>Personas Desaparecidas</strong>
            <small>Panel administrativo</small>
          </span>
        </button>

        <nav className="admin-nav">
          <NavLink
            to="/admin/personas"
            className={({ isActive }) =>
              `admin-nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">☰</span>
            <span>Personas desaparecidas</span>
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              `admin-nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">◈</span>
            <span>Gestión de usuarios</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <p>
            Los registros se gestionan directamente mediante el backend y MongoDB.
          </p>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="eyebrow">PANEL ADMINISTRATIVO</span>

          <div className="admin-user">
            <span className="user-name">
              {usuario ? `Hola, ${usuario.nombre}` : ""}
            </span>

            <button type="button" className="btn btn-outline" onClick={() => void cerrarSesion()}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
