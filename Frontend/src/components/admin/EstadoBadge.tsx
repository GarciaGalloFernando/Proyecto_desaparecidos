import type { EstadoPersona } from "../../types/personaAdmin";

interface EstadoMeta {
  label: string;
  className: string;
}

const ESTADO_META: Record<EstadoPersona, EstadoMeta> = {
  DESAPARECIDA: { label: "Desaparecida", className: "estado-desaparecida" },
  EN_INVESTIGACION: { label: "En investigación", className: "estado-investigacion" },
  ENCONTRADA_VIDA: { label: "Encontrada con vida", className: "estado-encontrada-vida" },
  ENCONTRADA_FALLECIDA: { label: "Encontrada fallecida", className: "estado-encontrada-fallecida" },
  CASO_CERRADO: { label: "Caso cerrado", className: "estado-cerrado" },
};

interface EstadoBadgeProps {
  estado: EstadoPersona;
}

function EstadoBadge({ estado }: EstadoBadgeProps) {
  const meta = ESTADO_META[estado];

  return <span className={`estado-badge ${meta.className}`}>{meta.label}</span>;
}

export default EstadoBadge;
