import { useEffect, useState } from "react";
import { BASE_URL, authFetch } from "../services/api.js";

export default function Historico({ goBack }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const uid = savedUser?.user?.uid || savedUser?.uid;

        const res = await authFetch(`${BASE_URL}/history?userId=${uid}`);
        const data = await res.json();
        setHistorico(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setHistorico([]);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, []);

  const calcularVariacao = (atual, anterior) => {
    if (!anterior || anterior === 0) return null;
    const valor = ((atual - anterior) / anterior) * 100;
    return Number(valor.toFixed(1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="animate-pulse text-slate-400">Carregando histórico...</p>
      </div>
    );
  }

  if (!historico.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4 animate-pulse">📊</div>
          <h2 className="text-2xl font-semibold mb-2">Nenhum histórico ainda</h2>
          <p className="text-slate-400 mb-6">
            Analise um board no dashboard para começar a visualizar a evolução
            de desempenho da equipe.
          </p>
          <button
            onClick={goBack}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all px-6 py-3 rounded-xl shadow-lg"
          >
            ← Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  const listaOrdenada = [...historico].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">📊 Histórico</h1>
          <button onClick={goBack} className="bg-blue-500 px-4 py-2 rounded-lg">
            Voltar
          </button>
        </div>

        <div className="space-y-4">
          {listaOrdenada.map((item, index) => {
            const anterior = listaOrdenada[index + 1];
            const variacaoProd = calcularVariacao(item.produtividade, anterior?.produtividade);
            const variacaoBacklog = calcularVariacao(item.backlog, anterior?.backlog);

            return (
              <div
                key={item._id}
                className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold mb-2">{item.boardName || "Board"}</h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>Total: {item.total}</p>
                  <p>Concluídas: {item.concluidas}</p>
                  <p>Em andamento: {item.emAndamento}</p>

                  <p>
                    Backlog: {item.backlog}
                    {variacaoBacklog !== null && (
                      <span className={`ml-2 text-xs ${variacaoBacklog <= 0 ? "text-green-400" : "text-red-400"}`}>
                        ({variacaoBacklog >= 0 ? "+" : ""}{variacaoBacklog}%)
                      </span>
                    )}
                  </p>

                  <p>
                    Produtividade: {item.produtividade ?? 0}%
                    {variacaoProd !== null && (
                      <span className={`ml-2 text-xs ${variacaoProd >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ({variacaoProd >= 0 ? "+" : ""}{variacaoProd}%)
                      </span>
                    )}
                  </p>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  {new Date(item.createdAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
