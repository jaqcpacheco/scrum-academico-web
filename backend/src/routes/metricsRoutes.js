import express from "express";
import { fetchMetrics } from "../controllers/metricsController.js";

const router = express.Router();

//GET /api/metrics/:boardId
router.get("/:boardId", fetchMetrics);

export default router;