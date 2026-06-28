export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const time =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name ? `${time}, ${name.split(" ")[0]}` : time;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export type ContentType = "playlist" | "album" | "artist";

export function getItemRoute(type: ContentType, id: string): string {
  if (type === "album") return `/album/${id}`;
  if (type === "artist") return `/artist/${id}`;
  return `/playlist/${id}`;
}

export function inferContentType(id: string): ContentType {
  if (id.startsWith("al")) return "album";
  if (id.startsWith("a")) return "artist";
  return "playlist";
}
