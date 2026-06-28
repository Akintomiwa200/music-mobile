import { getValidAccessToken } from "./auth";

const API_BASE = "https://api.spotify.com/v1";

export class SpotifyApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) {
    throw new SpotifyApiError("Not connected to Spotify", 401);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new SpotifyApiError(text || res.statusText, res.status);
  }

  return res.json() as Promise<T>;
}

export async function spotifyFetchAllPages<T>(
  path: string,
  getItems: (page: { items: T[]; next: string | null }) => T[],
  maxPages = 5
): Promise<T[]> {
  const items: T[] = [];
  let next: string | null = `${API_BASE}${path}`;
  let pages = 0;

  while (next && pages < maxPages) {
    const token = await getValidAccessToken();
    if (!token) break;

    const res = await fetch(next, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) break;

    const page = (await res.json()) as { items: T[]; next: string | null };
    items.push(...getItems(page));
    next = page.next;
    pages += 1;
  }

  return items;
}
