import { Router } from "express";
import auth from "./authRoutes.js";
import personas from "./personaRoutes.js";
import admins from "./adminRoutes.js";
import health from "./healthRoutes.js";

const r=Router();
r.use("/auth",auth);
r.use("/personas",personas);
r.use("/admins",admins);
r.use("/health",health);
export default r;
