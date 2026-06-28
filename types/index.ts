export type Artist = {
  id: string;
  name: string;
  image: string;
  monthlyListeners?: string;
  verified?: boolean;
  followers?: number;
  genres?: string[];
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  image: string;
  explicit?: boolean;
  previewUrl?: string | null;
  uri?: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  image: string;
  songs: Song[];
  totalTracks?: number;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  image: string;
  owner: string;
  songCount: number;
  songs: Song[];
  gradient?: [string, string];
};

export type SearchCategory = {
  id: string;
  title: string;
  color: string;
  image?: string;
};

export type LibraryItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: "playlist" | "album" | "artist" | "podcast";
  pinned?: boolean;
  special?: "liked-songs" | "your-episodes";
};

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  queue: Song[];
  queueIndex: number;
};
