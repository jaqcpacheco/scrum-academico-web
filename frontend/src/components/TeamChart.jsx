import {
  PieChart,
  Pie,
  ResponsiveContainer
} from "recharts";

export default function TeamChart({ data }) {

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  if (!data || data.every(d => d.quantidade === 0)) {
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-white mb-4 font-semibold">
          Distribuição da equipe
        </h2>
        <p className="text-slate-400">
          Nenhuma tarefa atribuída 👥
        </p>
      </div>
    );
  }

  const total = data.reduce((acc, item) => acc + item.quantidade, 0);

  const dataComCores = data.map((item, index) => ({
  ...item,
  fill: COLORS[index % COLORS.length]
}));

  return (
    <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-white mb-6 font-semibold">
        Distribuição da equipe
      </h2>

      <div className="relative h-[250px]">

        <ResponsiveContainer>
          <PieChart>
           <Pie
            data={dataComCores}
            dataKey="quantidade"
            innerRadius={70}
          outerRadius={90}
          />
          </PieChart>
        </ResponsiveContainer>

        
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">
            {total}
          </span>
          <span className="text-xs text-slate-400">
            tarefas
          </span>
        </div>

      </div>

      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">

            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-300">
                {item.nome}
              </span>
            </div>

            <span className="text-white font-semibold">
              {item.quantidade}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}