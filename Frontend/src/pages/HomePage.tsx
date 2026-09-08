import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import {
  getPersonas,
  type Persona,
} from "../repositories/personaRepository";

const DEPARTAMENTOS = [
  "Chuquisaca",
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Tarija",
  "Beni",
  "Pando",
];

const ESTADOS = [
  "DESAPARECIDO",
  "ENCONTRADO",
  "IDENTIFICADO",
  "CASO_CERRADO",
];

function HomePage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [edad, setEdad] = useState("");
  const [estado, setEstado] = useState("");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const usuario = authRepository.getCurrentUser();

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError("");

      const filtros: Record<string, string> = {};

      if (nombre.trim()) {
        filtros.nombre = nombre.trim();
      }

      if (departamento) {
        filtros.departamento = departamento;
      }

      if (edad) {
        filtros.edad = edad;
      }

      if (estado) {
        filtros.estado = estado;
      }

      const resultado = await getPersonas(filtros);

      setPersonas(resultado);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar los registros.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarPersonas();
  }, []);

  const buscar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void cargarPersonas();
  };

  const limpiarFiltros = () => {
    setNombre("");
    setDepartamento("");
    setEdad("");
    setEstado("");

    void getPersonas()
      .then((resultado) => {
        setPersonas(resultado);
        setError("");
      })
      .catch(() => {
        setError("No fue posible cargar los registros.");
      });
  };

  const cerrarSesion = async () => {
    await authRepository.logout();
    navigate("/");
  };

  return (
    <div className="site">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="container header-content">

          <button
            className="brand"
            onClick={() => navigate("/")}
            aria-label="Ir al inicio"
          >
            <span className="brand-logo">
              <svg
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                />

                <path
                  d="M41 41L55 55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <circle
                  cx="28"
                  cy="24"
                  r="5"
                  fill="currentColor"
                />

                <path
                  d="M18 38c1.8-6 5.3-9 10-9s8.2 3 10 9"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span>
              <strong>Personas Desaparecidas</strong>
              <small>Bolivia</small>
            </span>
          </button>

          <nav className="main-nav">
            <a href="#inicio">Inicio</a>
            <a href="#buscar">Buscar personas</a>
            <a href="#informacion">Información</a>
          </nav>

          <div className="header-actions">
            {usuario ? (
              <>
                <span className="user-name">
                  Hola, {usuario.nombre}
                </span>

                {(usuario.rol === "ADMIN" || usuario.rol === "SUPER_ADMIN") && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/personas")}
                  >
                    Panel administrativo
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <main>

        <section
          id="inicio"
          className="hero"
        >
          <div className="container hero-content">

            <div className="hero-text">

              <span className="eyebrow">
                SISTEMA NACIONAL DE CONSULTA
              </span>

              <h1>
                Ayúdanos a encontrar
                <span> a quienes buscamos.</span>
              </h1>

              <p>
                Consulta información sobre personas desaparecidas,
                encontradas e identificadas en Bolivia.
              </p>

              <button
                className="btn btn-primary btn-large"
                onClick={() =>
                  document
                    .getElementById("buscar")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Buscar una persona
                <span>→</span>
              </button>

            </div>

            <div className="hero-card">

              <div className="hero-card-icon">
                <svg
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="17"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                  />

                  <path
                    d="M41 41L55 55"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2>Información centralizada</h2>

              <p>
                Un espacio para consultar de forma rápida
                y organizada los registros disponibles.
              </p>

            </div>

          </div>
        </section>

        {/* ================= BUSCADOR ================= */}

        <section
          id="buscar"
          className="search-section"
        >
          <div className="container">

            <div className="section-heading">

              <span className="eyebrow">
                CONSULTA
              </span>

              <h2>
                Buscar personas
              </h2>

              <p>
                Utiliza uno o varios filtros para encontrar
                el registro que necesitas.
              </p>

            </div>

            <form
              className="search-box"
              onSubmit={buscar}
            >

              <div className="search-field search-field-large">
                <label htmlFor="nombre">
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(event) =>
                    setNombre(event.target.value)
                  }
                  placeholder="Nombre de la persona"
                />
              </div>

              <div className="search-field">
                <label htmlFor="departamento">
                  Departamento
                </label>

                <select
                  id="departamento"
                  value={departamento}
                  onChange={(event) =>
                    setDepartamento(event.target.value)
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  {DEPARTAMENTOS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="edad">
                  Edad
                </label>

                <input
                  id="edad"
                  type="number"
                  min="0"
                  max="120"
                  value={edad}
                  onChange={(event) =>
                    setEdad(event.target.value)
                  }
                  placeholder="Edad"
                />
              </div>

              <div className="search-field">
                <label htmlFor="estado">
                  Estado
                </label>

                <select
                  id="estado"
                  value={estado}
                  onChange={(event) =>
                    setEstado(event.target.value)
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  {ESTADOS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-buttons">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Buscar
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={limpiarFiltros}
                >
                  Limpiar
                </button>

              </div>

            </form>

          </div>
        </section>

        {/* ================= RESULTADOS ================= */}

        <section className="results-section">
          <div className="container">

            <div className="results-header">

              <div>
                <span className="eyebrow">
                  RESULTADOS
                </span>

                <h2>
                  Registros encontrados
                </h2>
              </div>

              <span className="results-count">
                {personas.length} registros
              </span>

            </div>

            {loading && (
              <div className="state-message">
                <div className="loader"></div>
                <p>Cargando registros...</p>
              </div>
            )}

            {!loading && error && (
              <div className="state-message error-message">
                <h3>No se pudieron cargar los registros</h3>
                <p>{error}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => void cargarPersonas()}
                >
                  Intentar nuevamente
                </button>
              </div>
            )}

            {!loading && !error && personas.length === 0 && (
              <div className="state-message">
                <div className="empty-icon">⌕</div>

                <h3>
                  No encontramos registros
                </h3>

                <p>
                  Prueba utilizando otros filtros de búsqueda.
                </p>
              </div>
            )}

            {!loading && !error && personas.length > 0 && (
              <div className="person-grid">

                {personas.map((persona) => (
                  <article
                    className="person-card"
                    key={persona.id}
                  >

                    <div className="person-photo">

                      {persona.foto ? (
                        <img
                          src={persona.foto}
                          alt={`Fotografía de ${persona.nombre}`}
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <span>Sin fotografía</span>
                        </div>
                      )}

                      <span
                        className={`status-badge status-${persona.estado?.toLowerCase()}`}
                      >
                        {persona.estado?.replaceAll("_", " ")}
                      </span>

                    </div>

                    <div className="person-content">

                      <h3>
                        {persona.nombre}
                      </h3>

                      <p className="person-age">
                        {persona.edad} años
                      </p>

                      <div className="person-details">

                        <div>
                          <span>Departamento</span>
                          <strong>
                            {persona.departamento}
                          </strong>
                        </div>

                        <div>
                          <span>Fecha</span>
                          <strong>
                            {persona.fecha_desaparicion
                              ? new Date(
                                  persona.fecha_desaparicion,
                                ).toLocaleDateString("es-BO")
                              : "No disponible"}
                          </strong>
                        </div>

                      </div>

                      <button
                        className="person-link"
                        onClick={() =>
                          navigate(`/personas/${persona.id}`)
                        }
                      >
                        Ver información
                        <span>→</span>
                      </button>

                    </div>

                  </article>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* ================= INFORMACIÓN ================= */}

        <section
          id="informacion"
          className="information-section"
        >
          <div className="container information-content">

            <div>
              <span className="eyebrow">
                SOBRE EL SISTEMA
              </span>

              <h2>
                Información organizada para una consulta más rápida.
              </h2>
            </div>

            <p>
              Este sistema permite centralizar y consultar
              información de personas desaparecidas y encontradas,
              facilitando la búsqueda mediante diferentes filtros.
            </p>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container footer-content">

          <div>
            <strong>
              Personas Desaparecidas Bolivia
            </strong>

            <p>
              Sistema de consulta de información.
            </p>
          </div>

          <p>
            © 2026 Todos los derechos reservados.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default HomePage;