import { getBoardData } from "../services/trelloService.js";
import { calcularMetricas } from "../services/metricsService.js";
import { processarHistorico } from "../services/historyService.js";
import User from "../models/User.js";

export async function fetchMetrics(req, res) {
  try {
    const { boardId } = req.params;

    if (!boardId || typeof boardId !== "string") {
      return res.status(400).json({
        success: false,
        error: "BoardId inválido"
      });
    }

    const { userId } = req.query;

    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado"
      });
    }

    const dadosTrello = await getBoardData(
      boardId,
      user.trelloKey,
      user.trelloToken
    );

    if (!dadosTrello) {
      return res.status(404).json({
        success: false,
        error: "Board não encontrado"
      });
    }

    const dados = await calcularMetricas(
      dadosTrello || { lists: [], cards: [] }
    );

    const dadosNormalizados = {
      ...dados,
      produtividade: dados.produtividade || dados.taxaConclusao || 0
    };

    const variacao = await processarHistorico(
      userId,
      boardId,
      dadosNormalizados
    );

    return res.json({
      success: true,
      data: {
        ...dadosNormalizados,
        variacao
      }
    });

  } catch (error) {
    console.error("ERRO METRICS:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Erro interno ao processar métricas"
    });
  }
}
