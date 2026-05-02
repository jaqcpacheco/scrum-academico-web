import { getBoardData } from "../services/trelloService.js";
import { calcularMetricas } from "../services/metricsService.js";
import { processarHistorico } from "../services/historyService.js";

export async function fetchMetrics(req, res) {
  try {
    const { boardId } = req.params;

    if (!boardId || typeof boardId !== "string") {
      return res.status(400).json({
        success: false,
        error: "BoardId inválido"
      });
    }

    const dadosTrello = await getBoardData(boardId);

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

    const variacao = await processarHistorico(boardId, dadosNormalizados);

    return res.json({
      success: true,
      data: {
        ...dadosNormalizados,
        variacao
      }
    });

  } catch (error) {
    console.error(" ERRO METRICS:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Erro interno ao processar métricas"
    });
  }
}