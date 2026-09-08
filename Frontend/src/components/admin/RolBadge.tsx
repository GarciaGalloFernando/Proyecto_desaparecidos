import type { RolUsuario } from "../../types/usuarioAdmin";

const ROL_LABEL: Record<RolUsuario, string> = {
  ADMIN: "Administrador",
  SUPER_ADMIN: "Super administrador",
};

function RolBadge({ rol }: { rol: RolUsuario }) {
  return (
    <span className={`estado-badge ${rol === "SUPER_ADMIN" ? "estado-cerrado" : "estado-investigacion"}`}>
      {ROL_LABEL[rol]}
    </span>
  );
}

export default RolBadge;
