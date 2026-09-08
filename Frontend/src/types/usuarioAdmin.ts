export type RolUsuario="ADMIN"|"SUPER_ADMIN";
export type EstadoUsuario="ACTIVO"|"INACTIVO";
export interface RolUsuarioOption{value:RolUsuario;label:string;}
export const ROLES_USUARIO:RolUsuarioOption[]=[
  {value:"ADMIN",label:"Administrador"},
  {value:"SUPER_ADMIN",label:"Super administrador"},
];
export interface UsuarioAdmin{id:string;nombre:string;carnet:string;email:string;rol:RolUsuario;estado:EstadoUsuario;fechaCreacion:string;actualizadoEn:string;}
export type UsuarioFormData={nombre:string;carnet:string;email:string;rol:RolUsuario;password?:string};
