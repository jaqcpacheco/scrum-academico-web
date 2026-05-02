export default function InsightModal({ open, metrics }) {

  if (!open) return null;

  const texto = metrics?.insight || "";

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-lg border border-slate-800">

        <h2 className="text-white text-xl mb-4">
          🤖 Análise com IA
        </h2>

        <div className="mt-4 space-y-4 text-slate-300 leading-relaxed">

          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold mb-1">🟣 Resumo</p>
            <p>{resumo || texto}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold mb-1">🔵 Insight</p>
            <p>{insightTexto || "—"}</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-1">🟢 Recomendação</p>
            <p>{recomendacao || "—"}</p>
          </div>

        </div>


      </div>
    </div>
  );
}