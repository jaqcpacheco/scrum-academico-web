import { useState } from "react";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  Area, AreaChart
} from "recharts";

export default function Chart({ data }) {
  const [aba, setAba] = useState("produtividade");

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const chartData = data?.length
    ? [...data]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-7)
        .map((item, i) => ({
          dia: diasSemana[i % 7],
          produtividade: item.produtividade ?? 0,
          concluidas: item.concluidas ?? 0,
          emAndamento: item.emAndamento ?? 0,
        }))
    : diasSemana.map((dia, i) => ({
        dia,
        produtividade: [75, 80, 72, 85, 92, 88, 65][i],
        concluidas: [3, 4, 3, 5, 6, 5, 4][i],
        emAndamento: [2, 2, 3, 2, 1, 2, 3][i],
      }));

  const abas = [
    { key: "produtividade", label: "Produtividade" },
    { key: "concluidas", label: "Velocity" },
    { key: "emAndamento", label: "Tasks" },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Produtividade</h2>
          <p className="text-slate-400 text-sm">Evolução das tarefas concluídas em 7 dias</p>
        </div>

        <div className="flex gap-2">
          {abas.map((a) => (
            <button
              key={a.key}
              onClick={() => setAba(a.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                aba === a.key
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>

            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false}/>

            <XAxis dataKey="dia" stroke="#64748b" tickLine={false} axisLine={false}/>

            <YAxis stroke="#64748b" tickLine={false} axisLine={false}/>

            <Tooltip
              cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
              contentStyle={{
                background: "rgba(2,6,23,0.9)",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                color: "#fff"
              }}
              labelStyle={{ color: "#94a3b8" }}
            />

            <Area
              type="monotone"
              dataKey={aba}
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorGradient)"
              dot={false}
              activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}