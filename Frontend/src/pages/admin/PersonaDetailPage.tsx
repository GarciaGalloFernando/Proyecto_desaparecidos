import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CambiarEstadoModal from "../../components/admin/CambiarEstadoModal";
import EstadoBadge from "../../components/admin/EstadoBadge";
import { personaAdminRepository } from "../../repositories/personaAdminRepository";
import {
  nombreCompleto,
  type EstadoPersona,
  type PersonaDesaparecida,
} from "../../types/personaAdmin";

const SEXO_LABEL: Record<PersonaDesaparecida["sexo"], string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
  OTRO: "Otro",
};

function formatearFecha(fecha?: string): string {
  if (!fecha) return "No disponible";

  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "No disponible";

  return valor.toLocaleDateString("es-BO");
}

function formatearFechaHora(fecha?: string): string {
  if (!fecha) return "No disponible";

  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "No disponible";

  return valor.toLocaleString("es-BO");
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

  const [persona, setPersona] = useState<PersonaDesaparecida | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarCambiarEstado, setMostrarCambiarEstado] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorCambiarEstado, setErrorCambiarEstado] = useState("");

  const cargarPersona = async () => {
    if (!id) return;

    try {
      setCargando(true);
      setError("");
      const resultado = await personaAdminRepository.obtener(id);

      if (!resultado) {
        setError("El registro solicitado no existe.");
        return;
      }

      setPersona(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar el registro.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarPersona();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const confirmarCambioEstado = async (estado: EstadoPersona) => {
    if (!persona) return;

    try {
      setCambiandoEstado(true);
      setErrorCambiarEstado("");
      const actualizado = await personaAdminRepository.cambiarEstado(persona.id, estado);
      setPersona(actualizado);
      setMostrarCambiarEstado(false);
    } catch (err) {
      setErrorCambiarEstado(
        err instanceof Error ? err.message : "No fue posible cambiar el estado.",
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  if (cargando) {
    return (
      <div className="state-message">
        <div className="loader"></div>
        <p>Cargando registro...</p>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="state-message error-message">
        <h3>No se pudo cargar el registro</h3>
        <p>{error || "El registro solicitado no existe."}</p>
        <button className="btn btn-primary" onClick={() => navigate("/admin/personas")}>
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">FICHA DE REGISTRO · {persona.codigo}</span>
          <h1>{nombreCompleto(persona)}</h1>
          <p>
            <EstadoBadge estado={persona.estado} />
          </p>
        </div>

        <div className="admin-form-actions admin-detail-actions">
          <button className="btn btn-light" onClick={() => navigate("/admin/personas")}>
            Volver
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setErrorCambiarEstado("");
              setMostrarCambiarEstado(true);
            }}
          >
            Cambiar estado
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/admin/personas/${persona.id}/editar`)}
          >
            Editar
          </button>
        </div>
      </div>

      <div className="admin-detail">
        <div className="table-photo table-photo-large admin-detail-photo">
          {persona.foto ? (
            <img src={persona.foto} alt={`Fotografía de ${nombreCompleto(persona)}`} />
          ) : (
            <span aria-hidden="true">Sin fotografía</span>
          )}
        </div>

        <div className="admin-detail-info">
          <section className="admin-form-section">
            <h2>Datos personales</h2>
            <div className="person-details admin-detail-grid">
              <Dato etiqueta="Nombres" valor={persona.nombres} />
              <Dato etiqueta="Apellido paterno" valor={persona.apellidoPaterno} />
              <Dato etiqueta="Apellido materno" valor={persona.apellidoMaterno} />
              <Dato etiqueta="Sexo" valor={SEXO_LABEL[persona.sexo]} />
              <Dato etiqueta="Fecha de nacimiento" valor={formatearFecha(persona.fechaNacimiento)} />
              <Dato etiqueta="Edad" valor={`${persona.edad} años`} />
              <Dato etiqueta="Número de documento" valor={persona.numeroDocumento} />
              <Dato etiqueta="Nacionalidad" valor={persona.nacionalidad} />
            </div>
          </section>

          <section className="admin-form-section">
            <h2>Datos de la desaparición</h2>
            <div className="person-details admin-detail-grid">
              <Dato etiqueta="Fecha de desaparición" valor={formatearFecha(persona.fechaDesaparicion)} />
              <Dato etiqueta="Hora aproximada" valor={persona.horaAproximada} />
              <Dato etiqueta="Departamento" valor={persona.departamento} />
              <Dato etiqueta="Ciudad / Municipio" valor={persona.ciudad} />
              <Dato etiqueta="Zona" valor={persona.zona} />
              <Dato etiqueta="Dirección o lugar exacto" valor={persona.direccion} />
              <Dato etiqueta="Último lugar donde fue vista/o" valor={persona.ultimoLugarVisto} />
            </div>

            <div className="field-group">
              <label>Circunstancias de la desaparición</label>
              <p className="admin-detail-text">
                {persona.circunstancias?.trim() ? persona.circunstancias : "No disponible"}
              </p>
            </div>
          </section>

          <section className="admin-form-section">
            <h2>Datos de registro</h2>
            <div className="person-details admin-detail-grid">
              <Dato etiqueta="Fecha de registro" valor={formatearFechaHora(persona.fechaRegistro)} />
              <Dato etiqueta="Última actualización" valor={formatearFechaHora(persona.actualizadoEn)} />
            </div>
          </section>
        </div>
      </div>

      {mostrarCambiarEstado && (
        <CambiarEstadoModal
          persona={persona}
          isSubmitting={cambiandoEstado}
          error={errorCambiarEstado}
          onConfirm={(estado) => void confirmarCambioEstado(estado)}
          onCancel={() => setMostrarCambiarEstado(false)}
        />
      )}
    </div>
  );
}

export default PersonaDetailPage;
