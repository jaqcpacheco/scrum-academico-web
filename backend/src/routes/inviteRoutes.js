import express from "express";
import {
  generateInvite,
  validateInvite,
  acceptInvite
} from "../controllers/inviteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateInvite);

router.get("/validate/:code", validateInvite);

router.post("/accept", acceptInvite);

export default router;
