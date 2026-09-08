// Tipos del módulo "Gestión de Usuarios" (panel administrativo).
// Este módulo trabaja únicamente con datos MOCK en el frontend, sin backend real.

export type RolUsuario = "ADMIN" | "SUPER_ADMIN";
export type EstadoUsuario = "ACTIVO" | "INACTIVO";

export interface RolUsuarioOption {
  value: RolUsuario;
  label: string;
}

export const ROLES_USUARIO: RolUsuarioOption[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "SUPER_ADMIN", label: "Super administrador" },
];

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  carnet: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  fechaCreacion: string;
  actualizadoEn: string;
}

// Datos que se editan desde el formulario de creación/edición.
// El estado (activo/inactivo) se administra aparte, con su propia acción.
// `password` solo se usa para simular el flujo de creación/cambio de clave:
// el repositorio mock NO la persiste (ver usuarioAdminRepository.ts).
export type UsuarioFormData = Omit<
  UsuarioAdmin,
  "id" | "estado" | "fechaCreacion" | "actualizadoEn"
> & {
  password?: string;
};
