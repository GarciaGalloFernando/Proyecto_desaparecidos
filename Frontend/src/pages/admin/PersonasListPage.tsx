import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../../components/admin/ConfirmDialog";
import CambiarEstadoModal from "../../components/admin/CambiarEstadoModal";
import EstadoBadge from "../../components/admin/EstadoBadge";
import RowActionsMenu from "../../components/admin/RowActionsMenu";
import { DEPARTAMENTOS } from "../../constants/ubicaciones";
import { personaAdminRepository } from "../../repositories/personaAdminRepository";
import {
  ESTADOS_PERSONA,
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
  if (!fecha) return "—";

  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "—";

  return valor.toLocaleDateString("es-BO");
}

function lugarDesaparicion(persona: PersonaDesaparecida): string {
  const partes = [persona.zona, persona.ultimoLugarVisto].filter(Boolean);
  return partes.length > 0 ? partes.join(", ") : "—";
}

function PersonasListPage() {
  const navigate = useNavigate();

  const [personas, setPersonas] = useState<PersonaDesaparecida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");

  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null);

  const [personaAEliminar, setPersonaAEliminar] = useState<PersonaDesaparecida | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const [personaCambiarEstado, setPersonaCambiarEstado] = useState<PersonaDesaparecida | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorCambiarEstado, setErrorCambiarEstado] = useState("");

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError("");
      const resultado = await personaAdminRepository.listar();
      console.log("PERSONAS RECIBIDAS DEL BACKEND:", resultado);
      console.log("CANTIDAD RECIBIDA:", resultado.length);
      setPersonas(resultado);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible cargar los registros.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarPersonas();
  }, []);

  const personasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return personas.filter((persona) => {
      const coincideTexto =
        !texto ||
        nombreCompleto(persona).toLowerCase().includes(texto) ||
        persona.codigo.toLowerCase().includes(texto);

      const coincideEstado = !filtroEstado || persona.estado === filtroEstado;
      const coincideDepartamento =
        !filtroDepartamento || persona.departamento === filtroDepartamento;

      return coincideTexto && coincideEstado && coincideDepartamento;
    });
  }, [personas, busqueda, filtroEstado, filtroDepartamento]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("");
    setFiltroDepartamento("");
  };

  const confirmarEliminar = async () => {
    if (!personaAEliminar) return;

    try {
      setEliminando(true);
      setErrorEliminar("");
      await personaAdminRepository.eliminar(personaAEliminar.id);
      setPersonas((prev) => prev.filter((persona) => persona.id !== personaAEliminar.id));
      setPersonaAEliminar(null);
    } catch (err) {
      setErrorEliminar(
        err instanceof Error ? err.message : "No fue posible eliminar el registro.",
      );
    } finally {
      setEliminando(false);
    }
  };

  const confirmarCambioEstado = async (estado: EstadoPersona) => {
    if (!personaCambiarEstado) return;

    try {
      setCambiandoEstado(true);
      setErrorCambiarEstado("");
      const actualizado = await personaAdminRepository.cambiarEstado(
        personaCambiarEstado.id,
        estado,
      );
      setPersonas((prev) =>
        prev.map((persona) => (persona.id === actualizado.id ? actualizado : persona)),
      );
      setPersonaCambiarEstado(null);
    } catch (err) {
      setErrorCambiarEstado(
        err instanceof Error ? err.message : "No fue posible cambiar el estado.",
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">GESTIÓN DE PERSONAS DESAPARECIDAS</span>
          <h1>Personas registradas</h1>
          <p>
            Visualiza, registra, edita y actualiza el estado de las personas
            desaparecidas. (Los registros se cargan directamente desde MongoDB a través del backend.)
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={() => navigate("/admin/personas/nueva")}
        >
          + Añadir persona
        </button>
      </div>

      <div className="admin-filters">
        <div className="search-field search-field-large">
          <label htmlFor="busqueda">Buscar</label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Nombre o código (PD-0001)"
          />
        </div>

        <div className="search-field">
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
          >
            <option value="">Todos</option>
            {ESTADOS_PERSONA.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="filtro-departamento">Departamento</label>
          <select
            id="filtro-departamento"
            value={filtroDepartamento}
            onChange={(event) => setFiltroDepartamento(event.target.value)}
          >
            <option value="">Todos</option>
            {DEPARTAMENTOS.map((departamento) => (
              <option key={departamento} value={departamento}>
                {departamento}
              </option>
            ))}
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
          <p>Cargando registros...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-message error-message">
          <h3>No se pudieron cargar los registros</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => void cargarPersonas()}>
            Intentar nuevamente
          </button>
        </div>
      )}

      {!loading && !error && personasFiltradas.length === 0 && (
        <div className="state-message">
          <div className="empty-icon">⌕</div>
          <h3>No se encontraron registros</h3>
          <p>Ajusta los filtros o añade una nueva persona.</p>
        </div>
      )}

      {!loading && !error && personasFiltradas.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Código</th>
                <th>Nombre completo</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Fecha de desaparición</th>
                <th>Lugar de desaparición</th>
                <th>Ciudad / Departamento</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th aria-label="Acciones"></th>
              </tr>
            </thead>

            <tbody>
              {personasFiltradas.map((persona) => (
                <tr key={persona.id}>
                  <td>
                    <div className="table-photo">
                      {persona.foto ? (
                        <img src={persona.foto} alt={`Fotografía de ${nombreCompleto(persona)}`} />
                      ) : (
                        <span aria-hidden="true">Sin foto</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="table-code">{persona.codigo}</span>
                  </td>

                  <td>
                    <strong>{nombreCompleto(persona)}</strong>
                  </td>

                  <td>{persona.edad}</td>

                  <td>{SEXO_LABEL[persona.sexo]}</td>

                  <td>{formatearFecha(persona.fechaDesaparicion)}</td>

                  <td>{lugarDesaparicion(persona)}</td>

                  <td>
                    {persona.ciudad}
                    <br />
                    <span className="table-muted">{persona.departamento}</span>
                  </td>

                  <td>{formatearFecha(persona.fechaRegistro)}</td>

                  <td>
                    <EstadoBadge estado={persona.estado} />
                  </td>

                  <td>
                    <RowActionsMenu
                      open={menuAbiertoId === persona.id}
                      onToggle={() =>
                        setMenuAbiertoId((actual) => (actual === persona.id ? null : persona.id))
                      }
                      onVerDetalle={() => {
                        setMenuAbiertoId(null);
                        navigate(`/admin/personas/${persona.id}`);
                      }}
                      onEditar={() => {
                        setMenuAbiertoId(null);
                        navigate(`/admin/personas/${persona.id}/editar`);
                      }}
                      onCambiarEstado={() => {
                        setMenuAbiertoId(null);
                        setErrorCambiarEstado("");
                        setPersonaCambiarEstado(persona);
                      }}
                      onEliminar={() => {
                        setMenuAbiertoId(null);
                        setErrorEliminar("");
                        setPersonaAEliminar(persona);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {personaAEliminar && (
        <ConfirmDialog
          title="Eliminar registro"
          message={`¿Deseas eliminar el registro de ${nombreCompleto(personaAEliminar)} (${personaAEliminar.codigo})? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          danger
          isSubmitting={eliminando}
          error={errorEliminar}
          onConfirm={() => void confirmarEliminar()}
          onCancel={() => setPersonaAEliminar(null)}
        />
      )}

      {personaCambiarEstado && (
        <CambiarEstadoModal
          persona={personaCambiarEstado}
          isSubmitting={cambiandoEstado}
          error={errorCambiarEstado}
          onConfirm={(estado) => void confirmarCambioEstado(estado)}
          onCancel={() => setPersonaCambiarEstado(null)}
        />
      )}
    </div>
  );
}

export default PersonasListPage;
