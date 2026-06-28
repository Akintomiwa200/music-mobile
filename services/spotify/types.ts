export type SpotifyImage = { url: string; height: number; width: number };

export type SpotifyArtist = {
  id: string;
  name: string;
  images?: SpotifyImage[];
  followers?: { total: number };
  genres?: string[];
  popularity?: number;
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  tracks?: { items: SpotifyTrack[] };
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  uri: string;
  track_number?: number;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: { display_name: string };
  tracks: { total: number; items?: { track: SpotifyTrack | null }[] };
};

export type SpotifySearchResult = {
  tracks?: { items: SpotifyTrack[] };
  albums?: { items: SpotifyAlbum[] };
  artists?: { items: SpotifyArtist[] };
  playlists?: { items: SpotifyPlaylist[] };
};

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
};

export type SpotifyShow = {
  id: string;
  name: string;
  publisher: string;
  images: SpotifyImage[];
  description?: string;
};

export type SpotifyRecentlyPlayed = {
  items: { track: SpotifyTrack; played_at: string }[];
};

export type SpotifyTopItems = {
  items: SpotifyTrack[] | SpotifyArtist[];
};
