import type { EstadoUsuario } from "../../types/usuarioAdmin";

interface EstadoUsuarioBadgeProps {
  estado: EstadoUsuario;
}

function EstadoUsuarioBadge({ estado }: EstadoUsuarioBadgeProps) {
  const esActivo = estado === "ACTIVO";

  return (
    <span className={`estado-badge ${esActivo ? "estado-encontrada-vida" : "estado-encontrada-fallecida"}`}>
      {esActivo ? "Activo" : "Inactivo"}
    </span>
  );
}

export default EstadoUsuarioBadge;
