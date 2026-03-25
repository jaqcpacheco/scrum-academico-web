import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
  fetch("http://127.0.0.1:3001/metrics/69a23f0f8d2c05d0780c6639")    .then(res => {
      console.log("STATUS:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("DATA:", data);
      setMetrics(data);
    })
    .catch(err => {
      console.error("ERRO REAL:", err);
    });
}, []);

  if (!metrics) {
    return <h2>Carregando...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Scrum Analytics</h1>

      <p>Total: {metrics.total}</p>
      <p>Backlog: {metrics.backlog}</p>
      <p>Em andamento: {metrics.emAndamento}</p>
      <p>Concluídas: {metrics.concluidas}</p>
      <p>Produtividade: {metrics.produtividade}</p>

      <h3>Insight:</h3>
      <p>{metrics.insight}</p>

      <h3>Gargalo:</h3>
      <p>{metrics.gargalo}</p>
    </div>
  );
}

export default App;