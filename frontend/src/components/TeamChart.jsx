import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function TeamChart({ data = [] }) {

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  //Segurança para evitar erros caso o array seja vazio ou contenha apenas zeros
  if (!Array.isArray(data) || data.every(d => d.quantidade === 0)) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
        <h2 className="text-white mb-4 font-semibold">
          Distribuição da equipe
        </h2>
        <p className="text-slate-400">
          Nenhuma tarefa atribuída 
        </p>
      </div>
    );
  }

  const total = data.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800">

      <h2 className="text-white mb-6 font-semibold">
        Distribuição da equipe
      </h2>

      {/* Gráfico */}
      <div className="relative h-[250px] flex items-center justify-center">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="quantidade"
              nameKey="nome"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centro do Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {total}
          </span>
          <span className="text-sm text-slate-400">
            tarefas
          </span>
        </div>

      </div>

      {/* Legenda */}
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