const BASE_URL = "http://localhost:3001/api";

// Busca o histórico de atividades do usuário logado
export async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history`);

    if (!res.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Erro getHistory:", error);
    return [];
  }
}