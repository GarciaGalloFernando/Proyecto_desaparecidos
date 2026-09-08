import { type FilterQuery } from "mongoose";
import { CounterModel } from "../models/Counter.js";
import { PersonaModel, type Persona } from "../models/Persona.js";

export type PersonaFilters = {
  nombre?: string; apellidoPaterno?: string; departamento?: string; ciudad?: string;
  edad?: string; edadMin?: string; edadMax?: string; sexo?: string; estado?: string;
};

async function generarCodigo(): Promise<string> {
  const counter = await CounterModel.findOneAndUpdate(
    { _id: "personas" }, { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return `PD-${String(counter?.sequence ?? 1).padStart(4, "0")}`;
}

export const personaRepository = {
  async findAll(filters: PersonaFilters) {
    const q: FilterQuery<Persona> = {};
    if (filters.nombre) q.nombre = { $regex: filters.nombre, $options: "i" };
    if (filters.apellidoPaterno) q.apellidoPaterno = { $regex: filters.apellidoPaterno, $options: "i" };
    if (filters.ciudad) q.ciudad = { $regex: filters.ciudad, $options: "i" };
    for (const key of ["departamento","sexo","estado"] as const) if (filters[key]) q[key] = filters[key];

    const age: Record<string, number> = {};
    if (filters.edad) age.$eq = Number(filters.edad);
    if (filters.edadMin) age.$gte = Number(filters.edadMin);
    if (filters.edadMax) age.$lte = Number(filters.edadMax);
    if (Object.keys(age).length) q.edad = age;

    return PersonaModel.find(q).populate("publicadoPor","nombre email carnet rol")
      .sort({ fechaRegistro: -1 }).lean();
  },

  findById: (id: string) => PersonaModel.findById(id)
    .populate("publicadoPor","nombre email carnet rol").lean(),

  async create(data: Omit<Partial<Persona>, "codigo">) {
    return PersonaModel.create({ ...data, codigo: await generarCodigo() });
  },

  update: (id: string, data: Partial<Persona>) => {
    const { codigo, publicadoPor, fechaRegistro, ...permitidos } = data;
    void codigo; void publicadoPor; void fechaRegistro;
    return PersonaModel.findByIdAndUpdate(
      id, { $set: { ...permitidos, fechaActualizacion: new Date() } },
      { new: true, runValidators: true },
    ).populate("publicadoPor","nombre email carnet rol").lean();
  },

  remove: (id: string) => PersonaModel.findByIdAndDelete(id).lean(),
};
