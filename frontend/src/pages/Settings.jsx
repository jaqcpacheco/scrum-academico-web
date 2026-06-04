import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { BASE_URL } from "../services/api.js";

export default function Settings({ systemUser, user }) {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  const nome = systemUser?.nome || user?.displayName || "Usuário";
  const email = systemUser?.email || user?.email || "";
  const foto = systemUser?.photo || user?.photoURL || "";
  const inicial = nome?.[0]?.toUpperCase() || "U";
  const trelloConnected = systemUser?.trelloConnected === true;
  const trelloUsername = systemUser?.trelloUsername || "";

  const handleDisconnectTrello = async () => {
    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      const saved = JSON.parse(localStorage.getItem("user"));
      const uid = saved?.user?.uid || saved?.uid;

      const response = await fetch(`${BASE_URL}/users/disconnect-trello`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });

      const data = await response.json();

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify({ user: data.user }));
        setSucesso("Trello desconectado com sucesso!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setErro("Erro ao desconectar Trello.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-1">Configurações</h1>
        <p className="text-slate-400">Gerencie sua conta e integrações</p>
      </div>

      {/* FEEDBACK */}
      {sucesso && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          ✅ {sucesso}
        </div>
      )}
      {erro && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          ❌ {erro}
        </div>
      )}

      {/* PERFIL */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
          Perfil
        </h2>

        <div className="flex items-center gap-5">
          {/* AVATAR */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/20 shrink-0 overflow-hidden">
            {foto
              ? <img src={foto} alt={nome} className="w-16 h-16 object-cover rounded-full" />
              : inicial
            }
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-lg truncate">{nome}</p>
            <p className="text-slate-400 text-sm truncate">{email}</p>
            <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">
              {systemUser?.role === "manager" ? "Agile Manager" : "Membro"}
            </span>
          </div>
        </div>
      </div>

      {/* TRELLO */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
          Integração Trello
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* ÍCONE TRELLO */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trelloConnected ? "bg-blue-500/15 border border-blue-500/20" : "bg-slate-700/50 border border-slate-600/30"}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={trelloConnected ? "#60a5fa" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <rect x="6" y="6" width="4" height="10" rx="1"/>
                <rect x="14" y="6" width="4" height="6" rx="1"/>
              </svg>
            </div>

            <div>
              <p className="text-white font-medium">Trello</p>
              {trelloConnected
                ? <p className="text-sm text-emerald-400">● Conectado{trelloUsername ? ` como @${trelloUsername}` : ""}</p>
                : <p className="text-sm text-slate-400">● Não conectado</p>
              }
            </div>
          </div>

          {trelloConnected ? (
            <button
              onClick={handleDisconnectTrello}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Desconectando..." : "Desconectar"}
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all"
            >
              Conectar
            </button>
          )}
        </div>
      </div>

      {/* CONTA */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03]">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
          Conta
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Sair da conta</p>
            <p className="text-slate-400 text-sm">Você será redirecionado para o login</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-slate-600/40 bg-slate-700/30 text-slate-300 text-sm font-medium hover:bg-slate-700/60 hover:text-white transition-all"
          >
            Sair
          </button>
        </div>
      </div>

    </div>
  );
}
