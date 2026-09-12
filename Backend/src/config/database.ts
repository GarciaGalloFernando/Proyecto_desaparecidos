import mongoose from "mongoose";
import { env } from "./env.js";

let connectingPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<void> {
  if (databaseConnected()) {
    return;
  }

  if (!connectingPromise) {
    connectingPromise = mongoose.connect(env.mongoUri);
  }

  await connectingPromise;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectingPromise = null;
}

export function databaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}