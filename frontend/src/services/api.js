const BASE_URL = "http://localhost:3001/api";

export async function getBoards() {
  const res = await fetch(`${BASE_URL}/boards`);
  return res.json();
}

export async function getMetrics(boardId) {
  const res = await fetch(`${BASE_URL}/metrics/${boardId}`);
  return res.json();
}