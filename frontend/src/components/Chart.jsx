import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Chart({ data }) {
  return (
    <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-white mb-6 font-semibold">
        Produtividade
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>

          
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

        
          <XAxis dataKey="dia" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#fff"
            }}
          />

          
          <defs>
            <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          
          <Line
            type="monotone"
            dataKey="valor"
            stroke="url(#lineColor)"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}