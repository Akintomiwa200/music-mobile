export type Artist = {
  id: string;
  name: string;
  image: string;
  monthlyListeners?: string;
  verified?: boolean;
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
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  image: string;
  songs: Song[];
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
