import { storageService } from "../services/storageService";
import { PERSONAS_MOCK } from "../data/personasAdminMock";
import type {
  EstadoPersona,
  PersonaDesaparecida,
  PersonaFormData,
} from "../types/personaAdmin";

// ⚠️ REPOSITORIO MOCK (SOLO FRONTEND) ⚠️
//
// El módulo "Gestión de Personas Desaparecidas" todavía no está conectado
// a un backend real. Este repositorio simula las operaciones CRUD guardando
// los datos en localStorage, para poder navegar y probar las pantallas del
// panel administrativo de forma independiente.
//
// Cuando exista una API real, este archivo debe reemplazarse por llamadas
// HTTP equivalentes, manteniendo la misma interfaz pública.

const STORAGE_KEY = "app_personas_admin_mock";
const SIMULATED_DELAY_MS = 250;

function delay(ms: number = SIMULATED_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function leerTodas(): PersonaDesaparecida[] {
  const almacenadas = storageService.get<PersonaDesaparecida[]>(STORAGE_KEY);

  if (almacenadas) {
    return almacenadas;
  }

  storageService.set(STORAGE_KEY, PERSONAS_MOCK);
  return PERSONAS_MOCK;
}

function guardarTodas(personas: PersonaDesaparecida[]): void {
  storageService.set(STORAGE_KEY, personas);
}

function generarCodigo(existentes: PersonaDesaparecida[]): string {
  const maximo = existentes.reduce((acc, persona) => {
    const numero = Number(persona.codigo.replace(/\D/g, ""));
    return Number.isFinite(numero) ? Math.max(acc, numero) : acc;
  }, 0);

  return `PD-${String(maximo + 1).padStart(4, "0")}`;
}

function generarId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const personaAdminRepository = {
  async listar(): Promise<PersonaDesaparecida[]> {
    await delay();
    return [...leerTodas()].sort((a, b) =>
      b.fechaRegistro.localeCompare(a.fechaRegistro),
    );
  },

  async obtener(id: string): Promise<PersonaDesaparecida | null> {
    await delay();
    return leerTodas().find((persona) => persona.id === id) ?? null;
  },

  async crear(datos: PersonaFormData): Promise<PersonaDesaparecida> {
    await delay();

    const personas = leerTodas();
    const ahora = new Date().toISOString();

    const nueva: PersonaDesaparecida = {
      ...datos,
      id: generarId(),
      codigo: generarCodigo(personas),
      estado: "DESAPARECIDA",
      fechaRegistro: ahora,
      actualizadoEn: ahora,
    };

    guardarTodas([...personas, nueva]);
    return nueva;
  },

  async actualizar(
    id: string,
    datos: PersonaFormData,
  ): Promise<PersonaDesaparecida> {
    await delay();

    const personas = leerTodas();
    const indice = personas.findIndex((persona) => persona.id === id);

    if (indice === -1) {
      throw new Error("El registro que intenta editar no existe.");
    }

    const actualizado: PersonaDesaparecida = {
      ...personas[indice],
      ...datos,
      actualizadoEn: new Date().toISOString(),
    };

    const copia = [...personas];
    copia[indice] = actualizado;
    guardarTodas(copia);

    return actualizado;
  },

  async cambiarEstado(
    id: string,
    estado: EstadoPersona,
  ): Promise<PersonaDesaparecida> {
    await delay();

    const personas = leerTodas();
    const indice = personas.findIndex((persona) => persona.id === id);

    if (indice === -1) {
      throw new Error("El registro que intenta actualizar no existe.");
    }

    const actualizado: PersonaDesaparecida = {
      ...personas[indice],
      estado,
      actualizadoEn: new Date().toISOString(),
    };

    const copia = [...personas];
    copia[indice] = actualizado;
    guardarTodas(copia);

    return actualizado;
  },

  async eliminar(id: string): Promise<void> {
    await delay();
    guardarTodas(leerTodas().filter((persona) => persona.id !== id));
  },
};
