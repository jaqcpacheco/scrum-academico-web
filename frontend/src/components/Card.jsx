export default function Card({ title, value }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-2xl">{value}</p>
    </div>
  );
}