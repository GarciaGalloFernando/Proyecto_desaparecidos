import type { UsuarioAdmin } from "../types/usuarioAdmin";

// Datos de prueba (MOCK) para el módulo "Gestión de Usuarios".
// Son usuarios ficticios, generados únicamente para probar la interfaz
// mientras el backend real no está disponible. No representan personas reales.
export const USUARIOS_MOCK: UsuarioAdmin[] = [
  {
    id: "usuario-mock-1",
    nombre: "Administrador",
    carnet: "0000000",
    email: "admin@gmail.com",
    rol: "SUPER_ADMIN",
    estado: "ACTIVO",
    fechaCreacion: "2026-01-05T09:00:00.000Z",
    actualizadoEn: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "usuario-mock-2",
    nombre: "Gabriela Torrez Uriona",
    carnet: "6541230",
    email: "gabriela.torrez@conecta.com.bo",
    rol: "ADMIN",
    estado: "ACTIVO",
    fechaCreacion: "2026-03-14T13:20:00.000Z",
    actualizadoEn: "2026-03-14T13:20:00.000Z",
  },
  {
    id: "usuario-mock-3",
    nombre: "Luis Alberto Choque Pérez",
    carnet: "7789456",
    email: "luis.choque@conecta.com.bo",
    rol: "ADMIN",
    estado: "INACTIVO",
    fechaCreacion: "2026-04-02T10:45:00.000Z",
    actualizadoEn: "2026-06-18T08:10:00.000Z",
  },
];
