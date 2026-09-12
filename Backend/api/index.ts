import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("No fue posible conectar con MongoDB:", error);
    res.status(500).json({ message: "Error de conexión con la base de datos" });
    return;
  }

  app(req, res);
}