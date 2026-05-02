import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { setPersistence, inMemoryPersistence } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro("");

    // Validação simples
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      await setPersistence(auth, inMemoryPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      console.log("LOGADO:", userCredential.user);

    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        setErro("Usuário não encontrado");
      } else if (error.code === "auth/wrong-password") {
        setErro("Senha incorreta");
      } else if (error.code === "auth/invalid-email") {
        setErro("Email inválido");
      } else if (error.code === "auth/too-many-requests") {
        setErro("Muitas tentativas. Tente novamente mais tarde");
      } else {
        setErro("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-800 shadow-2xl w-[420px] text-center">

        <div className="text-3xl mb-4">📊</div>

        <h1 className="text-3xl text-white mb-2">
          Conectar com Trello
        </h1>

        <p className="text-slate-400 mb-6">
          Analise o desempenho da sua equipe com métricas Scrum e KANBAN
        </p>

        {/* Input email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full mb-3 p-3 rounded-lg bg-slate-800 text-white outline-none"
        />

        {/* Input senha */}
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white outline-none"
        />

        {/* Erro*/}
        {erro && (
          <p className="text-red-400 mb-3 text-sm">{erro}</p>
        )}

        {/* Botão */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-3 rounded-lg transition-all"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>
    </div>
  );
}