import { gerarInsightIA } from "./aiService.js";

export async function calcularMetricas(data) {
  const lists = data?.lists || [];
  const cards = data?.cards || [];

  //Mapear listas
  const listMap = Object.fromEntries(
    lists.map(list => [list.id, (list.name || "").toLowerCase()])
  );

  //Categorias
  const doneNames = ["done", "conclu", "final", "feito"];
  const doingNames = ["andamento", "doing", "progress"];
  const backlogNames = ["backlog", "to do", "a fazer"];

  let concluidas = 0;
  let emAndamento = 0;
  let backlog = 0;
  let outros = 0;

  cards.forEach(card => {
    const listName = listMap[card.idList] || "";

    if (doneNames.some(n => listName.includes(n))) {
      concluidas++;
    } else if (doingNames.some(n => listName.includes(n))) {
      emAndamento++;
    } else if (backlogNames.some(n => listName.includes(n))) {
      backlog++;
    } else {
      outros++;
    }
  });

  const total = cards.length;

  //porcentagens
  const porcentagens = {
    concluidas: total ? Number(((concluidas / total) * 100).toFixed(1)) : 0,
    emAndamento: total ? Number(((emAndamento / total) * 100).toFixed(1)) : 0,
    backlog: total ? Number(((backlog / total) * 100).toFixed(1)) : 0
  };

  //métricas base
  const eficiencia = emAndamento > 0
    ? Number((concluidas / emAndamento).toFixed(2))
    : 0;

  const produtividade = porcentagens.concluidas;

  const wip = emAndamento;

  const wipPercent = total
    ? Number(((emAndamento / total) * 100).toFixed(1))
    : 0;

  const WIP_LIMIT = 5;

  let wipStatus = "Ideal";

  if (wipPercent > 60) {
    wipStatus = "Alto";
  } else if (wipPercent < 20) {
    wipStatus = "Baixo";
  }

  let wipLimitStatus = "Dentro do limite";

  if (wip > WIP_LIMIT) {
    wipLimitStatus = "Acima do limite";
  } else if (wip === WIP_LIMIT) {
    wipLimitStatus = "No limite";
  }

  const gargalo = wip > WIP_LIMIT;


  let insightLocal = "";

  if (produtividade >= 80) {
    insightLocal = "A equipe apresenta alta taxa de conclusão, indicando um fluxo eficiente de entregas.";
  } else if (produtividade >= 50) {
    insightLocal = "A equipe possui um desempenho moderado, com espaço para otimização no fluxo de trabalho.";
  } else {
    insightLocal = "A equipe apresenta baixa taxa de conclusão, sugerindo necessidade de revisão no processo.";
  }

  if (eficiencia >= 1) {
    insightLocal += " A relação entre tarefas concluídas e em andamento está equilibrada.";
  } else {
    insightLocal += " Há um volume elevado de tarefas em andamento em relação às concluídas.";
  }

  if (gargalo) {
    insightLocal += " ⚠️ Foi identificado um gargalo no fluxo devido ao excesso de tarefas em andamento.";
    insightLocal += " Recomenda-se reduzir o WIP para melhorar o fluxo.";
  } else {
    insightLocal += " O fluxo atual está saudável e bem distribuído.";
  }


  let insightFinal = insightLocal; //garante valor padrão

  try {
    const ia = await gerarInsightIA({
      concluidas,
      emAndamento,
      backlog,
      eficiencia,
      produtividade,
      wip
    });

    if (ia && ia.trim() !== "") {
      insightFinal = ia;
    }

  } catch (err) {
    console.error("Erro IA:", err);
  }


  return {
    total,
    concluidas,
    emAndamento,
    backlog,
    outros,
    porcentagens,
    eficiencia,
    produtividade,
    insight: insightFinal,
    wip,
    wipPercent,
    wipStatus,
    wipLimit: WIP_LIMIT,
    wipLimitStatus,
    gargalo
  };
}