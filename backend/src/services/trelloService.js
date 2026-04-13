import axios from "axios";

// =========================
// ⚙️ CONFIG
// =========================
const USAR_IA = true;
const MODO_SIMULACAO = true; // 👉 começa true, depois coloca false pra IA real

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
  try {
    const { key, token } = getEnv(customKey, customToken);

    const response = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
    );

    return response.data;

  } catch (err) {
    console.error("Erro ao buscar boards:", err.response?.data || err.message);
    throw err;
  }
}

// =========================
// 📦 BOARD DATA
// =========================
export async function getBoardData(boardId, customKey, customToken) {
  try {
    const { key, token } = getEnv(customKey, customToken);

    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}?lists=open&cards=open&members=all&key=${key}&token=${token}`
    );

    return {
      lists: response.data.lists || [],
      cards: response.data.cards || [],
      members: response.data.members || []
    };

  } catch (err) {
    console.error("Erro ao buscar board:", err.message);
    throw err;
  }
}

// =========================
// 🤖 IA
// =========================
async function gerarInsightIA(dados) {

  console.log("🤖 IA ATIVA:", USAR_IA);
  console.log("🧪 SIMULAÇÃO:", MODO_SIMULACAO);

  // 🔥 SIMULAÇÃO (SEM CUSTO)
  if (MODO_SIMULACAO) {
    return `🤖 [SIMULAÇÃO] A equipe possui ${dados.taxaConclusao}% de conclusão, com eficiência de ${dados.eficiencia}. O fluxo apresenta oportunidades de melhoria.`;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é especialista em Scrum e análise de desempenho de equipes."
          },
          {
            role: "user",
            content: `
              Analise os dados do time:

              Total: ${dados.total}
              Concluídas: ${dados.concluidas}
              Em andamento: ${dados.emAndamento}
              Backlog: ${dados.backlog}
              Eficiência: ${dados.eficiencia}
              Taxa de conclusão: ${dados.taxaConclusao}%

              Gere um insight claro, profissional e objetivo.
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
    console.error("Erro IA:", error.message);
    return null;
  }
}

// =========================
// 📊 MÉTRICAS
// =========================
export async function getMetrics(boardId, customKey, customToken) {
  try {
    const { key, token } = getEnv(customKey, customToken);

    if (!boardId) throw new Error("BoardId não informado");

    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}?lists=open&cards=open&members=all&key=${key}&token=${token}`
    );

    const listas = response.data.lists || [];
    const cards = response.data.cards || [];
    const members = response.data.members || [];

    // =========================
    // 🔎 IDENTIFICAÇÃO DE LISTAS
    // =========================
    const palavrasDone = ["done", "conclu", "final", "feito"];
    const palavrasDoing = ["andamento", "doing"];
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

    // =========================
    // 📊 CONTAGEM
    // =========================
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

    // =========================
    // 📈 MÉTRICAS
    // =========================
    const produtividade = total > 0 ? concluidas / total : 0;
    const produtividadePercent = Number((produtividade * 100).toFixed(1));

    const taxaConclusao = produtividadePercent;
    const throughput = concluidas;

    const eficiencia = emAndamento > 0
      ? Number((concluidas / emAndamento).toFixed(2))
      : concluidas;

    // =========================
    // 👥 MEMBROS
    // =========================
    const tarefasPorMembro = members.map(member => {
      const quantidade = cards.filter(c =>
        c.idMembers.includes(member.id)
      ).length;

      return {
        nome: member.fullName,
        quantidade
      };
    });

    const cargaTotal = tarefasPorMembro.reduce((acc, m) => acc + m.quantidade, 0);

    const mediaCarga = tarefasPorMembro.length > 0
      ? Number((cargaTotal / tarefasPorMembro.length).toFixed(2))
      : 0;

    // =========================
    // 🚨 GARGALO SIMPLES
    // =========================
    let gargalo = "Fluxo equilibrado.";

    if (emAndamento > concluidas * 1.5) {
      gargalo = "Alto volume de tarefas em andamento.";
    }

    // =========================
    // 🤖 INSIGHT COM IA
    // =========================
    let insight = "Não foi possível gerar insight.";

    if (USAR_IA) {
      const insightIA = await gerarInsightIA({
        total,
        concluidas,
        emAndamento,
        backlog,
        eficiencia,
        taxaConclusao
      });

      if (insightIA) {
        insight = insightIA;
      }
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

      taxaConclusao,
      throughput,
      eficiencia,
      mediaCarga,

      tarefasPorMembro,
      historico,
      insight,
      gargalo,

      modoIA: USAR_IA,
      modoSimulacao: MODO_SIMULACAO
    };

  } catch (error) {
    console.error("Erro no getMetrics:", error.message);
    throw error;
  }
}