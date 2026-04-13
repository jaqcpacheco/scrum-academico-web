import { useState } from "react";

export default function BoardSelect({
  boards,
  selectedBoard,
  setSelectedBoard
}) {
  const [open, setOpen] = useState(false);

  const selected = boards.find(b => b.id === selectedBoard);

  return (
    <div className="relative w-full max-w-xs">

      
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

          {boards.map(board => (
            <div
              key={board.id}
              onClick={() => {
                setSelectedBoard(board.id);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-slate-700 cursor-pointer transition"
            >
              {board.name}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}