import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`La variable de entorno ${name} es obligatoria.`);
  }

  return value;
}

// Permite MONGODB_URI (recomendado) o MONGO_URI
function requiredMongoUri(): string {
  const value =
    process.env.MONGODB_URI?.trim() ||
    process.env.MONGO_URI?.trim();

  if (!value) {
    throw new Error(
      "La variable de entorno MONGODB_URI o MONGO_URI es obligatoria."
    );
  }

  return value;
}

export const env = {
  host: process.env.HOST ?? "localhost",

  port: Number(process.env.PORT ?? 3000),

  mongoUri: requiredMongoUri(),

  jwtSecret: required("JWT_SECRET"),

  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};