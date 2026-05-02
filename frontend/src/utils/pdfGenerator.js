import jsPDF from "jspdf";

export function gerarPDF(metrics, boardName) {
  const doc = new jsPDF();

  let y = 20;

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Relatório de Análise de Performance Ágil", 20, y);

  y += 10;

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Board: ${boardName}`, 20, y);
  y += 6;

  doc.text(`Data: ${new Date().toLocaleString()}`, 20, y);

  y += 12;

  // Métricas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Métricas", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const linhas = [
    `Total de tarefas: ${metrics.total}`,
    `Concluídas: ${metrics.concluidas}`,
    `Em andamento: ${metrics.emAndamento}`,
    `Backlog: ${metrics.backlog}`,
    `Não identificadas: ${metrics.naoIdentificadas ?? 0}`,
    `Produtividade: ${metrics.produtividade}%`
  ];

  linhas.forEach(l => {
    doc.text(l, 25, y);
    y += 6;
  });

  y += 6;

  // Insights
  if (metrics.insights?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Insights", 20, y);

    y += 8;
    doc.setFont("helvetica", "normal");

    metrics.insights.forEach(i => {
      doc.text(`• ${i.texto}`, 25, y);
      y += 6;
    });

    y += 6;
  }

  // Gargalos
  if (metrics.gargalos?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Gargalos Identificados", 20, y);

    y += 8;
    doc.setFont("helvetica", "normal");

    metrics.gargalos.forEach(g => {
      doc.text(`• ${g.texto}`, 25, y);
      y += 6;
    });

    y += 6;
  }

  // Conclusão automática
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Conclusão", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");

  let conclusao = "A equipe apresenta um desempenho equilibrado.";

  if (metrics.naoIdentificadas > 0) {
    conclusao =
      "Foram identificadas tarefas fora do fluxo padrão, indicando necessidade de organização do processo.";
  } else if (metrics.produtividade > 70) {
    conclusao =
      "A equipe apresenta alta produtividade e fluxo eficiente de trabalho.";
  }

  doc.text(conclusao, 25, y, { maxWidth: 160 });

  y += 20;

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    "Gerado automaticamente pelo Sistema de Análise Ágil",
    20,
    280
  );

  // Salvar PDF
  doc.save(`relatorio-${boardName}-${new Date().toLocaleDateString()}.pdf`);
}