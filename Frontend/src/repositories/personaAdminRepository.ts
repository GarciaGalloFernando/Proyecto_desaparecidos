import { authRepository } from "./authRepository";
import type { EstadoPersona, PersonaDesaparecida, PersonaFormData } from "../types/personaAdmin";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authRepository.getAuthorizationHeader(),
      ...(options.headers ?? {}),
    },
  });
  const data = response.status === 204 ? undefined : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message ?? "No fue posible completar la operación.");
  return data as T;
}

export const personaAdminRepository = {
  listar: () => request<PersonaDesaparecida[]>(`${API_URL}/personas`),
  obtener: async (id: string) => {
    try { return await request<PersonaDesaparecida>(`${API_URL}/personas/${id}`); }
    catch (e) { if (e instanceof Error && e.message === "Persona no encontrada.") return null; throw e; }
  },
  crear: (datos: PersonaFormData) => request<PersonaDesaparecida>(`${API_URL}/personas`, { method: "POST", body: JSON.stringify(datos) }),
  actualizar: (id: string, datos: PersonaFormData) => request<PersonaDesaparecida>(`${API_URL}/personas/${id}`, { method: "PATCH", body: JSON.stringify(datos) }),
  cambiarEstado: (id: string, estado: EstadoPersona) => request<PersonaDesaparecida>(`${API_URL}/personas/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),
  eliminar: (id: string) => request<void>(`${API_URL}/personas/${id}`, { method: "DELETE" }),
};
