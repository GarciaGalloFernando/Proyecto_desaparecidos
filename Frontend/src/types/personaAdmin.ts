// Tipos del módulo "Gestión de Personas Desaparecidas" (panel administrativo).
// Este módulo trabaja únicamente con datos MOCK en el frontend, sin backend real.

export type Sexo = "MASCULINO" | "FEMENINO" | "OTRO";

export type EstadoPersona =
  | "DESAPARECIDA"
  | "EN_INVESTIGACION"
  | "ENCONTRADA_VIDA"
  | "ENCONTRADA_FALLECIDA"
  | "CASO_CERRADO";

export interface EstadoPersonaOption {
  value: EstadoPersona;
  label: string;
}

export const ESTADOS_PERSONA: EstadoPersonaOption[] = [
  { value: "DESAPARECIDA", label: "Desaparecida" },
  { value: "EN_INVESTIGACION", label: "En investigación" },
  { value: "ENCONTRADA_VIDA", label: "Encontrada con vida" },
  { value: "ENCONTRADA_FALLECIDA", label: "Encontrada fallecida" },
  { value: "CASO_CERRADO", label: "Caso cerrado" },
];

export interface PersonaDesaparecida {
  id: string;
  codigo: string;
  foto?: string;

  // Datos personales
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: Sexo;
  fechaNacimiento: string;
  edad: number;
  numeroDocumento?: string;
  nacionalidad: string;

  // Datos de la desaparición
  fechaDesaparicion: string;
  horaAproximada?: string;
  departamento: string;
  ciudad: string;
  zona?: string;
  direccion: string;
  circunstancias?: string;
  ultimoLugarVisto?: string;

  // Datos de sistema (generados por el mock)
  estado: EstadoPersona;
  fechaRegistro: string;
  actualizadoEn: string;
}

// Datos que se editan desde el formulario de registro/edición.
// El estado se administra aparte, mediante la acción "Cambiar estado".
export type PersonaFormData = Omit<
  PersonaDesaparecida,
  "id" | "codigo" | "estado" | "fechaRegistro" | "actualizadoEn"
>;

export function nombreCompleto(persona: PersonaDesaparecida): string {
  return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
}
