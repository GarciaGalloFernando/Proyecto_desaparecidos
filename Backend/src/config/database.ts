import mongoose from "mongoose";
import { env } from "./env.js";
export async function connectDatabase(): Promise<void> { await mongoose.connect(env.mongoUri); }
export async function disconnectDatabase(): Promise<void> { await mongoose.disconnect(); }
export function databaseConnected(): boolean { return mongoose.connection.readyState === 1; }
