export type Sexo = "MASCULINO" | "FEMENINO" | "OTRO";

export type EstadoPersona = "No_localizada" | "Desaparecida" | "encontrada_vida" | "encontrada_fallecida";

export interface EstadoPersonaOption { value: EstadoPersona; label: string; }

export const ESTADOS_PERSONA: EstadoPersonaOption[] = [
  { value: "No_localizada", label: "No localizada" },
  { value: "Desaparecida", label: "Desaparecida" },
  { value: "encontrada_vida", label: "Encontrada con vida" },
  { value: "encontrada_fallecida", label: "Encontrada fallecida" },
];

export interface PublicadoPor { id?: string; nombre?: string; email?: string; carnet?: string; rol?: string; }

export interface PersonaDesaparecida {
  id: string; codigo: string; nombre: string; apellidoPaterno: string; apellidoMaterno: string;
  sexo: Sexo; fechaNacimiento: string; edad: number; numeroDocumento?: string; nacionalidad: string; foto?: string;
  fechaDesaparicion: string; horaAproximada?: string; departamento: string; ciudad: string; zona?: string;
  circunstancias?: string; ultimoLugarVisto?: string;
  estado: EstadoPersona; publicadoPor?: PublicadoPor | null; fechaRegistro: string; fechaActualizacion: string;
  nombreReportante?: string; documentoReportante?: string; parentesco?: string; correoReportante?: string; contactoReportante?: string;
}

export type PersonaFormData = Omit<PersonaDesaparecida, "id"|"codigo"|"estado"|"publicadoPor"|"fechaRegistro"|"fechaActualizacion">;

export function nombreCompleto(persona: PersonaDesaparecida): string {
  return `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
}
