const BASE_URL = "http://localhost:3001/api";

export async function getBoards() {
  const res = await fetch(`${BASE_URL}/boards`);
  const json = await res.json();

  return json?.data; 
}

export async function getMetrics(boardId) {
  const res = await fetch(`${BASE_URL}/metrics/${boardId}`);
  const json = await res.json();

  return json?.data; 
}