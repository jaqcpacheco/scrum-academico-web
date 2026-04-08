import { Router } from "express";
import { fetchBoards, fetchMetrics } from "../controllers/trelloController.js";

const router = Router();

router.get("/boards", fetchBoards);
router.get("/metrics/:boardId", fetchMetrics);

export default router;