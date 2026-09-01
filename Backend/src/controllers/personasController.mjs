import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const personasFile = fileURLToPath(new URL("../../data/personas.json", import.meta.url));

export async function listarPersonas(response, sendJson) {
  try {
    const personas = JSON.parse(await readFile(personasFile, "utf8"));
    return sendJson(response, 200, personas);
  } catch {
    return sendJson(response, 500, { message: "No fue posible obtener las personas." });
  }
}
