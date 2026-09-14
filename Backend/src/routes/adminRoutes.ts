import { Router } from "express";
import * as c from "../controllers/adminController.js";
import { requireAdmin, requireAuth, requireSuperAdmin } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router=Router();
router.use(requireAuth,requireAdmin);
router.get("/",asyncHandler(c.list));
router.get("/:id",asyncHandler(c.get));
router.post("/",requireSuperAdmin,asyncHandler(c.create));
router.patch("/:id",asyncHandler(c.update));
router.patch("/:id/estado",asyncHandler(c.changeStatus));
export default router;