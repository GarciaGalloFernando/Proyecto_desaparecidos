import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const usersFile = fileURLToPath(new URL("../data/users.json", import.meta.url));
const users = JSON.parse(await readFile(usersFile, "utf8"));

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("La solicitud es demasiado grande."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("El cuerpo de la solicitud debe ser JSON válido.")); }
    });
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  if (request.method === "OPTIONS") return sendJson(response, 204, {});
  if (request.method === "GET" && url.pathname === "/api/health") return sendJson(response, 200, { status: "ok" });

  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const { carnet, password } = await readJsonBody(request);
      if (typeof carnet !== "string" || typeof password !== "string") {
        return sendJson(response, 400, { message: "El carnet y la contraseña son obligatorios." });
      }
      const user = users.find((candidate) => candidate.carnet === carnet.trim() && candidate.password === password);
      if (!user) return sendJson(response, 401, { message: "El carnet o la contraseña son incorrectos." });

      const { password: _password, ...safeUser } = user;
      return sendJson(response, 200, { user: safeUser });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Solicitud inválida.";
      return sendJson(response, 400, { message });
    }
  }
  return sendJson(response, 404, { message: "Ruta no encontrada." });
});

server.listen(PORT, HOST, () => console.log(`API disponible en http://localhost:${PORT}`));
