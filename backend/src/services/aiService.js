import axios from "axios";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const TIMEOUT = 15000; 

function normalizarDados(dados = {}) {
  return {
    produtividade: dados.produtividade || 0,
    eficiencia: dados.eficiencia || 0,
    wip: dados.wip || 0,
    backlog: dados.backlog || 0
  };
}

function gerarFallback(dados) {
  return `Resumo:\nEquipe com ${dados.produtividade}% de conclusão e eficiência ${dados.eficiencia}.\n\nInsight:\nO fluxo está ${dados.wip > 5 ? "sobrecarregado" : "equilibrado"}, com ${dados.wip} tarefas em andamento e backlog de ${dados.backlog}.\n\nRecomendação:\n${dados.wip > 5 ? "Reduzir o WIP para evitar gargalos e melhorar o fluxo." : "Manter o fluxo atual e planejar novas demandas para garantir continuidade."}`.trim();
}

function montarPrompt(dados) {
  return [
    {
      role: "system",
      content: "Você é um especialista em Scrum e Kanban. Responda de forma objetiva, clara e estruturada."
    },
    {
      role: "user",
      content: `Analise os dados abaixo:\n\n- Conclusão: ${dados.produtividade}%\n- Eficiência: ${dados.eficiencia}\n- WIP: ${dados.wip}\n- Backlog: ${dados.backlog}\n\n⚠️ REGRAS OBRIGATÓRIAS:\n- NÃO use markdown (**)\n- NÃO escreva tudo em uma única linha\n- Separe cada seção corretamente\n\nFormato obrigatório:\n\nResumo:\n(uma frase curta)\n\nInsight:\n(análise objetiva)\n\nRecomendação:\n(ação prática)`
    }
  ];
}

async function callAI(messages) {
  return axios.post(
    OPENAI_URL,
    { model: MODEL, messages, temperature: 0.7 },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: TIMEOUT
    }
  );
}

function formatarResposta(texto = "") {
  return texto
    .replace(/\*\*/g, "")
    .replace(/Resumo:\s*/g, "Resumo:\n")
    .replace(/Insight:\s*/g, "\nInsight:\n")
    .replace(/Recomendação:\s*/g, "\nRecomendação:\n")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

function validarResposta(texto) {
  return (
    texto.includes("Resumo:") &&
    texto.includes("Insight:") &&
    texto.includes("Recomendação:")
  );
}

export async function gerarInsightIA(dadosInput) {
  const dados = normalizarDados(dadosInput);
  const fallback = gerarFallback(dados);

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("API KEY não encontrada — usando fallback");
      return fallback;
    }

    const messages = montarPrompt(dados);
    const response = await callAI(messages);
    let texto = response.data?.choices?.[0]?.message?.content || "";
    texto = formatarResposta(texto);

    if (!validarResposta(texto)) {
      console.warn("IA fora do padrão — usando fallback");
      return fallback;
    }

    return texto;
  } catch (error) {
    console.error("ERRO IA:", {
      message: error.message,
      status: error.response?.status
    });
    return fallback;
  }
}
