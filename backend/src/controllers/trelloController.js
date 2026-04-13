import { getBoards, getMetrics } from "../services/trelloService.js";

export async function fetchBoards(req, res) {
  try {
    const data = await getBoards();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar boards" });
  }
}

export async function fetchMetrics(req, res) {
  try {
    const { boardId } = req.params;
    const data = await getMetrics(boardId);
    return res.json(data);
  } 
  catch (error) {
  console.error("ERRO REAL METRICS:", error);

  res.status(500).json({
    error: error.message,
    detalhe: error.response?.data || null
  });
  }
}