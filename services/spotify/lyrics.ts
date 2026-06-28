export type LyricLine = {
  text: string;
  startMs?: number;
  endMs?: number;
};

type LrcLibResponse = {
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
};

function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(lrc)) !== null) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const msPart = match[3].padEnd(3, "0").slice(0, 3);
    const millis = parseInt(msPart, 10);
    const startMs = (minutes * 60 + seconds) * 1000 + millis;
    const text = match[4].trim();
    if (text) lines.push({ text, startMs });
  }

  for (let i = 0; i < lines.length; i++) {
    if (lines[i + 1]?.startMs !== undefined) {
      lines[i].endMs = lines[i + 1].startMs;
    }
  }

  return lines;
}

export async function fetchLyrics(trackName: string, artistName: string): Promise<LyricLine[]> {
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
  });

  const res = await fetch(`https://lrclib.net/api/get?${params}`);
  if (!res.ok) return [];

  const data = (await res.json()) as LrcLibResponse;

  if (data.syncedLyrics) {
    const parsed = parseLrc(data.syncedLyrics);
    if (parsed.length > 0) return parsed;
  }

  if (data.plainLyrics) {
    return data.plainLyrics
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({ text }));
  }

  return [];
}

export function getActiveLyricIndex(lines: LyricLine[], progressMs: number): number {
  if (lines.length === 0) return 0;
  if (!lines[0].startMs) {
    return Math.min(lines.length - 1, Math.floor((progressMs / 1000 / 180) * lines.length));
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startMs !== undefined && progressMs >= lines[i].startMs!) {
      return i;
    }
  }
  return 0;
}
