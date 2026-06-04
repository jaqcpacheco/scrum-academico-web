import { auth } from "./firebase";

export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function authFetch(url, options = {}) {
  const token = await getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}

export async function getBoards() {
  const res = await authFetch(`${BASE_URL}/boards`);
  const json = await res.json();
  return json?.data;
}

export async function getMetrics(boardId) {
  const res = await authFetch(`${BASE_URL}/metrics/${boardId}`);
  const json = await res.json();
  return json?.data;
}
