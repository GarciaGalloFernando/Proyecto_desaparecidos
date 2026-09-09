const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export type Persona = {
  id: string; codigo: string; nombre: string; apellidoPaterno: string; apellidoMaterno: string;
  sexo: "MASCULINO" | "FEMENINO" | "OTRO"; fechaNacimiento: string; edad: number;
  numeroDocumento?: string; nacionalidad: string; foto?: string;
  fechaDesaparicion: string; horaAproximada?: string; departamento: string; ciudad: string;
  zona?: string; circunstancias?: string; ultimoLugarVisto?: string;
  estado: "No_localizada" | "Desaparecida" | "encontrada_vida" | "encontrada_fallecida";
  nombreReportante?: string; contactoReportante?: string; correoReportante?: string;
  publicadoPor?: { nombre?: string } | null; fechaRegistro: string; fechaActualizacion: string;
};

export type PersonaFilters = Partial<Record<"nombre"|"apellidoPaterno"|"departamento"|"ciudad"|"edad"|"edadMin"|"edadMax"|"sexo"|"estado", string>>;

export async function getPersonas(filters: PersonaFilters = {}) {
  const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string,string][]);
  const response = await fetch(`${API_URL}/personas${q.size ? `?${q.toString()}` : ""}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? "No fue posible cargar los registros.");
  return data as Persona[];
}

export async function getPersona(id: string): Promise<Persona> {
  const response = await fetch(`${API_URL}/personas/${id}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? "No fue posible cargar el registro.");
  return data as Persona;
}