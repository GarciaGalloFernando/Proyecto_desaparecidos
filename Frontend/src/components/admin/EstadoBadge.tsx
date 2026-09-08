import type { EstadoPersona } from "../../types/personaAdmin";

const ESTADO_META: Record<EstadoPersona, { label: string; className: string }> = {
  No_localizada: { label: "No localizada", className: "estado-no-localizada" },
  Desaparecida: { label: "Desaparecida", className: "estado-desaparecida" },
  encontrada_vida: { label: "Encontrada con vida", className: "estado-encontrada-vida" },
  encontrada_fallecida: { label: "Encontrada fallecida", className: "estado-encontrada-fallecida" },
};

function EstadoBadge({ estado }: { estado: EstadoPersona }) {
  const meta = ESTADO_META[estado];
  return <span className={`estado-badge ${meta.className}`}>{meta.label}</span>;
}

export default EstadoBadge;
