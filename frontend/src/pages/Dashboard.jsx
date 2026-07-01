import { useState, useEffect } from "react";
import AppLayout from "../layout/AppLayout";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TeamChart from "../components/TeamChart";
import InsightsPanel from "../components/InsightsPanel";
import TeamPerformance from "../components/TeamPerformance";
import Settings from "./Settings";
import { BASE_URL, authFetch } from "../services/api.js";

export default function Dashboard({
  boards,
  selectedBoard,
  setSelectedBoard,
  metrics,
  loading,
  goToHistorico,
  systemUser,
  user,
}) {
  const [activePage, setActivePage] = useState("boards");
  const [historico, setHistorico] = useState([]);
  const [boardsMetrics, setBoardsMetrics] = useState({});
  const [loadingBoards, setLoadingBoards] = useState(false);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const uid = savedUser?.user?.uid || savedUser?.uid;
        const res = await authFetch(`${BASE_URL}/history?userId=${uid}`);
        const data = await res.json();
        setHistorico(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro histórico:", err);
      }
    };
    carregarHistorico();
  }, []);

  useEffect(() => {
    async function carregarBoardsMetrics() {
      try {
        setLoadingBoards(true);
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const uid = savedUser?.user?.uid || savedUser?.uid;

        const resultados = await Promise.all(
          boards.map(async (board) => {
            try {
              const res = await authFetch(
                `${BASE_URL}/metrics/${board.id}?userId=${uid}`
              );
              const data = await res.json();
              return { id: board.id, data: data?.data || null };
            } catch {
              return { id: board.id, data: null };
            }
          })
        );

        const mapa = {};
        resultados.forEach(({ id, data }) => { mapa[id] = data; });
        setBoardsMetrics(mapa);
      } catch (error) {
        console.error("Erro boards metrics:", error);
      } finally {
        setLoadingBoards(false);
      }
    }

    if (boards?.length > 0) carregarBoardsMetrics();
  }, [boards]);

  const gerarPDF = () => {
    if (!metrics) return;

    const membrosHTML = metrics.memberMetrics?.length > 0
      ? `<table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:10px;text-align:left;border:1px solid #e2e8f0;">Membro</th>
              <th style="padding:10px;text-align:center;border:1px solid #e2e8f0;">Tarefas</th>
              <th style="padding:10px;text-align:center;border:1px solid #e2e8f0;">Concluídas</th>
              <th style="padding:10px;text-align:center;border:1px solid #e2e8f0;">Produtividade</th>
            </tr>
          </thead>
          <tbody>
            ${metrics.memberMetrics.map(m => `
              <tr>
                <td style="padding:10px;border:1px solid #e2e8f0;">${m.nome}</td>
                <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${m.tarefas}</td>
                <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${m.concluidas}</td>
                <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${m.produtividade}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>`
      : "<p>Nenhum membro encontrado.</p>";

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>Relatório Project Minds</title>
        <style>
          body{font-family:Arial;padding:40px;color:#000;max-width:800px;margin:0 auto}
          h1{color:#1e293b;font-size:28px;margin-bottom:4px}
          h2{color:#1e293b;font-size:18px;margin-top:30px;margin-bottom:12px}
          p{margin:8px 0;font-size:14px;line-height:1.6}
          hr{border:1px solid #e2e8f0;margin:24px 0}
          .subtitle{color:#64748b;font-size:13px;margin-bottom:4px}
          .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:bold}
          .badge-green{background:#dcfce7;color:#16a34a}
          .badge-red{background:#fee2e2;color:#dc2626}
          .badge-yellow{background:#fef9c3;color:#ca8a04}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}
          .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px}
          .card-label{font-size:12px;color:#64748b;margin-bottom:4px}
          .card-value{font-size:22px;font-weight:bold;color:#1e293b}
          .insight{background:#f8fafc;border-left:4px solid #6366f1;padding:16px;border-radius:4px;line-height:1.8;white-space:pre-line}
        </style>
      </head><body>
        <h1>📊 Relatório Project Minds</h1>
        <p class="subtitle">Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
        <p class="subtitle">Usuário: ${systemUser?.nome || "—"}</p>
        <hr/>
        <h2>📌 Resumo Geral</h2>
        <div class="grid">
          <div class="card"><div class="card-label">Total de Tarefas</div><div class="card-value">${metrics.total}</div></div>
          <div class="card"><div class="card-label">Produtividade</div><div class="card-value">${metrics.produtividade}%</div></div>
          <div class="card"><div class="card-label">Concluídas</div><div class="card-value">${metrics.concluidas}</div></div>
          <div class="card"><div class="card-label">Em Andamento</div><div class="card-value">${metrics.emAndamento}</div></div>
          <div class="card"><div class="card-label">Backlog</div><div class="card-value">${metrics.backlog}</div></div>
          <div class="card"><div class="card-label">Eficiência</div><div class="card-value">${metrics.eficiencia}</div></div>
        </div>
        <hr/>
        <h2>📊 Porcentagens</h2>
        <p><strong>Concluídas:</strong> ${metrics.porcentagens?.concluidas}%</p>
        <p><strong>Em Andamento:</strong> ${metrics.porcentagens?.emAndamento}%</p>
        <p><strong>Backlog:</strong> ${metrics.porcentagens?.backlog}%</p>
        <hr/>
        <h2>🔄 Kanban — WIP</h2>
        <p><strong>WIP Atual:</strong> ${metrics.wip} / ${metrics.wipLimit}</p>
        <p><strong>WIP (%):</strong> ${metrics.wipPercent}%</p>
        <p><strong>Status WIP:</strong> <span class="badge ${metrics.wipStatus === "Ideal" ? "badge-green" : metrics.wipStatus === "Alto" ? "badge-red" : "badge-yellow"}">${metrics.wipStatus}</span></p>
        <p><strong>Limite:</strong> ${metrics.wipLimitStatus}</p>
        <p><strong>Gargalo identificado:</strong> ${metrics.gargalo ? "⚠️ Sim" : "✅ Não"}</p>
        <hr/>
        <h2>👥 Desempenho por Membro</h2>
        ${membrosHTML}
        <hr/>
        <h2> Insight da IA</h2>
        <div class="insight">${metrics.insight}</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error("Erro logout:", err);
    }
  };

  const totalTasks = boards.reduce((acc, b) => acc + (boardsMetrics[b.id]?.total || 0), 0);
  const totalMembers = boards.reduce((acc, b) => acc + (boardsMetrics[b.id]?.memberMetrics?.length || 0), 0);
  const avgProdutividade = boards.length > 0
    ? Math.round(boards.reduce((acc, b) => acc + (boardsMetrics[b.id]?.produtividade || 0), 0) / boards.length)
    : 0;

  const SkeletonCard = () => (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
      <div className="h-8 w-16 bg-white/5 rounded mb-2" />
      <div className="h-3 w-24 bg-white/5 rounded" />
    </div>
  );

  const SkeletonBoard = () => (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-40 bg-white/5 rounded" />
        <div className="h-5 w-5 bg-white/5 rounded" />
      </div>
      <div className="flex gap-2 mb-5">
        <div className="h-6 w-20 bg-white/5 rounded-full" />
        <div className="h-6 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-8 bg-white/5 rounded" />
        <div className="h-8 bg-white/5 rounded" />
        <div className="h-8 bg-white/5 rounded" />
      </div>
    </div>
  );

  return (
    <AppLayout
      systemUser={systemUser}
      user={user}
      goToHistorico={goToHistorico}
      activePage={activePage}
      setActivePage={setActivePage}
      setSelectedBoard={setSelectedBoard}
      gerarPDF={gerarPDF}
      logout={logout}
    >
      <div id="relatorio">
        {loading && (
          <p className="text-slate-400 text-sm mb-6 animate-pulse">
             Carregando análise...
          </p>
        )}

        {activePage === "settings" && (
          <Settings systemUser={systemUser} user={user} />
        )}

        {activePage !== "settings" && !selectedBoard && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Boards</h1>
                <p className="text-slate-400">Gerencie os workspaces da equipe</p>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {loadingBoards ? (
                <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
              ) : (
                <>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{boards.length}</p>
                    <p className="text-slate-400 text-sm">Total Boards</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{totalTasks}</p>
                    <p className="text-slate-400 text-sm">Active Tasks</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{totalMembers}</p>
                    <p className="text-slate-400 text-sm">Team Members</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{avgProdutividade}%</p>
                    <p className="text-slate-400 text-sm">Avg. Performance</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loadingBoards
                ? boards.map((b) => <SkeletonBoard key={b.id} />)
                : boards.map((board) => {
                    const bm = boardsMetrics[board.id];
                    const produtividade = bm?.produtividade || 0;
                    const isHealthy = !bm?.gargalo;
                    const metodologia = bm?.wip !== undefined ? "KANBAN" : "SCRUM";

                    return (
                      <button
                        key={board.id}
                        onClick={() => {
                          setSelectedBoard(board.id);
                          setActivePage("performance");
                        }}
                        className="text-left p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,.08)] transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h2 className="text-base font-semibold text-white leading-snug pr-2">{board.name}</h2>
                          <span className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all text-lg mt-0.5">→</span>
                        </div>
                        <div className="flex items-center gap-2 mb-5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isHealthy ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
                            {isHealthy ? "● Healthy" : "● At Risk"}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white/5 text-slate-400 border border-white/10">
                            {metodologia}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Tasks</p>
                            <p className="text-white font-semibold">{bm?.total || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Members</p>
                            <p className="text-white font-semibold">{bm?.memberMetrics?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Score</p>
                            <p className="text-emerald-400 font-semibold">{produtividade}%</p>
                          </div>
                        </div>
                      </button>
                    );
                  })
              }
            </div>
          </div>
        )}

        {activePage !== "settings" && !selectedBoard && activePage !== "boards" && (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="text-6xl mb-6">📂</div>
            <h2 className="text-3xl font-bold text-white mb-3">Nenhum board selecionado</h2>
            <p className="text-slate-400 max-w-md">Selecione um board para visualizar métricas, insights e desempenho da equipe.</p>
          </div>
        )}

        {activePage !== "settings" && selectedBoard && metrics && (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-white">Project Minds Dashboard</h1>
                <p className="text-slate-400">Métricas e insights em tempo real</p>
              </div>
              <button
                onClick={() => { setSelectedBoard(""); setActivePage("boards"); }}
                className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
              >
                ← Voltar aos boards
              </button>
            </div>

            {activePage === "performance" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <Card title="Total" value={metrics.total} />
                  <Card title="Backlog" value={metrics.backlog} />
                  <Card title="Em progresso" value={metrics.emAndamento} />
                  <Card title="Concluídas" value={metrics.concluidas} />
                  <Card title="Produtividade" value={`${metrics.produtividade}%`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <Card title="WIP" value={`${metrics.wip} / ${metrics.wipLimit}`} subtitle={`${metrics.wipPercent}%`} />
                  <Card title="Eficiência" value={metrics.eficiencia} />
                  <Card title="Status WIP" value={metrics.wipStatus} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
                  <Chart
                    data={historico.length > 0
                      ? [...historico]
                          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                          .slice(-7)
                          .map(item => ({
                            dia: new Date(item.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                            valor: item.concluidas
                          }))
                      : []}
                  />
                  <TeamChart
                    data={[
                      { nome: "Concluídas", quantidade: metrics.concluidas },
                      { nome: "Em andamento", quantidade: metrics.emAndamento },
                      { nome: "Backlog", quantidade: metrics.backlog },
                    ]}
                  />
                </div>
                <div className="mt-10">
                  <TeamPerformance members={metrics.memberMetrics || []} />
                </div>
              </>
            )}

            {activePage === "insights" && (
              <div className="mt-6"><InsightsPanel metrics={metrics} /></div>
            )}

            {activePage === "team" && (
              <div className="mt-6"><TeamPerformance members={metrics?.memberMetrics || []} /></div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
