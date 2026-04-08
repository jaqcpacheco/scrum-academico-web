import { useEffect, useState } from "react";
import "./App.css";

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    fetch(`http://localhost:3001/api/metrics/${selectedBoard}`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar métricas:", err);
        setLoading(false);
      });
  }, [selectedBoard]);

  return (
    <div className="container">
      <h1>Dashboard</h1>

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

      {loading ? (
        <p className="empty">Carregando dados...</p>
      ) : !metrics ? (
        <p className="empty">Selecione um board para visualizar os dados</p>
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

          <div className="box insight">
            <h3>Insight</h3>
            <p>{metrics.insight}</p>
          </div>

          <div className="box gargalo">
            <h3>Gargalo</h3>
            <p>{metrics.gargalo}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;