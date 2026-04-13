import BoardSelect from "./BoardSelect";

export default function Header({ boards, selectedBoard, setSelectedBoard }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-semibold text-white">
          Dashboard Scrum
        </h1>
        <p className="text-slate-400 text-sm">
          Métricas em tempo real
        </p>
      </div>

      <BoardSelect
        boards={boards}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
      />

    </div>
  );
}