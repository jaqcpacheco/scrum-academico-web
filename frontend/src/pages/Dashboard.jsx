import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TeamChart from "../components/TeamChart";
import InsightBox from "../components/InsightBox";

export default function Dashboard({
  boards,
  selectedBoard,
  setSelectedBoard,
  metrics
}) {

  const historicoData =
    metrics?.historico?.map((v, i) => ({
      dia: `Dia ${i + 1}`,
      valor: v,
    })) || [];

  const equipeData = metrics?.tarefasPorMembro || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        
        <Header
          boards={boards}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
        />

        
        {!metrics ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center flex items-center justify-center">
            <p className="text-slate-400 text-lg">
              Selecione um board para visualizar as métricas 📊
            </p>
          </div>
        ) : (
          <>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              <Card title="Total" value={metrics.total} />
              <Card title="Backlog" value={metrics.backlog} />
              <Card title="Em andamento" value={metrics.emAndamento} />
              <Card title="Concluídas" value={metrics.concluidas} />
              <Card title="Produtividade" value={`${metrics.produtividade}%`} />

            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4 text-white">
                  Produtividade ao longo do tempo
                </h2>
                <Chart data={historicoData} />
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4 text-white">
                  Distribuição da equipe
                </h2>
                <TeamChart data={equipeData} />
              </div>

            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <InsightBox
                  title="Insight"
                  text={metrics.insight}
                />
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <InsightBox
                  title="Gargalo"
                  text={metrics.gargalo}
                />
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}