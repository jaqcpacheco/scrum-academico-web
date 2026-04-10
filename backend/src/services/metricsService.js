import { getBoardData } from "./trelloService.js";
import { generateInsight } from "../utils/insights.js";

export async function getMetrics(boardId) {
  const { lists, cards, members } = await getBoardData(boardId);

  const total = cards.length;

  // 🔥 identificar listas
  const backlogList = lists.find(l => l.name.toLowerCase().includes("backlog"));
  const andamentoList = lists.find(l => l.name.toLowerCase().includes("andamento"));
  const doneList = lists.find(l => l.name.toLowerCase().includes("concluído"));

  const backlog = cards.filter(c => c.idList === backlogList?.id).length;
  const emAndamento = cards.filter(c => c.idList === andamentoList?.id).length;
  const concluidas = cards.filter(c => c.idList === doneList?.id).length;

  const produtividade = total > 0
    ? Math.round((concluidas / total) * 100)
    : 0;

  // 👥 tarefas por membro
  const tarefasPorMembro = members.map(member => {
    const quantidade = cards.filter(c =>
      c.idMembers.includes(member.id)
    ).length;

    return {
      nome: member.fullName,
      quantidade
    };
  });

  // 📈 histórico (simulado por enquanto)
  const historico = [
    Math.max(concluidas - 10, 0),
    Math.max(concluidas - 5, 0),
    Math.max(concluidas - 2, 0),
    concluidas
  ];

  const insight = generateInsight({ emAndamento, concluidas });

  const gargalo =
    emAndamento > concluidas
      ? "Alto volume de tarefas em andamento"
      : "Fluxo de trabalho equilibrado";

  return {
    total,
    backlog,
    emAndamento,
    concluidas,
    produtividade,
    tarefasPorMembro,
    historico,
    insight,
    gargalo
  };
}