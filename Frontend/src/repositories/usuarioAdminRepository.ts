import { storageService } from "../services/storageService";
import { USUARIOS_MOCK } from "../data/usuariosAdminMock";
import type {
  EstadoUsuario,
  UsuarioAdmin,
  UsuarioFormData,
} from "../types/usuarioAdmin";

// ⚠️ REPOSITORIO MOCK (SOLO FRONTEND) ⚠️
//
// El módulo "Gestión de Usuarios" todavía no está conectado a un backend
// real. Este repositorio simula las operaciones CRUD guardando los datos en
// localStorage, para poder navegar y probar el panel administrativo de
// forma independiente.
//
// Nota de seguridad: el formulario recolecta una contraseña para simular el
// flujo real de alta/cambio de clave, pero este repositorio NO la persiste
// ni la expone en ningún listado o detalle. Cuando exista un backend real,
// el manejo de contraseñas debe hacerse ahí (hash, políticas, etc.), nunca
// en el frontend.
//
// Cuando exista una API real, este archivo debe reemplazarse por llamadas
// HTTP equivalentes, manteniendo la misma interfaz pública.

const STORAGE_KEY = "app_usuarios_admin_mock";
const SIMULATED_DELAY_MS = 250;

function delay(ms: number = SIMULATED_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function leerTodos(): UsuarioAdmin[] {
  const almacenados = storageService.get<UsuarioAdmin[]>(STORAGE_KEY);

  if (almacenados) {
    return almacenados;
  }

  storageService.set(STORAGE_KEY, USUARIOS_MOCK);
  return USUARIOS_MOCK;
}

function guardarTodos(usuarios: UsuarioAdmin[]): void {
  storageService.set(STORAGE_KEY, usuarios);
}

function generarId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `usuario-mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const usuarioAdminRepository = {
  async listar(): Promise<UsuarioAdmin[]> {
    await delay();
    return [...leerTodos()].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    );
  },

  async obtener(id: string): Promise<UsuarioAdmin | null> {
    await delay();
    return leerTodos().find((usuario) => usuario.id === id) ?? null;
  },

  async crear(datos: UsuarioFormData): Promise<UsuarioAdmin> {
    await delay();

    const usuarios = leerTodos();
    const emailNormalizado = normalizarEmail(datos.email);

    const yaExiste = usuarios.some(
      (usuario) => normalizarEmail(usuario.email) === emailNormalizado,
    );

    if (yaExiste) {
      throw new Error("Ya existe un usuario registrado con ese correo electrónico.");
    }

    const ahora = new Date().toISOString();

    // `datos.password` se descarta intencionalmente: ver nota de seguridad arriba.
    const nuevo: UsuarioAdmin = {
      nombre: datos.nombre,
      carnet: datos.carnet,
      rol: datos.rol,
      email: emailNormalizado,
      id: generarId(),
      estado: "ACTIVO",
      fechaCreacion: ahora,
      actualizadoEn: ahora,
    };

    guardarTodos([...usuarios, nuevo]);
    return nuevo;
  },

  async actualizar(id: string, datos: UsuarioFormData): Promise<UsuarioAdmin> {
    await delay();

    const usuarios = leerTodos();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);

    if (indice === -1) {
      throw new Error("El usuario que intenta editar no existe.");
    }

    const emailNormalizado = normalizarEmail(datos.email);
    const yaExiste = usuarios.some(
      (usuario) => usuario.id !== id && normalizarEmail(usuario.email) === emailNormalizado,
    );

    if (yaExiste) {
      throw new Error("Ya existe un usuario registrado con ese correo electrónico.");
    }

    // `datos.password` se descarta intencionalmente: ver nota de seguridad arriba.
    const actualizado: UsuarioAdmin = {
      ...usuarios[indice],
      nombre: datos.nombre,
      carnet: datos.carnet,
      rol: datos.rol,
      email: emailNormalizado,
      actualizadoEn: new Date().toISOString(),
    };

    const copia = [...usuarios];
    copia[indice] = actualizado;
    guardarTodos(copia);

    return actualizado;
  },

  async cambiarEstado(id: string, estado: EstadoUsuario): Promise<UsuarioAdmin> {
    await delay();

    const usuarios = leerTodos();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);

    if (indice === -1) {
      throw new Error("El usuario que intenta actualizar no existe.");
    }

    const actualizado: UsuarioAdmin = {
      ...usuarios[indice],
      estado,
      actualizadoEn: new Date().toISOString(),
    };

    const copia = [...usuarios];
    copia[indice] = actualizado;
    guardarTodos(copia);

    return actualizado;
  },
};
