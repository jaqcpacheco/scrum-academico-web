import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

export default function App() {

  useEffect(() => {
    signOut(auth);
  }, []);

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [page, setPage] = useState("dashboard");

  // Autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Buscar Boards
  useEffect(() => {
    fetch("http://localhost:3001/api/boards")
      .then(res => res.json())
      .then(data => {
        console.log("BOARDS:", data);

        const boardsData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setBoards(boardsData);
      })
      .catch(err => console.error("Erro boards:", err));
  }, []);

  // Buscar métricas 
  useEffect(() => {
    if (!selectedBoard) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3001/api/metrics/${selectedBoard}`
        );

        const data = await res.json();
        console.log("METRICS:", data);
        setMetrics(data.data);
      } catch (err) {
        console.error("Erro metrics:", err);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBoard]);

  // Loading de autenticação
  if (loadingAuth) {
    return <p className="text-white p-10">Carregando...</p>;
  }

  // Se não tiver usuário, mostra a tela de login
  if (!user) {
    return <LoginPage />;
  }

  // Se tiver usuário, mostra o histórico
  if (page === "historico") {
    return (
      <Historico
        goBack={() => setPage("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      boards={boards}
      selectedBoard={selectedBoard}
      setSelectedBoard={setSelectedBoard}
      metrics={metrics}
      loading={loading}
      goToHistorico={() => setPage("historico")}
    />
  );
}