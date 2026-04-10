import { useEffect, useState } from "react";
import "./App.css";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from "recharts";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/boards")
      .then(res => res.json())
      .then(data => setBoards(data))
      .catch(err => console.error("Erro ao buscar boards:", err));
  }, []);

  useEffect(() => {
  if (!selectedBoard) return;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:3001/api/metrics/${selectedBoard}`);
      const data = await res.json();

      setMetrics(data);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

}, [selectedBoard]);

  const historicoData = metrics?.historico?.map((valor, index) => ({
    dia: `Dia ${index + 1}`,
    valor
  })) || [];

  const equipeData = metrics?.tarefasPorMembro || [];

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Dashboard de Desempenho da Equipe</h1>

        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="select"
        >
          <option value="">Selecione um board</option>
          {boards.map(board => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </header>

      {loading ? (
        <div className="loading">
          <p>Carregando dashboard...</p>
        </div>
      ) : !metrics ? (
        <p className="empty">Selecione um board</p>
      ) : (
        <>
          {/* CARDS */}
          <div className="cards">
            <div className="card">
              <h3>Total</h3>
              <p>{metrics.total}</p>
            </div>

            <div className="card backlog">
              <h3>Backlog</h3>
              <p>{metrics.backlog}</p>
            </div>

            <div className="card andamento">
              <h3>Em andamento</h3>
              <p>{metrics.emAndamento}</p>
            </div>

            <div className="card concluido">
              <h3>Concluídas</h3>
              <p>{metrics.concluidas}</p>
            </div>

            <div className="card destaque">
              <h3>Produtividade</h3>
              <p>{metrics.produtividade}%</p>
            </div>
          </div>

          {/* GRID */}
          <div className="grid">
            {/* GRÁFICO DE LINHA */}
            <div className="box chart">
              <h3>Produtividade ao longo do tempo</h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historicoData}>
                  <XAxis dataKey="dia" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* GRÁFICO DE PIZZA */}
            <div className="box team">
              <h3>Distribuição da Equipe</h3>

              {equipeData.length > 0 && (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={equipeData}
                      dataKey="quantidade"
                      nameKey="nome"
                      outerRadius={80}
                      label
                    >
                      {equipeData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* INSIGHT */}
            <div className="box insight">
              <h3>Insight</h3>
              <p>{metrics.insight || "Sem insights disponíveis"}</p>
            </div>

            {/* GARGALO */}
            <div className="box gargalo">
              <h3>Gargalo</h3>
              <p>{metrics.gargalo || "Sem gargalos identificados"}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;