import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  Area, AreaChart
} from "recharts";

export default function Chart({ data }) {

  const chartData = data?.length ? data : [
    { dia: "Seg", valor: 2 },
    { dia: "Ter", valor: 3 },
    { dia: "Qua", valor: 4 },
    { dia: "Qui", valor: 3 },
    { dia: "Sex", valor: 5 },
    { dia: "Sáb", valor: 6 },
    { dia: "Dom", valor: 7 }
  ];

  return (
    <div className=" bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg">

      {/* header */}
      <div className=" mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">
            📈 Produtividade
          </h2>
          <p className="text-slate-400 text-sm">
            Evolução das tarefas concluídas
          </p>
        </div>

        <span className="text-green-400 text-sm font-medium">
          +12%
        </span>
      </div>

      {/* Chart */}
      <div className=" w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>

            {/* Grid suave */}
            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="4 4"
              vertical={false}
            />

            {/* Eixos */}
            <XAxis
              dataKey="dia"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
              contentStyle={{
                background: "rgba(2,6,23,0.9)",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                color: "#fff"
              }}
              labelStyle={{ color: "#94a3b8" }}
            />

            {/* Gradiente */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                <stop offset="50%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Área com animação */}
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#colorGradient)"

              //Animação
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"

              //Pontos
              dot={{
                r: 4,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "#020617"
              }}

              activeDot={{
                r: 7,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "#fff"
              }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}