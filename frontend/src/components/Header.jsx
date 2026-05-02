import BoardSelect from "./BoardSelect";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Header({
  boards,
  selectedBoard,
  setSelectedBoard,
  goToHistorico,
  gerarPDF
}) {

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="mb-10">

      {/* Topo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Esquerda */}
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Análise Ágil com IA
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Insights inteligentes para otimizar o desempenho da equipe
          </p>
        </div>

        {/* Direita */}
        <div className="flex items-center gap-6">

          {/* Ações */}
          <div className="flex items-center gap-3">

            <button
              onClick={goToHistorico}
              className="
                flex items-center gap-2
                bg-blue-500/20 hover:bg-blue-500/40
                text-blue-400
                px-4 py-2 rounded-xl
                border border-blue-500/30
                transition-all
              "
            >
              📁 Histórico
            </button>

            <button
              onClick={gerarPDF}
              className="
                flex items-center gap-2
                bg-indigo-500/20 hover:bg-indigo-500/40
                text-indigo-400
                px-4 py-2 rounded-xl
                border border-indigo-500/30
                transition-all
              "
            >
              📄 PDF
            </button>

          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              text-red-400 hover:text-red-300
              text-sm
              transition-all
            "
          >
            🚪 Sair
          </button>

        </div>
      </div>

      {/* Select (esse select só aparece quando já tem board) */}
      {selectedBoard && (
        <div className="mt-6 max-w-sm">

          <label className="text-xs text-slate-400 mb-1 block">
            Trocar board
          </label>

          <BoardSelect
            boards={boards}
            selectedBoard={selectedBoard}
            setSelectedBoard={setSelectedBoard}
          />

        </div>
      )}

    </div>
  );
}