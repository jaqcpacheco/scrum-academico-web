import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { BASE_URL } from "../services/api.js";

export default function InvitePage() {
  const { code } = useParams();

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // valida o convite ao carregar
  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`${BASE_URL}/invites/validate/${code}`);
        const data = await res.json();
        setValid(data.success);
        if (!data.success) setErro(data.error || "Convite inválido");
      } catch {
        setErro("Erro ao validar convite");
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [code]);

  const acceptInvite = async (uid, nome, email, photo) => {
    const res = await fetch(`${BASE_URL}/invites/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, uid, nome, email, photo })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    localStorage.setItem("user", JSON.stringify({ user: data.user }));
    window.location.href = "/";
  };

  const handleRegister = async () => {
    setErro("");
    if (!email || !senha) { setErro("Preencha todos os campos"); return; }
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, senha);
      await acceptInvite(
        result.user.uid,
        email.split("@")[0],
        result.user.email,
        ""
      );
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        // tenta fazer login se já existe
        try {
          const result = await signInWithEmailAndPassword(auth, email, senha);
          await acceptInvite(
            result.user.uid,
            result.user.displayName || email.split("@")[0],
            result.user.email,
            result.user.photoURL || ""
          );
        } catch {
          setErro("Email ou senha inválidos");
        }
      } else if (err.code === "auth/weak-password") {
        setErro("Senha muito fraca — mínimo 6 caracteres");
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErro("");
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await acceptInvite(
        result.user.uid,
        result.user.displayName,
        result.user.email,
        result.user.photoURL
      );
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-white animate-pulse">Validando convite...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-white mb-3">Convite inválido</h1>
          <p className="text-slate-400">{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="w-full max-w-[430px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg mb-5">
            ⚡
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Você foi convidado!</h1>
          <p className="text-slate-400 text-sm">Crie sua conta para acessar o Project Minds como Membro da Equipe</p>
        </div>

        {/* BADGE */}
        <div className="flex justify-center mb-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-medium">
            👥 Membro da Equipe
          </span>
        </div>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          autoComplete="new-password"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
        />

        {/* SENHA */}
        <input
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleRegister(); }}
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
        />

        {/* ERRO */}
        {erro && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-300 text-sm">{erro}</p>
          </div>
        )}

        {/* BOTÃO */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-3 rounded-xl text-white font-medium mb-4"
        >
          {loading ? "Carregando..." : "Criar conta e entrar"}
        </button>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-200 disabled:opacity-50 px-4 py-3 rounded-xl text-black font-semibold"
        >
          {loading ? "Carregando..." : "Entrar com Google"}
        </button>

        <p className="text-xs text-slate-500 text-center mt-6">
          Ao continuar, você aceita o convite e entra como Membro da Equipe.
        </p>
      </div>
    </div>
  );
}
