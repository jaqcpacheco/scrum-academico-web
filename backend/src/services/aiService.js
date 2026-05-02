import axios from "axios";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const TIMEOUT = 5000;


function normalizarDados(dados = {}) {
  return {
    produtividade: dados.produtividade || 0,
    eficiencia: dados.eficiencia || 0,
    wip: dados.wip || 0,
    backlog: dados.backlog || 0
  };
}

//FALLBACK
function gerarFallback(dados) {
  return `
Resumo:
Equipe com ${dados.produtividade}% de conclusão e eficiência ${dados.eficiencia}.

Insight:
O fluxo está ${dados.wip > 5 ? "sobrecarregado" : "equilibrado"}, com ${dados.wip} tarefas em andamento e backlog de ${dados.backlog}.

Recomendação:
${dados.wip > 5
  ? "Reduzir o WIP para evitar gargalos e melhorar o fluxo."
  : "Manter o fluxo atual e planejar novas demandas para garantir continuidade."}
`.trim();
}

//PROMPT PADRONIZADO
function montarPrompt(dados) {
  return [
    {
      role: "system",
      content:
        "Você é um especialista em Scrum e Kanban. Responda de forma objetiva, clara e estruturada."
    },
    {
      role: "user",
      content: `
Analise os dados abaixo:

- Conclusão: ${dados.produtividade}%
- Eficiência: ${dados.eficiencia}
- WIP: ${dados.wip}
- Backlog: ${dados.backlog}

⚠️ REGRAS OBRIGATÓRIAS:
- NÃO use markdown (**)
- NÃO escreva tudo em uma única linha
- Separe cada seção corretamente

Formato obrigatório:

Resumo:
(uma frase curta)

Insight:
(análise objetiva)

Recomendação:
(ação prática)
`
    }
  ];
}

// CHAMADA IA 
async function callAI(messages) {
  return axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: TIMEOUT
    }
  );
}

//FORMATAÇÃO FINAL
function formatarResposta(texto = "") {
  return texto
    .replace(/\*\*/g, "")
    .replace(/Resumo:\s*/g, "Resumo:\n")
    .replace(/Insight:\s*/g, "\nInsight:\n")
    .replace(/Recomendação:\s*/g, "\nRecomendação:\n")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

//VALIDA ESTRUTURA
function validarResposta(texto) {
  return (
    texto.includes("Resumo:") &&
    texto.includes("Insight:") &&
    texto.includes("Recomendação:")
  );
}

//FUNÇÃO PRINCIPAL
export async function gerarInsightIA(dadosInput) {
  const dados = normalizarDados(dadosInput);
  const fallback = gerarFallback(dados);

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ API KEY não encontrada — usando fallback");
      return fallback;
    }

    const messages = montarPrompt(dados);

    const response = await callAI(messages);

    let texto =
      response.data?.choices?.[0]?.message?.content || "";

    console.log("🤖 IA ORIGINAL:", texto);

    texto = formatarResposta(texto);

    console.log("🤖 IA FORMATADA:", texto);

    if (!validarResposta(texto)) {
      console.warn("⚠️ IA fora do padrão — usando fallback");
      return fallback;
    }

    return texto;

  } catch (error) {
    console.error("🔥 ERRO IA:", {
      message: error.message,
      status: error.response?.status
    });

    return fallback;
  }
}