export const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? "";

export const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
].join(" ");

export const MOOD_SEEDS: Record<string, { genres: string[]; label: string; emoji: string; color: string }> = {
  chill: { genres: ["chill", "ambient", "acoustic"], label: "Chill", emoji: "🌊", color: "#477d95" },
  energy: { genres: ["work-out", "edm", "hip-hop"], label: "Energy", emoji: "⚡", color: "#e8115b" },
  focus: { genres: ["study", "classical", "ambient"], label: "Focus", emoji: "🎯", color: "#27856a" },
  party: { genres: ["party", "dance", "pop"], label: "Party", emoji: "🎉", color: "#af2896" },
  sad: { genres: ["sad", "indie", "piano"], label: "Melancholy", emoji: "🌧️", color: "#509bf5" },
  romance: { genres: ["romance", "r-n-b", "soul"], label: "Romance", emoji: "💜", color: "#5038a0" },
};

export const SEARCH_CATEGORIES = [
  { id: "pop", title: "Pop", color: "#8d67ab" },
  { id: "hip-hop", title: "Hip-Hop", color: "#af2896" },
  { id: "rock", title: "Rock", color: "#e8115b" },
  { id: "electronic", title: "Electronic", color: "#509bf5" },
  { id: "r-n-b", title: "R&B", color: "#ba5d07" },
  { id: "indie", title: "Indie", color: "#477d95" },
  { id: "latin", title: "Latin", color: "#148a08" },
  { id: "jazz", title: "Jazz", color: "#1e3264" },
  { id: "classical", title: "Classical", color: "#777777" },
  { id: "country", title: "Country", color: "#e13300" },
  { id: "metal", title: "Metal", color: "#8400e7" },
  { id: "soul", title: "Soul", color: "#27856a" },
];
