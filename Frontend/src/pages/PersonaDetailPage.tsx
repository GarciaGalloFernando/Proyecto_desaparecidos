import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { getPersona, type Persona } from "../repositories/personaRepository";

const SEXO_LABEL: Record<Persona["sexo"], string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
  OTRO: "Otro",
};

const ESTADO_LABEL: Record<string, string> = {
  NO_LOCALIZADA: "No localizada",
  DESAPARECIDA: "Desaparecida",
  ENCONTRADA_VIDA: "Encontrada con vida",
  ENCONTRADA_FALLECIDA: "Encontrada fallecida",
};

function estadoLabel(estado?: string): string {
  if (!estado) return "No disponible";
  return ESTADO_LABEL[estado.toUpperCase()] ?? estado;
}

function formatearFecha(fecha?: string): string {
  if (!fecha) return "No disponible";

  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "No disponible";

  return valor.toLocaleDateString("es-BO");
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div>
      <span>{etiqueta}</span>
      <strong>{valor && valor.trim() ? valor : "No disponible"}</strong>
    </div>
  );
}

function PersonaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const usuario = authRepository.getCurrentUser();

  useEffect(() => {
    if (!id) return;

    const cargarPersona = async () => {
      try {
        setCargando(true);
        setError("");
        const resultado = await getPersona(id);
        setPersona(resultado);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar el registro.",
        );
      } finally {
        setCargando(false);
      }
    };

    void cargarPersona();
  }, [id]);

  const cerrarSesion = async () => {
    await authRepository.logout();
    navigate("/");
  };

  const nombreCompleto = persona
    ? [persona.nombre, persona.apellidoPaterno, persona.apellidoMaterno]
        .filter((parte) => parte && parte.trim())
        .join(" ")
    : "";

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
              <svg viewBox="0 0 64 64" aria-hidden="true">
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
                <circle cx="28" cy="24" r="5" fill="currentColor" />
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

          <div className="header-actions">
            {usuario ? (
              <>
                <span className="user-name">Hola, {usuario.nombre}</span>

                {(usuario.rol === "ADMIN" || usuario.rol === "SUPER_ADMIN") && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/personas")}
                  >
                    Panel administrativo
                  </button>
                )}

                <button className="btn btn-outline" onClick={cerrarSesion}>
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

      {/* ================= CONTENIDO ================= */}

      <main>
        <section className="results-section">
          <div className="container">

            {cargando && (
              <div className="state-message">
                <div className="loader"></div>
                <p>Cargando registro...</p>
              </div>
            )}

            {!cargando && (error || !persona) && (
              <div className="state-message error-message">
                <h3>No se pudo cargar el registro</h3>
                <p>{error || "El registro solicitado no existe."}</p>
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                  Volver al inicio
                </button>
              </div>
            )}

            {!cargando && persona && (
              <div className="admin-page">
                <div className="admin-page-header">
                  <div>
                    <span className="eyebrow">
                      FICHA DE REGISTRO · {persona.codigo}
                    </span>
                    <h1>{nombreCompleto}</h1>
                    <p>
                      <span
                        className={`status-badge status-${persona.estado?.toLowerCase()}`}
                      >
                        {estadoLabel(persona.estado)}
                      </span>
                    </p>
                  </div>

                  <div className="admin-form-actions admin-detail-actions">
                    <button className="btn btn-light" onClick={() => navigate("/")}>
                      Volver a la búsqueda
                    </button>
                  </div>
                </div>

                <div className="admin-detail">
                  <div className="table-photo table-photo-large admin-detail-photo">
                    {persona.foto ? (
                      <img src={persona.foto} alt={`Fotografía de ${nombreCompleto}`} />
                    ) : (
                      <span aria-hidden="true">Sin fotografía</span>
                    )}
                  </div>

                  <div className="admin-detail-info">
                    <section className="admin-form-section">
                      <h2>Datos personales</h2>
                      <div className="person-details admin-detail-grid">
                        <Dato etiqueta="Nombres" valor={persona.nombre} />
                        <Dato etiqueta="Apellido paterno" valor={persona.apellidoPaterno} />
                        <Dato etiqueta="Apellido materno" valor={persona.apellidoMaterno} />
                        <Dato etiqueta="Sexo" valor={SEXO_LABEL[persona.sexo]} />
                        <Dato
                          etiqueta="Fecha de nacimiento"
                          valor={formatearFecha(persona.fechaNacimiento)}
                        />
                        <Dato etiqueta="Edad" valor={`${persona.edad} años`} />
                        <Dato etiqueta="Nacionalidad" valor={persona.nacionalidad} />
                      </div>
                    </section>

                    <section className="admin-form-section">
                      <h2>Datos de la desaparición</h2>
                      <div className="person-details admin-detail-grid">
                        <Dato
                          etiqueta="Fecha de desaparición"
                          valor={formatearFecha(persona.fechaDesaparicion)}
                        />
                        <Dato etiqueta="Hora aproximada" valor={persona.horaAproximada} />
                        <Dato etiqueta="Departamento" valor={persona.departamento} />
                        <Dato etiqueta="Ciudad / Municipio" valor={persona.ciudad} />
                        <Dato etiqueta="Zona" valor={persona.zona} />
                        <Dato etiqueta="Último lugar donde fue vista/o" valor={persona.ultimoLugarVisto} />
                      </div>

                      <div className="field-group">
                        <label>Circunstancias de la desaparición</label>
                        <p className="admin-detail-text">
                          {persona.circunstancias?.trim()
                            ? persona.circunstancias
                            : "No disponible"}
                        </p>
                      </div>
                    </section>

                    <section className="admin-form-section">
                      <h2>Datos de contacto del reportante</h2>
                      <div className="person-details admin-detail-grid">
                        <Dato etiqueta="Nombre" valor={persona.nombreReportante} />
                        <Dato etiqueta="Teléfono" valor={persona.contactoReportante} />
                        <Dato etiqueta="Correo electrónico" valor={persona.correoReportante} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>Personas Desaparecidas Bolivia</strong>
            <p>Sistema de consulta de información.</p>
          </div>
          <p>© 2026 Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}

export default PersonaDetailPage;