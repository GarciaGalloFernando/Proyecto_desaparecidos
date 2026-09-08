import "dotenv/config";

const mongoUri = process.env.MONGO_URI ?? process.env.MONGODB_URI ?? "";
const jwtSecret = process.env.JWT_SECRET ?? "";

if (!mongoUri) throw new Error("MONGO_URI/MONGODB_URI no está definido en .env");
if (!jwtSecret) throw new Error("JWT_SECRET no está definido en .env");

export const env = {
  port:Number(process.env.PORT ?? 3000),
  host:process.env.HOST ?? "localhost",
  mongoUri,
  jwtSecret,
  jwtExpiresIn:process.env.JWT_EXPIRES_IN ?? "1h",
  corsOrigin:process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
