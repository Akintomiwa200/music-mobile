export type StreamingQuality = "auto" | "high" | "low";

export type HomeSections = {
  jumpBackIn: boolean;
  madeForYou: boolean;
  recentlyPlayed: boolean;
  topMixes: boolean;
  moodMatch: boolean;
  shortcuts: boolean;
};

export type PlaybackSettings = {
  autoplay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  normalizeVolume: boolean;
  gaplessPlayback: boolean;
  showLyrics: boolean;
  lyricsSync: boolean;
  streamingQuality: StreamingQuality;
};

export type NotificationSettings = {
  newReleases: boolean;
  artistUpdates: boolean;
  recommendations: boolean;
  friendActivity: boolean;
  pushEnabled: boolean;
};

export type PrivacySettings = {
  showListeningActivity: boolean;
  privateSession: boolean;
  shareDataForRecommendations: boolean;
};

export type AppearanceSettings = {
  compactLibrary: boolean;
  showTabLabels: boolean;
  language: "en" | "es" | "fr";
  canvasStyle: "default" | "vibrant" | "minimal";
};

export type LibrarySettings = {
  defaultFilter: "Playlists" | "Albums" | "Artists" | "Podcasts";
  sortOrder: "recent" | "alphabetical" | "creator";
  showDownloadedOnly: boolean;
};

export type UserSettings = {
  displayName: string;
  avatarUri: string;
  favoriteGenres: string[];
  defaultMood: string | null;
  accentColor: string;
  homeSections: HomeSections;
  playback: PlaybackSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  library: LibrarySettings;
  explicitContent: boolean;
  dataSaver: boolean;
  onboardingComplete: boolean;
};

export const ACCENT_COLORS = [
  { id: "purple", label: "Onviza Purple", hex: "#9333EA" },
  { id: "blue", label: "Blue", hex: "#509bf5" },
  { id: "pink", label: "Pink", hex: "#af2896" },
  { id: "orange", label: "Orange", hex: "#e13300" },
  { id: "teal", label: "Teal", hex: "#27856a" },
] as const;

export const GENRE_OPTIONS = [
  "Pop",
  "Hip-Hop",
  "Rock",
  "Electronic",
  "R&B",
  "Indie",
  "Latin",
  "Jazz",
  "Classical",
  "Country",
  "Metal",
  "Soul",
  "Afrobeats",
  "K-Pop",
  "Reggae",
] as const;

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Listener",
  avatarUri: "https://picsum.photos/seed/profile/200/200",
  favoriteGenres: ["Pop", "Hip-Hop", "R&B"],
  defaultMood: "chill",
  accentColor: "#9333EA",
  homeSections: {
    jumpBackIn: true,
    madeForYou: true,
    recentlyPlayed: true,
    topMixes: true,
    moodMatch: true,
    shortcuts: true,
  },
  playback: {
    autoplay: true,
    crossfade: false,
    crossfadeDuration: 5,
    normalizeVolume: true,
    gaplessPlayback: true,
    showLyrics: true,
    lyricsSync: true,
    streamingQuality: "auto",
  },
  notifications: {
    newReleases: true,
    artistUpdates: true,
    recommendations: true,
    friendActivity: false,
    pushEnabled: true,
  },
  privacy: {
    showListeningActivity: true,
    privateSession: false,
    shareDataForRecommendations: true,
  },
  appearance: {
    compactLibrary: false,
    showTabLabels: true,
    language: "en",
    canvasStyle: "default",
  },
  library: {
    defaultFilter: "Playlists",
    sortOrder: "recent",
    showDownloadedOnly: false,
  },
  explicitContent: true,
  dataSaver: false,
  onboardingComplete: false,
};
