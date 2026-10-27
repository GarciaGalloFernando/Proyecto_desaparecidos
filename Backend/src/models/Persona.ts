import { Schema, model, type InferSchemaType } from "mongoose";

export const DISTRITOS = [
  "Distrito 1", "Distrito 2", "Distrito 3", "Distrito 4",
  "Distrito 5", "Distrito 6", "Distrito 7", "Distrito 8",
] as const;

// Alias temporal: evita errores de compilación si otro archivo (rutas/validaciones)
// todavía importa DEPARTAMENTOS. Reemplaza esos usos por DISTRITOS y luego borra esta línea.
export const DEPARTAMENTOS = DISTRITOS;

export const SEXOS = ["MASCULINO","FEMENINO","OTRO"] as const;
export const ESTADOS_PERSONA = ["No_localizada","Desaparecida","encontrada_vida","encontrada_fallecida"] as const;

const schema = new Schema({
  codigo: { type: String, required: true, unique: true, index: true, trim: true },
  nombre: { type: String, required: true, trim: true },
  apellidoPaterno: { type: String, required: true, trim: true },
  apellidoMaterno: { type: String, required: true, trim: true },
  sexo: { type: String, required: true, enum: SEXOS },
  fechaNacimiento: { type: Date, required: true },
  edad: { type: Number, required: true, min: 0, max: 130 },
  numeroDocumento: { type: String, trim: true, default: "" },
  nacionalidad: { type: String, required: true, trim: true },
  foto: { type: String, trim: true, default: "" },

  fechaDesaparicion: { type: Date, required: true },
  horaAproximada: { type: String, trim: true, default: "" },
  distrito: { type: String, required: true, enum: DISTRITOS },
  ciudad: { type: String, required: true, trim: true, default: "Sucre" },
  zona: { type: String, trim: true, default: "" },
  circunstancias: { type: String, trim: true, default: "" },
  ultimoLugarVisto: { type: String, trim: true, default: "" },

  nombreReportante: { type: String, required: true, trim: true },
  documentoReportante: { type: String, required: true, trim: true },
  parentesco: { type: String, required: true, trim: true },
  correoReportante: { type: String, required: true, trim: true, lowercase: true },
  contactoReportante: { type: String, required: true, trim: true },

  estado: { type: String, required: true, enum: ESTADOS_PERSONA, default: "Desaparecida" },
  publicadoPor: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  fechaRegistro: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
}, { collection: "personas", versionKey: false });

schema.pre("save", function(next) { this.fechaActualizacion = new Date(); next(); });
schema.index({ nombre: 1, apellidoPaterno: 1, apellidoMaterno: 1 });
schema.index({ distrito: 1, estado: 1 });

export type Persona = InferSchemaType<typeof schema>;
export const PersonaModel = model("Persona", schema);
