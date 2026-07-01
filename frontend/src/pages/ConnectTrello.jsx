import { useState } from "react";
import { BASE_URL } from "../services/api.js";

export default function ConnectTrello({ systemUser }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleConnect = async () => {
    try {
      setLoading(true);
      setErro("");

      const trelloKey = import.meta.env.VITE_TRELLO_KEY;
      const returnUrl = `${window.location.origin}/trello-callback`;

      const authUrl = `https://trello.com/1/authorize?expiration=never&name=ProjectMinds&scope=read&response_type=token&key=${trelloKey}&return_url=${returnUrl}&callback_method=fragment`;

      window.location.href = authUrl;
    } catch (err) {
      setErro("Erro ao iniciar conexão com Trello.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtherAccount = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 overflow-hidden">
      <div className="w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg">
            🔗
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Conectar Trello
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Integre sua conta Trello para acessar boards, métricas Scrum/Kanban e análises inteligentes.
        </p>

        {systemUser && (
          <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 mb-4">
            <div>
              <p className="text-xs text-slate-400">Usuário conectado</p>
              <p className="text-white font-semibold">{systemUser.nome}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              {systemUser.nome?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        {erro && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-300 text-sm">{erro}</p>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-3 rounded-xl text-white font-semibold mb-3 transition-all"
        >
          {loading ? "Conectando..." : "Conectar com Trello"}
        </button>

        <button
          onClick={handleOtherAccount}
          disabled={loading}
          className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 disabled:opacity-50 px-4 py-3 rounded-xl text-white font-medium mb-3 transition-all"
        >
          Conectar outra conta
        </button>


        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="w-full text-slate-400 hover:text-white text-sm py-2 transition-all"
        >
          ← Voltar para Login
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Ao continuar, você autoriza o Project Minds a acessar seus boards do Trello.
        </p>

      </div>
    </div>
  );
}
