import "dotenv/config";

function required(name: string): string { const value = process.env[name]?.trim(); if (!value) throw new Error(`La variable de entorno ${name} es obligatoria.`); return value; }
export const env = {
  port: Number(process.env.PORT ?? 3000), host: process.env.HOST ?? "0.0.0.0",
  get mongoUri() { return required("MONGODB_URI"); },
  get jwtSecret() { return required("JWT_SECRET"); },
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h", corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
