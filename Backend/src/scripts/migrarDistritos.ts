/**
 * Migra la colección "personas": departamento -> distrito.
 * SOLO sirve si tienes una base con registros antiguos. Para una base nueva
 * (desaparecidos_bd) NO lo necesitas: usa seedSucre.ts.
 *
 * - Los registros que ya tienen un distrito válido ("Distrito 1" a "Distrito 8") no se tocan.
 * - Los que no tienen distrito, o tienen un valor viejo (ej. "La Paz"), se reparten
 *   en orden entre los Distritos 1 a 8 (REVÍSALOS luego desde el panel de admin)
 *   y reciben ciudad = "Sucre".
 * - El campo "departamento" se elimina.
 *
 * Lee MONGO_URI del .env (también acepta MONGODB_URI).
 */
import "dotenv/config";
import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGO_URI en el .env");

  await mongoose.connect(uri);
  const col = mongoose.connection.collection("personas");

  const validos = Array.from({ length: 8 }, (_, i) => `Distrito ${i + 1}`);
  const pendientes = await col.find({ distrito: { $nin: validos } }).toArray();

  let n = 0;
  for (const p of pendientes) {
    await col.updateOne(
      { _id: p._id },
      {
        $set: { distrito: validos[n % validos.length], ciudad: "Sucre" },
        $unset: { departamento: "" },
      },
    );
    n++;
  }
  console.log(`Personas migradas: ${n}`);

  try { await col.dropIndex("departamento_1_estado_1"); } catch { /* no existía */ }
  await col.createIndex({ distrito: 1, estado: 1 });

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
