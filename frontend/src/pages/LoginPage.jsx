import { useState } from "react";
import { BASE_URL } from "../services/api.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth, googleProvider } from "../services/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const salvarUsuarioSistema = async (userData) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Erro ao salvar usuário");

    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.reload();
  };

  const handleLogin = async () => {
    setErro("");
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, senha);
      await salvarUsuarioSistema({
        uid: result.user.uid,
        nome: result.user.displayName || email.split("@")[0],
        email: result.user.email,
        photo: result.user.photoURL || "",
      });
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErro("Usuário não encontrado");
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta");
      } else if (err.code === "auth/invalid-credential") {
        setErro("Email ou senha inválidos");
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setErro("");
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, senha);
      await salvarUsuarioSistema({
        uid: result.user.uid,
        nome: email.split("@")[0],
        email: result.user.email,
        photo: "",
      });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErro("Email já cadastrado");
      } else if (err.code === "auth/weak-password") {
        setErro("Senha muito fraca");
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErro("");
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await salvarUsuarioSistema({
        uid: result.user.uid,
        nome: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErro("Digite seu email");
      return;
    }
    try {
      setResetLoading(true);
      setErro("");
      await sendPasswordResetEmail(auth, email);
      alert("Email de recuperação enviado");
    } catch {
      setErro("Erro ao enviar recuperação");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="w-full max-w-[430px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg mb-5">
            🧠
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Project Minds</h1>
          <p className="text-slate-400 text-sm">Smart Agile Intelligence Platform</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          autoComplete="new-password"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Senha"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") isLogin ? handleLogin() : handleRegister();
          }}
          className="w-full mb-3 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
        />

        {isLogin && (
          <div className="flex justify-end mb-5">
            <button
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="text-sm text-blue-400"
            >
              {resetLoading ? "Enviando..." : "Esqueci minha senha"}
            </button>
          </div>
        )}

        {erro && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-300 text-sm">{erro}</p>
          </div>
        )}

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-3 rounded-xl text-white font-medium mb-4"
        >
          {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-200 disabled:opacity-50 px-4 py-3 rounded-xl text-black font-semibold"
        >
          {loading ? "Carregando..." : "Entrar com Google"}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-sm text-slate-400 hover:text-white"
        >
          {isLogin ? "Não possui conta? Criar conta" : "Já possui conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
