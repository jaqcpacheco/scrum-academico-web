import {
  PieChart, Pie, Tooltip, ResponsiveContainer
} from "recharts";

export default function TeamChart({ data }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-xl">
      <h2 className="text-white mb-4">Equipe</h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="quantidade"
            nameKey="nome"
            outerRadius={80}
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}