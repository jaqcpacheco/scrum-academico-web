import express from "express";
import { getMetrics } from "../services/metricsService.js";

const router = express.Router();

router.get("/:boardId", async (req, res) => {
  try {
    const data = await getMetrics(req.params.boardId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular métricas" });
  }
});

export default router;