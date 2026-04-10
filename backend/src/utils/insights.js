export function generateInsight({ emAndamento, concluidas }) {
  if (emAndamento > concluidas) {
    return "Muitas tarefas em andamento. Possível sobrecarga da equipe.";
  }

  if (concluidas > emAndamento) {
    return "Equipe com bom ritmo de entrega.";
  }

  return "Fluxo equilibrado.";
}