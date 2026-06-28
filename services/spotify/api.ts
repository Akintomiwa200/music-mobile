import type { Album, Artist, LibraryItem, Playlist, Song } from "../../types";
import { LIKED_SONGS_ID, YOUR_EPISODES_ID, HOME_GENRE_SEEDS } from "../../lib/spotify-constants";
import {
  mapAlbum,
  mapAlbumToLibraryItem,
  mapArtist,
  mapArtistToLibraryItem,
  mapPlaylist,
  mapPlaylistToLibraryItem,
  mapShowToLibraryItem,
  mapTrack,
  mapTracks,
} from "./mappers";
import { spotifyFetch, spotifyFetchAllPages } from "./client";
import type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifySearchResult,
  SpotifyShow,
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

export async function fetchSavedTracks(limit = 50): Promise<Song[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack | null }[] }>(`/me/tracks?limit=${limit}`);
  return mapTracks(data.items.map((i) => i.track));
}

export async function fetchSavedTracksTotal(): Promise<number> {
  const data = await spotifyFetch<{ total: number }>(`/me/tracks?limit=1`);
  return data.total ?? 0;
}

export function buildLikedSongsItem(count: number): LibraryItem {
  return {
    id: LIKED_SONGS_ID,
    title: "Liked Songs",
    subtitle: `Playlist • ${count} ${count === 1 ? "song" : "songs"}`,
    image: "",
    type: "playlist",
    pinned: true,
    special: "liked-songs",
  };
}

export async function fetchLikedSongsPlaylist(): Promise<Playlist> {
  const trackItems = await spotifyFetchAllPages<{ track: SpotifyTrack | null }>(
    `/me/tracks?limit=50`,
    (p) => p.items,
    10
  );
  const songs = mapTracks(trackItems.map((i) => i.track));
  return {
    id: LIKED_SONGS_ID,
    title: "Liked Songs",
    description: "Songs you've liked on Spotify",
    image: songs[0]?.image ?? "",
    owner: "You",
    songCount: songs.length,
    songs,
  };
}

export async function fetchSavedShows(limit = 20): Promise<LibraryItem[]> {
  try {
    const data = await spotifyFetch<{ items: { show: SpotifyShow }[] }>(`/me/shows?limit=${limit}`);
    return data.items.map((i) => mapShowToLibraryItem(i.show));
  } catch {
    return [];
  }
}

export async function fetchSavedEpisodesTotal(): Promise<number> {
  try {
    const data = await spotifyFetch<{ total: number }>(`/me/episodes?limit=1`);
    return data.total ?? 0;
  } catch {
    return 0;
  }
}

export function buildYourEpisodesItem(count: number): LibraryItem {
  return {
    id: YOUR_EPISODES_ID,
    title: "Your Episodes",
    subtitle: `Saved • ${count} ${count === 1 ? "episode" : "episodes"}`,
    image: "",
    type: "podcast",
    pinned: true,
    special: "your-episodes",
  };
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
  const [playlists, albums, artists, shows, likedCount, episodesCount] = await Promise.all([
    fetchUserPlaylists(25),
    fetchSavedAlbums(15),
    fetchFollowedArtists(15),
    fetchSavedShows(15),
    fetchSavedTracksTotal(),
    fetchSavedEpisodesTotal(),
  ]);

  const pinned: LibraryItem[] = [buildLikedSongsItem(likedCount)];
  if (episodesCount > 0) {
    pinned.push(buildYourEpisodesItem(episodesCount));
  }

  return [...pinned, ...playlists, ...albums, ...artists, ...shows];
}

export async function fetchTopTracks(limit = 20): Promise<Song[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(`/me/top/tracks?limit=${limit}&time_range=short_term`);
  return mapTracks(data.items);
}

export async function fetchRecentlyPlayed(limit = 10): Promise<Song[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(`/me/player/recently-played?limit=${limit}`);
  return mapTracks(data.items.map((i) => i.track));
}

export async function fetchRecommendations(
  seedTracks: string[] = [],
  limit = 8,
  seedGenres: string[] = []
): Promise<Song[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (seedTracks.length > 0) {
    params.set("seed_tracks", seedTracks.slice(0, 5).join(","));
  } else if (seedGenres.length > 0) {
    params.set("seed_genres", seedGenres.slice(0, 5).join(","));
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

export async function fetchBrowseCategories(limit = 12) {
  const colors = ["#27856a", "#5038a0", "#509bf5", "#af2896", "#8d67ab", "#e8115b", "#148a08", "#e13300", "#8400e7", "#477d95", "#777777", "#1e3264"];

  const data = await spotifyFetch<{ categories: { items: { id: string; name: string }[] } }>(
    `/browse/categories?limit=${limit}&country=US`
  );

  return data.categories.items.map((c, i) => ({
    id: c.id,
    title: c.name,
    color: colors[i % colors.length],
  }));
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

export async function fetchHomeFeedByGenre(genre: string) {
  if (!genre || genre === "All") {
    return fetchHomeFeed();
  }

  const seed = HOME_GENRE_SEEDS[genre] ?? genre.toLowerCase().replace(/\s+/g, "-");
  const searchQuery = `genre:${seed}`;

  const [madeForYou, searchResults, topArtists] = await Promise.all([
    fetchRecommendations([], 10, [seed]),
    searchSpotify(searchQuery, 8),
    searchSpotify(searchQuery, 10).then((r) => r.artists),
  ]);

  const favoriteArtists =
    topArtists.length > 0 ? topArtists.slice(0, 10) : (await fetchTopArtists(10)).filter((a) => a.genres?.includes(seed));

  return {
    madeForYou,
    favoriteArtists: favoriteArtists.length > 0 ? favoriteArtists : await fetchTopArtists(10),
    trending: searchResults.songs.length > 0 ? searchResults.songs : madeForYou.slice(0, 8),
  };
}

export function getSpotifyOpenUrl(song: Song) {
  return `https://open.spotify.com/track/${song.id}`;
}

export function getSpotifyDeepLink(song: Song) {
  return song.uri ?? `spotify:track:${song.id}`;
}
