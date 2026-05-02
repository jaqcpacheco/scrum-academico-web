// routes/historyRoutes.js

import express from "express";
import History from "../models/History.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const historico = await History.find()
      .sort({ createdAt: -1 });

    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

export default router;