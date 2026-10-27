/**
 * Carga 16 personas FICTICIAS de prueba (2 por distrito, Distritos 1 a 8 de Sucre)
 * en la base indicada por MONGO_URI (por ejemplo desaparecidos_bd).
 *
 * Requisito: debe existir al menos un administrador (usa tu script create-admin
 * antes), porque cada persona se asocia a un admin en "publicadoPor".
 *
 * Uso:
 *   npm run seed            -> carga los datos (aborta si ya hay personas)
 *   npm run seed -- --reset -> borra TODAS las personas de la base y recarga
 *
 * Todos los nombres, documentos, teléfonos y correos son inventados.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { PersonaModel, DISTRITOS } from "../models/Persona.js";
import { CounterModel } from "../models/Counter.js";

type Semilla = {
  nombre: string; apellidoPaterno: string; apellidoMaterno: string;
  sexo: "MASCULINO" | "FEMENINO" | "OTRO"; edad: number;
  estado: "No_localizada" | "Desaparecida" | "encontrada_vida";
  circunstancias: string; ultimoLugarVisto: string;
};

const SEMILLAS: Semilla[] = [
  { nombre: "Luis", apellidoPaterno: "Mendoza", apellidoMaterno: "Rojas", sexo: "MASCULINO", edad: 34, estado: "Desaparecida", circunstancias: "Salió a trabajar y no regresó a su domicilio.", ultimoLugarVisto: "Parada de minibús, avenida principal" },
  { nombre: "María", apellidoPaterno: "Quispe", apellidoMaterno: "Flores", sexo: "FEMENINO", edad: 17, estado: "Desaparecida", circunstancias: "No llegó al colegio tras salir de casa.", ultimoLugarVisto: "Cerca de la unidad educativa" },
  { nombre: "Carlos", apellidoPaterno: "Vargas", apellidoMaterno: "Choque", sexo: "MASCULINO", edad: 72, estado: "No_localizada", circunstancias: "Salió a caminar y no recordó el camino de regreso.", ultimoLugarVisto: "Plaza del barrio" },
  { nombre: "Ana", apellidoPaterno: "Gutiérrez", apellidoMaterno: "Salazar", sexo: "FEMENINO", edad: 25, estado: "Desaparecida", circunstancias: "Dejó de comunicarse con su familia.", ultimoLugarVisto: "Terminal de buses" },
  { nombre: "Jorge", apellidoPaterno: "Ramos", apellidoMaterno: "Poma", sexo: "MASCULINO", edad: 41, estado: "Desaparecida", circunstancias: "Salió en bicicleta y no volvió.", ultimoLugarVisto: "Camino a las afueras de la ciudad" },
  { nombre: "Lucía", apellidoPaterno: "Torrez", apellidoMaterno: "Aguilar", sexo: "FEMENINO", edad: 14, estado: "Desaparecida", circunstancias: "No regresó de la casa de una amiga.", ultimoLugarVisto: "Calle cercana a su domicilio" },
  { nombre: "Pedro", apellidoPaterno: "Condori", apellidoMaterno: "Mamani", sexo: "MASCULINO", edad: 58, estado: "No_localizada", circunstancias: "Se ausentó del trabajo sin avisar.", ultimoLugarVisto: "Mercado" },
  { nombre: "Rosa", apellidoPaterno: "Cruz", apellidoMaterno: "Villca", sexo: "FEMENINO", edad: 63, estado: "encontrada_vida", circunstancias: "Se extravió; fue localizada en buen estado.", ultimoLugarVisto: "Centro de salud" },
  { nombre: "Diego", apellidoPaterno: "Fernández", apellidoMaterno: "Lara", sexo: "MASCULINO", edad: 19, estado: "Desaparecida", circunstancias: "Salió con amigos y no regresó.", ultimoLugarVisto: "Zona de comercio nocturno" },
  { nombre: "Valeria", apellidoPaterno: "Montaño", apellidoMaterno: "Sánchez", sexo: "FEMENINO", edad: 30, estado: "Desaparecida", circunstancias: "No volvió tras salir de su trabajo.", ultimoLugarVisto: "Oficina, salida a las 18:00" },
  { nombre: "Mateo", apellidoPaterno: "Álvarez", apellidoMaterno: "Cori", sexo: "MASCULINO", edad: 9, estado: "No_localizada", circunstancias: "Se separó de sus familiares en un evento público.", ultimoLugarVisto: "Parque del barrio" },
  { nombre: "Elena", apellidoPaterno: "Ríos", apellidoMaterno: "Tapia", sexo: "FEMENINO", edad: 47, estado: "Desaparecida", circunstancias: "Salió de compras y no regresó.", ultimoLugarVisto: "Mercado central" },
  { nombre: "Héctor", apellidoPaterno: "Salinas", apellidoMaterno: "Duran", sexo: "MASCULINO", edad: 81, estado: "No_localizada", circunstancias: "Persona adulta mayor con problemas de memoria.", ultimoLugarVisto: "Frente a su domicilio" },
  { nombre: "Camila", apellidoPaterno: "Barrón", apellidoMaterno: "Ayala", sexo: "FEMENINO", edad: 22, estado: "Desaparecida", circunstancias: "Perdió contacto tras salir de la universidad.", ultimoLugarVisto: "Puerta de la universidad" },
  { nombre: "Andrés", apellidoPaterno: "Zamora", apellidoMaterno: "Núñez", sexo: "MASCULINO", edad: 36, estado: "Desaparecida", circunstancias: "No volvió de un viaje corto fuera de la ciudad.", ultimoLugarVisto: "Salida a carretera" },
  { nombre: "Daniela", apellidoPaterno: "Limachi", apellidoMaterno: "Vega", sexo: "FEMENINO", edad: 16, estado: "encontrada_vida", circunstancias: "Salió sin avisar; fue localizada en casa de un familiar.", ultimoLugarVisto: "Domicilio" },
];

const fechaNacimiento = (edad: number) => new Date(new Date().getFullYear() - edad, 5, 15);
const haceDias = (d: number) => new Date(Date.now() - d * 86_400_000);

async function main() {
  const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGO_URI en el .env");
  const reset = process.argv.includes("--reset");

  await mongoose.connect(uri);
  console.log(`Base de datos: ${mongoose.connection.name}`);

  const admin = await mongoose.connection.collection("admins").findOne({});
  if (!admin) {
    throw new Error('No hay administradores en la base. Crea uno primero (script create-admin) y vuelve a ejecutar.');
  }

  const existentes = await PersonaModel.countDocuments();
  if (existentes > 0 && !reset) {
    throw new Error(`Ya hay ${existentes} personas. Usa "npm run seed -- --reset" para borrarlas y recargar.`);
  }
  if (reset) await PersonaModel.deleteMany({});

  const docs = SEMILLAS.map((s, i) => ({
    codigo: `PD-${String(i + 1).padStart(4, "0")}`,
    nombre: s.nombre,
    apellidoPaterno: s.apellidoPaterno,
    apellidoMaterno: s.apellidoMaterno,
    sexo: s.sexo,
    fechaNacimiento: fechaNacimiento(s.edad),
    edad: s.edad,
    numeroDocumento: String(9000000 + i),
    nacionalidad: "Boliviana",
    foto: "",
    fechaDesaparicion: haceDias(5 + i * 6),
    horaAproximada: `${String(8 + (i % 12)).padStart(2, "0")}:00`,
    distrito: DISTRITOS[i % DISTRITOS.length],
    ciudad: "Sucre",
    zona: `Zona de prueba ${(i % DISTRITOS.length) + 1}`,
    circunstancias: s.circunstancias,
    ultimoLugarVisto: s.ultimoLugarVisto,
    nombreReportante: `Familiar de prueba ${i + 1}`,
    documentoReportante: String(8000000 + i),
    parentesco: ["Madre", "Padre", "Hermano/a", "Esposo/a", "Hijo/a"][i % 5],
    correoReportante: `reportante${i + 1}@example.com`,
    contactoReportante: `7000${String(1000 + i)}`,
    estado: s.estado,
    publicadoPor: admin._id,
  }));

  await PersonaModel.insertMany(docs);
  await CounterModel.findOneAndUpdate(
    { _id: "personas" }, { $set: { sequence: docs.length } }, { upsert: true },
  );

  console.log(`Personas de prueba creadas: ${docs.length} (PD-0001 a PD-${String(docs.length).padStart(4, "0")})`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
