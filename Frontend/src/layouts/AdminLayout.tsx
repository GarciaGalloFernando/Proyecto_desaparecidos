import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

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
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="28" cy="28" r="17" fill="none" stroke="currentColor" strokeWidth="5" />
              <path d="M41 41L55 55" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <circle cx="28" cy="24" r="5" fill="currentColor" />
              <path d="M18 38c1.8-6 5.3-9 10-9s8.2 3 10 9" fill="currentColor" />
            </svg>
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
            Datos de prueba (mock). Sin conexión a backend real todavía.
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
