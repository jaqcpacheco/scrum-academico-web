export default function LoginPage({ onConnect }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-800 shadow-2xl w-[420px] text-center">

        <div className="text-3xl mb-4">📊</div>

        <h1 className="text-3xl text-white mb-2">
          Conectar com Trello
        </h1>

        <p className="text-slate-400 mb-6">
          Analise o desempenho da sua equipe com métricas Scrum e KANBAN
        </p>

        <button
          onClick={onConnect}
          className="w-full bg-blue-500 hover:bg-blue-600 transition p-3 rounded-lg text-white font-semibold"
        >
          Conectar com Trello
        </button>

      </div>
    </div>
  );
}