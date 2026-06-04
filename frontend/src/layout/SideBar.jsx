import SidebarItem from "./SidebarItem";
import UserCard from "./UserCard";

export default function Sidebar({
  systemUser,
  user,
  goToHistorico,
  activePage = "boards",
  setActivePage,
  setSelectedBoard,
  gerarPDF,
}) {
  return (
    <aside className="
      w-[260px]
      min-h-screen
      flex flex-col
      justify-between
      p-6
      bg-gradient-to-b
      from-slate-950
      via-blue-950/60
      to-slate-950
      border-r border-white/5
    ">

      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="
            w-11 h-11
            rounded-2xl
            bg-gradient-to-br from-violet-500 to-cyan-400
            flex items-center justify-center
            text-xl shadow-lg shadow-violet-500/20
          ">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Project Minds
            </h1>
            <p className="text-xs text-slate-400">
              Smart Agile Intelligence
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem
            icon="boards"
            title="Boards"
            active={activePage === "boards"}
            onClick={() => {
              setSelectedBoard("");
              setActivePage("boards");
            }}
          />
          <SidebarItem
            icon="insights"
            title="Insights AI"
            active={activePage === "insights"}
            onClick={() => setActivePage("insights")}
            soon
          />
          <SidebarItem
            icon="performance"
            title="Performance"
            active={activePage === "performance"}
            onClick={() => setActivePage("performance")}
          />
          <SidebarItem
            icon="team"
            title="Team"
            active={activePage === "team"}
            onClick={() => setActivePage("team")}
            soon
          />
          <SidebarItem
            icon="historico"
            title="Histórico"
            active={activePage === "historico"}
            onClick={() => {
              setActivePage("historico");
              goToHistorico();
            }}
          />
        </nav>

        <div className="my-6 border-t border-white/5" />

        <nav className="space-y-1">
          <SidebarItem
            icon="pdf"
            title="Exportar PDF"
            onClick={gerarPDF}
          />
          <SidebarItem
            icon="config"
            title="Configurações"
            active={activePage === "settings"}
            onClick={() => setActivePage("settings")}
          />
        </nav>
      </div>

      <UserCard systemUser={systemUser} user={user} />

    </aside>
  );
}
