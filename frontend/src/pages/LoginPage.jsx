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
            ⚡
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
          className="w-full bg-white hover:bg-slate-200 disabled:opacity-50 px-4 py-3 rounded-xl text-black font-semibold flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.F22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
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
