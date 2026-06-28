import type { Album, Artist, LibraryItem, Playlist, Song } from "../../types";
import {
  mapAlbum,
  mapAlbumToLibraryItem,
  mapArtist,
  mapArtistToLibraryItem,
  mapPlaylist,
  mapPlaylistToLibraryItem,
  mapTrack,
  mapTracks,
} from "./mappers";
import { spotifyFetch, spotifyFetchAllPages } from "./client";
import type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifySearchResult,
  SpotifyTrack,
} from "./types";

export type SpotifyUser = {
  id: string;
  display_name: string;
  email?: string;
  images?: { url: string }[];
  product?: string;
};

export type ForYouItem = {
  id: string;
  title: string;
  image: string;
  type: "playlist" | "album";
};

export async function getCurrentUser(): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>("/me");
}

export async function searchSpotify(query: string, limit = 20) {
  const params = new URLSearchParams({
    q: query,
    type: "track,album,artist,playlist",
    limit: String(limit),
  });

  const data = await spotifyFetch<SpotifySearchResult>(`/search?${params}`);

  return {
    songs: mapTracks(data.tracks?.items ?? []),
    albums: (data.albums?.items ?? []).map((a) => mapAlbum(a)),
    artists: (data.artists?.items ?? []).map(mapArtist),
    playlists: (data.playlists?.items ?? []).map((p) => mapPlaylist(p)),
  };
}

export async function fetchPlaylist(id: string): Promise<Playlist | null> {
  const playlist = await spotifyFetch<SpotifyPlaylist>(`/playlists/${id}`);
  const trackItems = await spotifyFetchAllPages<{ track: SpotifyTrack | null }>(
    `/playlists/${id}/tracks?limit=50`,
    (p) => p.items
  );
  const songs = mapTracks(trackItems.map((i) => i.track));
  return mapPlaylist(playlist, songs);
}

export async function fetchAlbum(id: string): Promise<Album | null> {
  const album = await spotifyFetch<SpotifyAlbum>(`/albums/${id}`);
  const songs = mapTracks(album.tracks?.items ?? []);
  return mapAlbum(album, songs);
}

export async function fetchArtist(id: string): Promise<Artist | null> {
  const artist = await spotifyFetch<SpotifyArtist>(`/artists/${id}`);
  return mapArtist(artist);
}

export async function fetchArtistTopTracks(artistId: string): Promise<Song[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(`/artists/${artistId}/top-tracks?market=US`);
  return mapTracks(data.tracks);
}

export async function fetchArtistAlbums(artistId: string): Promise<Album[]> {
  const items = await spotifyFetch<{ items: SpotifyAlbum[] }>(
    `/artists/${artistId}/albums?include_groups=album,single&limit=20`
  );
  return items.items.map((a) => mapAlbum(a));
}

export async function fetchUserPlaylists(limit = 30): Promise<LibraryItem[]> {
  const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>(`/me/playlists?limit=${limit}`);
  return data.items.map(mapPlaylistToLibraryItem);
}

export async function fetchSavedAlbums(limit = 20): Promise<LibraryItem[]> {
  const data = await spotifyFetch<{ items: { album: SpotifyAlbum }[] }>(`/me/albums?limit=${limit}`);
  return data.items.map((i) => mapAlbumToLibraryItem(i.album));
}

export async function fetchFollowedArtists(limit = 20): Promise<LibraryItem[]> {
  const data = await spotifyFetch<{ artists: { items: SpotifyArtist[] } }>(
    `/me/following?type=artist&limit=${limit}`
  );
  return data.artists.items.map(mapArtistToLibraryItem);
}

export async function fetchUserLibrary(): Promise<LibraryItem[]> {
  const [playlists, albums, artists] = await Promise.all([
    fetchUserPlaylists(25),
    fetchSavedAlbums(15),
    fetchFollowedArtists(15),
  ]);
  return [...playlists, ...albums, ...artists];
}

export async function fetchTopTracks(limit = 20): Promise<Song[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(`/me/top/tracks?limit=${limit}&time_range=short_term`);
  return mapTracks(data.items);
}

export async function fetchRecentlyPlayed(limit = 10): Promise<Song[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(`/me/player/recently-played?limit=${limit}`);
  return mapTracks(data.items.map((i) => i.track));
}

export async function fetchRecommendations(seedTracks: string[] = [], limit = 8): Promise<Song[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (seedTracks.length > 0) {
    params.set("seed_tracks", seedTracks.slice(0, 5).join(","));
  } else {
    params.set("seed_genres", "pop,hip-hop,electronic");
  }

  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(`/recommendations?${params}`);
  return mapTracks(data.tracks);
}

export async function fetchFeaturedPlaylists(limit = 6): Promise<ForYouItem[]> {
  try {
    const data = await spotifyFetch<{ playlists: { items: SpotifyPlaylist[] } }>(
      `/browse/featured-playlists?limit=${limit}&country=US`
    );
    return data.playlists.items.map((p) => ({
      id: p.id,
      title: p.name,
      image: p.images[0]?.url ?? "",
      type: "playlist" as const,
    }));
  } catch {
    const playlists = await fetchUserPlaylists(limit);
    return playlists.slice(0, limit).map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      type: "playlist" as const,
    }));
  }
}

export async function fetchNewReleases(limit = 6): Promise<ForYouItem[]> {
  const data = await spotifyFetch<{ albums: { items: SpotifyAlbum[] } }>(`/browse/new-releases?limit=${limit}&country=US`);
  return data.albums.items.map((a) => ({
    id: a.id,
    title: a.name,
    image: a.images[0]?.url ?? "",
    type: "album" as const,
  }));
}

export async function fetchTopArtists(limit = 10): Promise<Artist[]> {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    `/me/top/artists?limit=${limit}&time_range=medium_term`
  );
  return data.items.map(mapArtist);
}

export async function fetchMadeForYouTracks(limit = 10): Promise<Song[]> {
  try {
    const top = await fetchTopTracks(5);
    if (top.length > 0) {
      return fetchRecommendations(
        top.map((t) => t.id),
        limit
      );
    }
  } catch {
    /* fall through */
  }
  return fetchRecommendations([], limit);
}

export async function fetchHomeFeed() {
  const [madeForYou, favoriteArtists, topTracks, recentTracks] = await Promise.all([
    fetchMadeForYouTracks(10),
    fetchTopArtists(10),
    fetchTopTracks(8),
    fetchRecentlyPlayed(8),
  ]);

  const trending = topTracks.length > 0 ? topTracks : recentTracks;

  return { madeForYou, favoriteArtists, trending };
}

export function getSpotifyOpenUrl(song: Song) {
  return `https://open.spotify.com/track/${song.id}`;
}

export function getSpotifyDeepLink(song: Song) {
  return song.uri ?? `spotify:track:${song.id}`;
}
