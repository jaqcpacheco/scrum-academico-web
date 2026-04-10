import axios from "axios";

function getEnv() {
  return {
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN
  };
}

export async function getBoards() {
  try {
    const { key, token } = getEnv();

    console.log("KEY:", key);
    console.log("TOKEN:", token);

    const response = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
    );

    return response.data;

  } catch (err) {
    console.error("ERRO REAL:", err.response?.data || err.message);
    throw err;
  }
}
export async function getBoardData(boardId) {
  const { key, token } = getEnv();

  const response = await axios.get(
    `https://api.trello.com/1/boards/${boardId}?lists=open&cards=open&members=all&key=${key}&token=${token}`
  );

  return {
    lists: response.data.lists || [],
    cards: response.data.cards || [],
    members: response.data.members || []
  };
}

export async function getMetrics(boardId) {
  try {
    const { key, token } = getEnv();

    if (!boardId) {
      throw new Error("BoardId não informado");
    }

    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}?lists=open&cards=open&members=all&key=${key}&token=${token}`
    );

    const listas = response.data.lists || [];
    const cards = response.data.cards || [];
    const members = response.data.members || [];

    const palavrasDone = ["done", "conclu", "final", "feito"];
    const palavrasDoing = ["andamento", "doing", "progress"];
    const palavrasBacklog = ["backlog", "to do", "afazer"];

    function encontrarLista(palavras) {
      return listas.find(l => {
        const nome = l.name?.toLowerCase() || "";
        return palavras.some(p => nome.includes(p));
      });
    }

    const listaConcluido = encontrarLista(palavrasDone);
    const listaAndamento = encontrarLista(palavrasDoing);
    const listaBacklog = encontrarLista(palavrasBacklog);

    const total = cards.length;

    const concluidas = listaConcluido
      ? cards.filter(c => c.idList === listaConcluido.id).length
      : 0;

    const emAndamento = listaAndamento
      ? cards.filter(c => c.idList === listaAndamento.id).length
      : 0;

    const backlog = listaBacklog
      ? cards.filter(c => c.idList === listaBacklog.id).length
      : 0;

    const naoClassificadas =
      total - (concluidas + emAndamento + backlog);

    const produtividade = total > 0 ? concluidas / total : 0;

    const produtividadePercent = Number(
      (produtividade * 100).toFixed(1)
    );

    const tarefasPorMembro = members.map(member => {
      const quantidade = cards.filter(c =>
        c.idMembers.includes(member.id)
      ).length;

      return {
        nome: member.fullName,
        quantidade
      };
    });

    // 📈 NOVO — histórico (simulado)
    const historico = [
      Math.max(concluidas - 10, 0),
      Math.max(concluidas - 5, 0),
      Math.max(concluidas - 2, 0),
      concluidas
    ];

    // 🧠 INSIGHT (mantido e melhorado)
    let insight = "";

    if (produtividade > 0.7 && emAndamento < concluidas) {
      insight = "Equipe com alta eficiência e fluxo controlado.";
    } else if (emAndamento > concluidas) {
      insight = "Possível acúmulo de tarefas em andamento.";
    } else {
      insight = "Fluxo estável.";
    }

    // 🚧 GARGALO (mantido)
    let gargalo = "";

    if (emAndamento > concluidas * 1.5) {
      gargalo = "Alto volume em andamento (possível gargalo).";
    } else if (backlog > emAndamento * 1.2) {
      gargalo = "Muitas tarefas acumuladas no backlog.";
    } else if (naoClassificadas > 0) {
      gargalo = "Existem tarefas fora do fluxo definido.";
    } else {
      gargalo = "Fluxo equilibrado.";
    }

    return {
      total,
      backlog,
      emAndamento,
      concluidas,
      naoClassificadas,
      produtividade: produtividadePercent,
      tarefasPorMembro,
      historico,
      insight,
      gargalo
    };

  } catch (error) {
    console.error("Erro no getMetrics:", error.response?.data || error.message);
    throw error;
  }
}