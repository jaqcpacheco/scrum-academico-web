import express from "express";
import { getBoards } from "../services/trelloService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const boards = await getBoards();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar boards" });
  }
});

export default router;