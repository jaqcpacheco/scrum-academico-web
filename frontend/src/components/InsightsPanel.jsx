import { CheckCircle, AlertTriangle, Bot } from "lucide-react";

export default function InsightsPanel({ metrics }) {
  if (!metrics) return null;

  const positivos = [];
  const gargalos = [];

  //Regras simples para destacar pontos positivos e gargalos
  if (metrics.produtividade > 70) {
    positivos.push("Produtividade da equipe está alta");
  }

  if (metrics.concluidas > metrics.emAndamento) {
    positivos.push("Boa taxa de conclusão de tarefas");
  }

  if (metrics.eficiencia > 1) {
    positivos.push("Equipe operando com eficiência");
  }

  if (metrics.backlog > metrics.emAndamento) {
    gargalos.push("Muitas tarefas no backlog — possível gargalo inicial");
  }

  if (metrics.emAndamento > metrics.concluidas) {
    gargalos.push("Muitas tarefas em andamento — risco de sobrecarga");
  }

  if (metrics.wip > 5) {
    gargalos.push("Alto WIP pode impactar produtividade");
  }

  const texto = metrics.insight || "";

  //Separação de seções
  const getSection = (start, end) => {
    const startIndex = texto.indexOf(start);
    if (startIndex === -1) return "";

    const from = startIndex + start.length;
    const endIndex = end ? texto.indexOf(end, from) : -1;

    return (endIndex === -1
      ? texto.substring(from)
      : texto.substring(from, endIndex)
    ).trim();
  };

  const resumo = getSection("Resumo:", "Insight:");
  const insightTexto = getSection("Insight:", "Recomendação:");
  const recomendacao = getSection("Recomendação:", null);

  return (
    <div className="mt-12">

      <h2 className="text-2xl font-semibold mb-6">
        🤖 Insights Inteligentes
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Pontos Positivos */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-semibold mb-4">
            Pontos Positivos
          </h3>

          <div className="space-y-3">
            {positivos.length === 0 ? (
              <p className="text-slate-400 text-sm">
                Nenhum destaque positivo identificado
              </p>
            ) : (
              positivos.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 p-4 rounded-xl transition hover:scale-[1.02]"
                >
                  <CheckCircle className="text-green-400" size={18} />
                  <span className="text-sm text-green-300">
                    {item}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gargalos Potenciais */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-semibold mb-4">
            Gargalos Potenciais
          </h3>

          <div className="space-y-3">
            {gargalos.length === 0 ? (
              <p className="text-slate-400 text-sm">
                Nenhum gargalo identificado — fluxo saudável ✅
              </p>
            ) : (
              gargalos.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl transition hover:scale-[1.02]"
                >
                  <AlertTriangle className="text-orange-400" size={18} />
                  <span className="text-sm text-orange-300">
                    {item}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* IA */}
      {metrics.insight && (
        <div className="
          mt-6 
          bg-gradient-to-r from-purple-500/10 to-transparent 
          p-6 
          rounded-2xl 
          border border-slate-800
        ">

          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bot size={18} className="text-purple-400" />
            Análise Inteligente
          </h3>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">

            {/* Resumo */}
            <div>
              <p className="text-purple-400 font-semibold">Resumo</p>
              <p>{resumo || texto}</p>
            </div>

            {/* Insight */}
            <div>
              <p className="text-blue-400 font-semibold">Insight</p>
              <p>{insightTexto || "—"}</p>
            </div>

            {/* Recomendação */}
            <div>
              <p className="text-green-400 font-semibold">Recomendação</p>
              <p>{recomendacao || "—"}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}