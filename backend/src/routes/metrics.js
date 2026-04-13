import express from "express";
import { getMetrics } from "../services/metricsService.js";

const router = express.Router(); // 👈 também precisa

router.get("/:boardId", async (req, res) => {
  try {
    const data = await getMetrics(req.params.boardId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular métricas" });
  }
});

router.post("/:boardId", async (req, res) => {
  try {
    const { key, token } = req.body;

    const data = await getMetrics(
      req.params.boardId,
      key,
      token
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular métricas" });
  }
});

export default router;