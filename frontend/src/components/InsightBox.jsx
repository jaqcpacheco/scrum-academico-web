export default function InsightBox({ title, text }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-xl">
      <h2 className="text-white mb-2">{title}</h2>
      <p className="text-slate-300">{text}</p>
    </div>
  );
}