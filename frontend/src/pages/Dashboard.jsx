import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TeamChart from "../components/TeamChart";
import InsightCard from "../components/InsightCard";

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

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        
        <Header
          boards={boards}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
        />

      
        {!metrics ? (
          <p className="text-slate-400">
            Selecione um board para visualizar os dados
          </p>
        ) : (
          <>
            

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card title="Total" value={metrics.total} />
              <Card title="Backlog" value={metrics.backlog} />
              <Card title="Em andamento" value={metrics.emAndamento} />
              <Card title="Concluídas" value={metrics.concluidas} />
              <Card title="Produtividade" value={`${metrics.produtividade}%`} />
              <Card
              title="Lead Time"
              value={
              metrics.leadTimeMedio
              ? `${metrics.leadTimeMedio} dias`
              : "—"
              }
            />
            
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2">
                <Chart data={historicoData} />
              </div>

              <TeamChart data={equipeData} />

            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-xl mb-4 font-semibold text-slate-200">
                Principais Insights
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {metrics.insights.map((item, index) => (
                    <InsightCard
                      key={index}
                      tipo={item.tipo}
                      texto={item.texto}
                    />
                  ))}
                </div>
              </div>

              
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-xl mb-4 font-semibold text-slate-200">
                Gargalos Potenciais
                </h2>

                {metrics.gargalos.length === 0 ? (
                  <p className="text-slate-400">
                    Nenhum gargalo identificado 🚀
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {metrics.gargalos.map((item, index) => (
                      <InsightCard
                        key={index}
                        tipo={item.tipo}
                        texto={item.texto}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}