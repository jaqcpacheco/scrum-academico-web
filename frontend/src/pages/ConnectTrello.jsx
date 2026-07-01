import { useEffect, useState, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { BASE_URL } from "../services/api.js";

export default function ConnectTrello({ systemUser, onConnected }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleBackToLogin = async () => {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const TRELLO_KEY = import.meta.env.VITE_TRELLO_KEY;
  const RETURN_URL = window.location.origin;

  const conectarTrello = useCallback(
    async (token) => {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch(`${BASE_URL}/users/connect-trello`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: systemUser.uid,
            token
          })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        onConnected(data.user);
      } catch (err) {
        console.error(err);
        setErro("Erro ao conectar Trello");
      } finally {
        setLoading(false);
      }
    },
    [systemUser, onConnected]
  );

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("token");
    if (token) {
      conectarTrello(token);
    }
  }, [conectarTrello]);

  const handleTrelloAuth = () => {
    const authUrl =
      `https://trello.com/1/authorize?` +
      `expiration=never&` +
      `name=ProjectMinds&` +
      `scope=read,write&` +
      `response_type=token&` +
      `key=${TRELLO_KEY}&` +
      `return_url=${RETURN_URL}`;

    window.location.href = authUrl;
  };

  return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 overflow-hidden">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl">

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-5xl">
            🔗
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Conectar Trello</h1>
          <p className="text-slate-400 leading-relaxed">
            Integre sua conta Trello para acessar boards, métricas Scrum/Kanban
            e análises inteligentes.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Usuário conectado</p>
              <h2 className="font-medium">{systemUser?.nome}</h2>
            </div>
            {systemUser?.photo && (
              <img
                src={systemUser.photo}
                alt="Usuário"
                className="w-12 h-12 rounded-full border border-slate-700"
              />
            )}
          </div>
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-4">
            {erro}
          </div>
        )}

        <button
          onClick={handleTrelloAuth}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-4 py-3 rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50"
        >
          {loading ? "Conectando..." : "Conectar com Trello"}
        </button>

        <button
          onClick={handleBackToLogin}
          className="mt-4 w-full border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 px-4 py-3 rounded-2xl font-medium text-slate-300"
        >
          Conectar outra conta
        </button>

        <button
          onClick={handleBackToLogin}
          className="mt-4 w-full border border-slate-700 hover:border-red-500 hover:bg-slate-800 transition-all duration-300 px-4 py-3 rounded-2xl font-medium text-slate-300"
        >
          ← Voltar para Login
        </button>

        <p className="text-xs text-slate-500 text-center mt-5 leading-relaxed">
          Ao continuar, você autoriza o Project Minds a acessar seus boards do Trello.
        </p>
      </div>
    </div>
  );
}
