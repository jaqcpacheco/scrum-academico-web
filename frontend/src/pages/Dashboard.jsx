import { useState, useEffect } from "react"; 
import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TeamChart from "../components/TeamChart";
import InsightModal from "../components/InsightModal";
import InsightsPanel from "../components/InsightsPanel";
import html2pdf from "html2pdf.js";
import BoardSelect from "../components/BoardSelect";

export default function Dashboard({
  boards,
  selectedBoard,
  setSelectedBoard,
  metrics,
  loading,
  goToHistorico
}) {

  const [openIA, setOpenIA] = useState(false);

  // Histórico de métricas para gráficos 
  const [historico, setHistorico] = useState([]);

  // Carrega histórico ao montar o componente
  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/history");
        const data = await res.json();

        console.log("HISTÓRICO:", data);

        setHistorico(data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      }
    };

    carregarHistorico();
  }, []);

  // PDF
  const gerarPDF = () => {
  const element = document.createElement("div");
  const logo = window.location.origin + "/logo.ico"; 

  element.innerHTML = `
<div style="font-family: Arial; padding: 30px; color: #1e293b;">

  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <img src="${logo}" style="height:40px;" />
    <div style="text-align:right;">
      <h2 style="margin:0;">Relatório Ágil</h2>
      <span style="font-size:12px; color:gray;">
        ${new Date().toLocaleDateString()}
      </span>
    </div>
  </div>

  <hr style="margin: 15px 0;" />

  <!-- SCRUM -->
  <h2 style="color:#4f46e5;">Análise Scrum</h2>

  <div style="margin-top:10px;">
    <p><strong>Total:</strong> ${metrics.total}</p>
    <p><strong>Concluídas:</strong> ${metrics.concluidas}</p>
    <p><strong>Em andamento:</strong> ${metrics.emAndamento}</p>
    <p><strong>Backlog:</strong> ${metrics.backlog}</p>
    <strong>Produtividade:</strong> ${metrics.produtividade}%
    <p><strong>Eficiência:</strong> ${metrics.eficiencia}</p>
  </div>

  <hr style="margin: 20px 0;" />

  <!-- KANBAN -->
  <h2 style="color:#4f46e5;">Análise Kanban</h2>

  <div style="margin-top:10px;">
    <p><strong>WIP:</strong> ${metrics.wip}</p>
    <p><strong>Status:</strong> ${metrics.wipStatus}</p>
    <p><strong>Limite:</strong> ${metrics.wipLimitStatus}</p>
  </div>

  <hr style="margin: 20px 0;" />

  <!-- IA -->
  <h2 style="color:#4f46e5;">Análise com Inteligência Artificial</h2>

  <div style="
    margin-top:10px;
    padding:15px;
    background:#f8fafc;
    border-radius:10px;
    line-height:1.6;
  ">
    ${(metrics.insight || "Sem análise")
      .replace(/\n/g, "<br>")
      .replace(/\*\*/g, "")}
  </div>

  <hr style="margin: 20px 0;" />

  <!-- FOOTER -->
  <p style="font-size:11px; color:gray; text-align:center;">
    Relatório gerado automaticamente pelo sistema
  </p>

</div>
`;

  html2pdf()
    .set({
      margin: 10,
      filename: "relatorio-analise-agil.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-white">

      <Header
        boards={boards}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        goToHistorico={goToHistorico}
        openIA={() => setOpenIA(true)}
        gerarPDF={gerarPDF}
      />

      <div id="relatorio">

        {loading && (
          <p className="text-slate-400 text-sm mb-4 animate-pulse">
            ⏳ Carregando análise em tempo real...
          </p>
        )}

        {!selectedBoard && (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">

    <div className="text-5xl mb-4">📊</div>

    <h2 className="text-2xl font-semibold mb-2">
      Nenhum board selecionado
    </h2>

    <p className="text-slate-400 mb-6 max-w-md">
      Escolha um board para visualizar métricas de produtividade,
      análise de desempenho e insights inteligentes da equipe.
    </p>

    {/* Selecionar Board */}
    <div className="w-full max-w-xs">
      <BoardSelect
        boards={boards}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
      />
    </div>

  </div>
)}

        {metrics && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-1">
               Análise Scrum
            </h2>

            <p className="text-slate-400 mb-6">
              Métricas de desempenho em tempo real
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card title="Total" value={metrics.total} />
              <Card title="Backlog" value={metrics.backlog} />
              <Card title="Em progresso" value={metrics.emAndamento} />
              <Card title="Concluídas" value={metrics.concluidas} />
              <Card title="Produtividade" value={`${metrics.produtividade}%`} />
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">
               Análise Kanban
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                title="WIP"
                value={`${metrics.wip} / ${metrics.wipLimit}`}
                subtitle={`${metrics.wipPercent}% • ${metrics.wipLimitStatus}`}
                highlight={
                  metrics.gargalo
                    ? "⚠️ Gargalo detectado"
                    : "Fluxo saudável"
                }
              />
              <Card title="Eficiência" value={metrics.eficiencia} />
              <Card title="Backlog" value={metrics.backlog} />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Chart
                data={
                  historico.length > 0
                    ? historico.map(item => ({
                        dia: new Date(item.createdAt).toLocaleDateString(),
                        valor: item.concluidas
                      }))
                    : [
                        { dia: "Seg", valor: metrics.backlog },
                        { dia: "Ter", valor: metrics.emAndamento },
                        { dia: "Qua", valor: metrics.concluidas },
                        { dia: "Qui", valor: metrics.concluidas + 1 },
                        { dia: "Sex", valor: metrics.concluidas + 2 }
                      ]
                }
              />

              <TeamChart
                data={[
                  { nome: "Concluídas", quantidade: metrics.concluidas },
                  { nome: "Em andamento", quantidade: metrics.emAndamento },
                  { nome: "Backlog", quantidade: metrics.backlog }
                ]}
              />

            </div>

            <InsightsPanel metrics={metrics} />
          </>
        )}

      </div>

      <InsightModal
        open={openIA}
        metrics={metrics}
      />

    </div>
  );
}