import { createApp } from "./app.mjs";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const server = createApp();

server.listen(PORT, HOST, () => console.log(`API disponible en http://localhost:${PORT}`));
