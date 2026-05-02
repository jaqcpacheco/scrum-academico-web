import History from "../models/History.js";

export async function processarHistorico(boardId, dados) {
  let variacao = null;

  try {
    const ultimo = await History.findOne({ boardId })
      .sort({ createdAt: -1 });

    if (ultimo) {
      variacao = {
        concluidas: (dados.concluidas || 0) - (ultimo.concluidas || 0),
        emAndamento: (dados.emAndamento || 0) - (ultimo.emAndamento || 0),
        backlog: (dados.backlog || 0) - (ultimo.backlog || 0)
      };
    }

    await History.create({
      boardId,
      ...dados
    });

  } catch (error) {
    console.error("⚠️ Erro no histórico:", error.message);
  }

  return variacao;
}