import { Router } from "express";

import * as c from "../controllers/personaController.js";
import {
  requireAdmin,
  requireAuth,
} from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(c.list));

router.get("/:id", asyncHandler(c.get));

router.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(c.create),
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(c.update),
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(c.remove),
);

export default router;