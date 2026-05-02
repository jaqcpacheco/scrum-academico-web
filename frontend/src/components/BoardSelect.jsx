import { useState, useRef, useEffect } from "react";

export default function BoardSelect({
  boards = [],
  selectedBoard,
  setSelectedBoard
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const selected = boards.find(b => b.id === selectedBoard);

  //fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xs">

      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl flex justify-between items-center hover:border-slate-500 transition"
      >
        <span>
          {selected ? selected.name : "Selecione um board"}
        </span>

        <span className={`transition ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">

          {boards.length === 0 && (
            <div className="px-4 py-2 text-slate-400">
              Nenhum board encontrado
            </div>
          )}

          {boards.map(board => (
            <div
              key={board.id}
              onClick={() => {
                setSelectedBoard(board.id);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition
                ${selectedBoard === board.id 
                  ? "bg-slate-700 text-blue-400" 
                  : "hover:bg-slate-700"}
              `}
            >
              {board.name}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}