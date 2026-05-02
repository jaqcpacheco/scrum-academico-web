import { getBoards } from "../services/trelloService.js";

export async function fetchBoards(req, res) { //controller da API
  try {
    const boards = await getBoards();// responsável por buscar os quadros
                                     
    return res.json({
      success: true,
      data: Array.isArray(boards) ? boards : []
    });

  } catch (err) {
    console.error("Erro ao buscar boards:", err.message);

    return res.status(500).json({
      success: false,
      error: "Erro ao buscar boards"
    });
  }
}