import express from "express";
import { getBoards } from "../services/trelloService.js";

const router = express.Router(); // 👈 ISSO FALTAVA

router.get("/", async (req, res) => {
  try {
    const boards = await getBoards();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar boards" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { key, token } = req.body;
    const boards = await getBoards(key, token);
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar boards" });
  }
});

export default router;