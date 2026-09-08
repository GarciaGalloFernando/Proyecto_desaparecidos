import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),

  host: process.env.HOST ?? "localhost",

  mongoUri: process.env.MONGO_URI ?? "",

  jwtSecret: process.env.JWT_SECRET ?? "",

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};