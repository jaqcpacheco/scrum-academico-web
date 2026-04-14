import axios from "axios";

// =========================
// ⚙️ CONFIG
// =========================
const USAR_IA = true;
const MODO_SIMULACAO = true;

// =========================
// 🔐 ENV
// =========================
function getEnv(customKey, customToken) {
  return {
    key: customKey || process.env.TRELLO_KEY,
    token: customToken || process.env.TRELLO_TOKEN
  };
}

// =========================
// 📋 BOARDS
// =========================
export async function getBoards(customKey, customToken) {
  const { key, token } = getEnv(customKey, customToken);

  const response = await axios.get(
    `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  );

  return response.data;
}

// =========================
// 🤖 IA
// =========================
async function gerarInsightIA(dados) {
  if (MODO_SIMULACAO) {
    return `Equipe com ${dados.taxaConclusao}% de conclusão e eficiência ${dados.eficiencia}.`;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Especialista em Scrum e Kanban."
          },
          {
            role: "user",
            content: `
              Analise:

              Conclusão: ${dados.taxaConclusao}%
              Eficiência: ${dados.eficiencia}
              WIP: ${dados.wip}

              Gere insights curtos.
            `
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.log("Erro IA:", error.message);
    return null;
  }
}

// =========================
// 📊 MÉTRICAS
// =========================
export async function getMetrics(boardId, customKey, customToken) {
  try {
    const { key, token } = getEnv(customKey, customToken);

    // =========================
    // 🔎 BUSCA SEGURA
    // =========================
    const [listasRes, cardsRes, membersRes] = await Promise.all([
      axios.get(`https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`),
      axios.get(`https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`),
      axios.get(`https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`)
    ]);

    const listas = listasRes.data || [];
    const cards = cardsRes.data || [];
    const members = membersRes.data || [];

    // =========================
    // 🔎 DETECTAR LISTAS
    // =========================
    function findList(keywords) {
      return listas.find(l =>
        keywords.some(k =>
          (l.name || "").toLowerCase().includes(k)
        )
      );
    }

    const doneList = findList(["done", "conclu", "feito", "final"]);
    const doingList = findList(["doing", "andamento"]);
    const backlogList = findList(["backlog", "to do", "afazer"]);

    // =========================
    // 📊 CONTAGEM
    // =========================
    const total = cards.length;

    const concluidas = doneList
      ? cards.filter(c => c.idList === doneList.id).length
      : 0;

    const emAndamento = doingList
      ? cards.filter(c => c.idList === doingList.id).length
      : 0;

    const backlog = backlogList
      ? cards.filter(c => c.idList === backlogList.id).length
      : 0;

    // =========================
    // 📈 SCRUM
    // =========================
    const produtividade = total > 0 ? concluidas / total : 0;
    const produtividadePercent = Number((produtividade * 100).toFixed(1));

    const throughput = concluidas; // entregas
    const taxaConclusao = produtividadePercent;

    // =========================
// 📋 KANBAN - LEAD TIME
// =========================
const leadTimes = cards
  .filter(c => c.date)
  .map(c => {
    const created = new Date(c.date);
    const now = new Date();

    return (now - created) / (1000 * 60 * 60 * 24);
  });

const leadTimeMedio = leadTimes.length > 0
  ? Number(
      leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length
    ).toFixed(1)
  : 0;
    // =========================
    // 📋 KANBAN
    // =========================
    const wip = emAndamento;
    const limiteWIP = 5;

    const eficiencia = emAndamento > 0
      ? Number((concluidas / emAndamento).toFixed(2))
      : concluidas;

    // =========================
    // 👥 MEMBROS
    // =========================
    const tarefasPorMembro = members.map(member => ({
      nome: member.fullName,
      quantidade: cards.filter(c =>
        (c.idMembers || []).includes(member.id)
      ).length
    }));

    const mediaCarga = tarefasPorMembro.length > 0
      ? Number(
          tarefasPorMembro.reduce((acc, m) => acc + m.quantidade, 0) /
          tarefasPorMembro.length
        ).toFixed(2)
      : 0;

    // =========================
    // 🤖 IA BASE
    // =========================
    let insightIA = null;

    if (USAR_IA) {
      insightIA = await gerarInsightIA({
        taxaConclusao,
        eficiencia,
        wip
      });
    }

    // =========================
    // 🧠 INSIGHTS (CARDS)
    // =========================
    const insights = [];
    if (wip > concluidas) {
  insights.push({
    tipo: "alerta",
    texto: "Fluxo travado: mais tarefas iniciadas do que concluídas."
  });
}

    if (produtividadePercent > 70) {
      insights.push({
        tipo: "positivo",
        texto: `Alta produtividade (${produtividadePercent}%).`
      });
    }

    if (eficiencia >= 1) {
      insights.push({
        tipo: "info",
        texto: "Fluxo eficiente entre tarefas."
      });
    }

    if (insightIA) {
      insights.push({
        tipo: "destaque",
        texto: insightIA
      });
    }

    // =========================
    // 🚨 GARGALOS (CARDS)
    // =========================
    const gargalos = [];
    if (leadTimeMedio > 5) {
  insights.push({
    tipo: "alerta",
    texto: `Tempo de entrega elevado (${leadTimeMedio} dias).`
  });
}

    if (wip > limiteWIP) {
  gargalos.push({
    tipo: "alerta",
    texto: `WIP acima do limite (${wip}/${limiteWIP}).`
  });
  }

  if (concluidas === 0 && total > 0) {
  insights.push({
    tipo: "critico",
    texto: "Nenhuma entrega realizada — fluxo parado."
  });
}

    if (backlog > total * 0.5) {
      gargalos.push({
        tipo: "aviso",
        texto: "Backlog elevado."
      });
    }

    if (mediaCarga > 10) {
      gargalos.push({
        tipo: "critico",
        texto: "Sobrecarga na equipe."
      });
    }

    // =========================
    // 📊 HISTÓRICO
    // =========================
    const historico = [
      Math.max(concluidas - 10, 0),
      Math.max(concluidas - 5, 0),
      Math.max(concluidas - 2, 0),
      concluidas
    ];

    return {
      total,
      backlog,
      emAndamento,
      concluidas,
      produtividade: produtividadePercent,
      throughput,
      eficiencia,
      wip,
      mediaCarga,
      tarefasPorMembro,
      historico,
      insights,
      gargalos,
      leadTimeMedio
    };

  } catch (error) {
    console.error("🔥 ERRO REAL:", error.response?.data || error);
    throw new Error("Erro ao calcular métricas");
  }
}