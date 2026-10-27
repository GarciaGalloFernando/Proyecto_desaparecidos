import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import {
  getPersonas,
  type Persona,
} from "../repositories/personaRepository";
import { distritos } from "../constants/ubicaciones";
import { CONTACTO } from "../constants/contacto";

const PASOS_PUBLICAR = [
  {
    titulo: "Envíanos los datos",
    texto:
      "Nombre completo, edad, descripción física y vestimenta, fecha y lugar donde fue vista por última vez (distrito y zona), una foto clara y reciente, y un teléfono de contacto.",
  },
  {
    titulo: "Lo verificamos",
    texto:
      "Un administrador revisa la información y se comunica contigo para confirmar los datos, evitando publicaciones falsas o duplicadas.",
  },
  {
    titulo: "Se publica y se comparte",
    texto:
      "El caso aparece en la plataforma con su ficha de consulta, visible por distrito y estado. Avísanos si la persona es localizada para actualizar el caso.",
  },
];

const SEXOS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
];

const ESTADOS = [
  { value: "No_localizada", label: "No localizada" },
  { value: "Desaparecida", label: "Desaparecida" },
  { value: "encontrada_vida", label: "Encontrada con vida" },
  { value: "encontrada_fallecida", label: "Encontrada fallecida" },
] as const;

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombre, setNombre] = useState("");
  const [distrito, setDistrito] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
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

      if (distrito) {
        filtros.distrito = distrito;
      }

      if (edad) {
        filtros.edad = edad;
      }

      if (sexo) {
        filtros.sexo = sexo;
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

  // Al volver desde el detalle de una persona, ir directo a la sección indicada
  useEffect(() => {
    const destino = (location.state as { irA?: string } | null)?.irA;
    if (!destino) return;

    document.getElementById(destino)?.scrollIntoView({ block: "start" });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const buscar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void cargarPersonas();
  };

  const limpiarFiltros = () => {
    setNombre("");
    setDistrito("");
    setEdad("");
    setSexo("");
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
            <img src="/logo-blanco.png" alt="" />
          </span>

            <span>
              <strong>Personas Desaparecidas</strong>
              <small>Sucre</small>
            </span>
          </button>

          <nav className="main-nav">
            <a href="#inicio">Inicio</a>
            <a href="#buscar">Buscar personas</a>
            <a href="#como-publicar">Cómo publicar</a>
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
                SISTEMA DE CONSULTA
              </span>

              <h1>
                Ayúdanos a encontrar
                <span> a quienes buscamos.</span>
              </h1>

              <p>
                Consulta información sobre personas desaparecidas,
                encontradas e identificadas en la ciudad de Sucre.
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
                <label htmlFor="distrito">
                  Distrito
                </label>

                <select
                  id="distrito"
                  value={distrito}
                  onChange={(event) =>
                    setDistrito(event.target.value)
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  {distritos.map((item) => (
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
                <label htmlFor="sexo">
                  Sexo
                </label>

                <select
                  id="sexo"
                  value={sexo}
                  onChange={(event) =>
                    setSexo(event.target.value)
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  {SEXOS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
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
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
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
                        {persona.estado?.toUpperCase() === "NO_LOCALIZADA"
                          ? "No localizada"
                          : persona.estado?.toUpperCase() === "DESAPARECIDA"
                            ? "Desaparecida"
                            : persona.estado?.toUpperCase() === "ENCONTRADA_VIDA"
                              ? "Encontrada con vida"
                              : "Encontrada fallecida"}
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
                          <span>Distrito</span>
                          <strong>
                            {persona.distrito}
                          </strong>
                        </div>

                        <div>
                          <span>Fecha</span>
                          <strong>
                            {persona.fechaDesaparicion
                              ? new Date(
                                  persona.fechaDesaparicion,
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

        {/* ================= CÓMO PUBLICAR ================= */}

        <section
          id="como-publicar"
          className="how-section"
        >
          <div className="container">

            <h2 className="how-title">
              ¿Cómo publicar un caso?
            </h2>

            <span className="how-line" aria-hidden="true" />

            <p className="how-subtitle">
              Si una persona de tu familia o entorno desapareció en
              Sucre, así se publica su caso en la plataforma.
            </p>

            <div className="how-steps">
              {PASOS_PUBLICAR.map((paso, indice) => (
                <article key={paso.titulo} className="how-step">
                  <span className="how-step-number">
                    {indice + 1}
                  </span>

                  <h3>{paso.titulo}</h3>

                  <p>{paso.texto}</p>
                </article>
              ))}
            </div>

            <div className="how-actions">
              <a
                className="btn btn-primary"
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(
                  "Hola, quiero reportar a una persona desaparecida en Sucre.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>

              <a
                className="btn btn-outline"
                href={`mailto:${CONTACTO.correo}?subject=${encodeURIComponent(
                  "Reporte de persona desaparecida en Sucre",
                )}`}
              >
                Enviar un correo
              </a>
            </div>

            <div className="how-notice" role="note">
              <strong>Importante:</strong> este sistema no reemplaza la
              denuncia oficial. Presenta la denuncia cuanto antes en la
              FELCC o en la estación policial más cercana; no es necesario
              esperar 24, 48 o 72 horas. En una emergencia, llama al 110.
            </div>

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

              <p className="information-description">
                Página web para centralizar y difundir información sobre
                personas desaparecidas en la ciudad de Sucre. Se pretende
                implementar para facilitar la búsqueda de información y
                dar mayor visibilidad a los casos registrados, permitiendo
                una consulta rápida y sencilla.
              </p>
            </div>

            <a className="btn information-cta" href="#buscar">
              Buscar una persona
              <span aria-hidden="true">→</span>
            </a>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container footer-content">

          <div>
            <strong>
              Personas Desaparecidas Sucre
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