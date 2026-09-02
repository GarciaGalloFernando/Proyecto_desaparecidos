export type UserRole = "ADMIN" | "SUPER_ADMIN";
export interface User { id:string; nombre:string; carnet:string; email:string; rol:UserRole; estado:"ACTIVO"|"INACTIVO"; }
export interface LoginCredentials { carnet:string; password:string; }
export interface Session { token:string; admin:User; }
