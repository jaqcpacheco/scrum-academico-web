import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";
import ConnectTrello from "./pages/ConnectTrello";
import InvitePage from "./pages/InvitePage";
import { BASE_URL, authFetch } from "./services/api.js";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

function Main() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [systemUser, setSystemUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed) setSystemUser(parsed?.user || parsed);
        }
      } else {
        setUser(null);
        setSystemUser(null);
        localStorage.removeItem("user");
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !systemUser) return;
    if (systemUser.role === "member") return; // membro não busca boards

    const fetchBoards = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/boards?userId=${systemUser.uid}`);
        const data = await res.json();
        const boardsData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setBoards(boardsData);
      } catch (err) {
        console.error("ERRO BOARDS:", err);
      }
    };
    fetchBoards();
  }, [user, systemUser]);

  useEffect(() => {
    if (!selectedBoard || !systemUser) return;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          `${BASE_URL}/metrics/${selectedBoard}?userId=${systemUser.uid}`
        );
        const data = await res.json();
        setMetrics(data.data);
      } catch (err) {
        console.error("ERRO METRICS:", err);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [selectedBoard, systemUser]);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (user && !systemUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"/>      </div>
    );
  }

  
  if (user && systemUser && systemUser.role !== "member" && systemUser.trelloConnected !== true) {
    return (
      <ConnectTrello
        systemUser={systemUser}
        onConnected={(updatedUser) => {
          localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
          setSystemUser(updatedUser);
        }}
      />
    );
  }

  if (page === "historico") {
    return <Historico goBack={() => setPage("dashboard")} />;
  }

  return (
    <Dashboard
      boards={boards}
      selectedBoard={selectedBoard}
      setSelectedBoard={setSelectedBoard}
      metrics={metrics}
      loading={loading}
      goToHistorico={() => setPage("historico")}
      user={user}
      systemUser={systemUser}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invite/:code" element={<InvitePage />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
