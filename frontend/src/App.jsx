import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [connected, setConnected] = useState(false);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [metrics, setMetrics] = useState(null);

  const conectar = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/boards");
      const data = await res.json();

      setBoards(data);
      setConnected(true);
    } catch (err) {
      console.error("Erro ao conectar:", err);
    }
  };



  useEffect(() => {
    if (!selectedBoard) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/metrics/${selectedBoard}`
        );
        const data = await res.json();

        setMetrics(data);
      } catch (err) {
        console.error("Erro ao buscar métricas:", err);
      }
    };

    fetchMetrics();
  }, [selectedBoard]);


  return !connected ? (
    <LoginPage onConnect={conectar} />
  ) : (
    <Dashboard
      boards={boards}
      selectedBoard={selectedBoard}
      setSelectedBoard={setSelectedBoard}
      metrics={metrics}
    />
  );
}