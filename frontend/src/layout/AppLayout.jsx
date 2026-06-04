import Sidebar from "./Sidebar";

export default function AppLayout({
  children,
  systemUser,
  user,
  goToHistorico,
  activePage,
  setActivePage,
  setSelectedBoard,
  gerarPDF,
  logout
}) {

  return (

    <div className="
      min-h-screen
      flex
      bg-[#050816]
      text-white
    ">

      <Sidebar
        systemUser={systemUser}
        user={user}
        goToHistorico={goToHistorico}
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedBoard={setSelectedBoard}
        gerarPDF={gerarPDF}
        logout={logout}
      />

      <main className="
        flex-1
        overflow-y-auto
        p-10
      ">

        {children}

      </main>

    </div>
  );
}