import { useState } from "react";
import { ESTADOS_PERSONA } from "../../types/personaAdmin";
import type { EstadoPersona, PersonaDesaparecida } from "../../types/personaAdmin";
import { nombreCompleto } from "../../types/personaAdmin";

interface CambiarEstadoModalProps {
  persona: PersonaDesaparecida;
  isSubmitting?: boolean;
  error?: string;
  onConfirm: (estado: EstadoPersona) => void;
  onCancel: () => void;
}

function CambiarEstadoModal({
  persona,
  isSubmitting = false,
  error,
  onConfirm,
  onCancel,
}: CambiarEstadoModalProps) {
  const [estado, setEstado] = useState<EstadoPersona>(persona.estado);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cambiar-estado-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="cambiar-estado-title">Cambiar estado</h3>
        <p className="modal-message">
          Actualiza el estado del caso de <strong>{nombreCompleto(persona)}</strong> ({persona.codigo}).
        </p>

        <div className="field-group">
          <label htmlFor="nuevo-estado">Nuevo estado</label>

          <select
            id="nuevo-estado"
            value={estado}
            onChange={(event) => setEstado(event.target.value as EstadoPersona)}
          >
            {ESTADOS_PERSONA.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-light"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm(estado)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar estado"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CambiarEstadoModal;
