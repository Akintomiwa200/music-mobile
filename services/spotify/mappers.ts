import type { Album, Artist, LibraryItem, Playlist, Song } from "../../types";
import type { SpotifyAlbum, SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from "./types";

function bestImage(images: { url: string }[] | undefined, fallback = ""): string {
  return images?.[0]?.url ?? fallback;
}

export function mapTrack(track: SpotifyTrack | null | undefined): Song | null {
  if (!track?.id) return null;
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    artistId: track.artists[0]?.id ?? "",
    album: track.album.name,
    albumId: track.album.id,
    duration: Math.max(1, Math.floor(track.duration_ms / 1000)),
    image: bestImage(track.album.images),
    explicit: track.explicit,
    previewUrl: track.preview_url,
    uri: track.uri,
  };
}

export function mapTracks(tracks: (SpotifyTrack | null | undefined)[]): Song[] {
  return tracks.map(mapTrack).filter((t): t is Song => t !== null);
}

export function mapAlbum(album: SpotifyAlbum, tracks: Song[] = []): Album {
  return {
    id: album.id,
    title: album.name,
    artist: album.artists.map((a) => a.name).join(", "),
    artistId: album.artists[0]?.id ?? "",
    year: parseInt(album.release_date?.slice(0, 4) ?? "2024", 10),
    image: bestImage(album.images),
    songs: tracks,
    totalTracks: album.total_tracks,
  };
}

export function mapArtist(artist: SpotifyArtist): Artist {
  const listeners = artist.followers?.total;
  return {
    id: artist.id,
    name: artist.name,
    image: bestImage(artist.images, "https://via.placeholder.com/300"),
    monthlyListeners: listeners ? `${(listeners / 1_000_000).toFixed(1)}M` : undefined,
    followers: listeners,
    genres: artist.genres,
    verified: (artist.popularity ?? 0) > 70,
  };
}

export function mapPlaylist(playlist: SpotifyPlaylist, songs: Song[] = []): Playlist {
  return {
    id: playlist.id,
    title: playlist.name,
    description: playlist.description?.replace(/<[^>]+>/g, "") ?? "",
    image: bestImage(playlist.images, "https://via.placeholder.com/400"),
    owner: playlist.owner.display_name,
    songCount: playlist.tracks.total,
    songs,
  };
}

export function mapPlaylistToLibraryItem(playlist: SpotifyPlaylist): LibraryItem {
  return {
    id: playlist.id,
    title: playlist.name,
    subtitle: `Playlist • ${playlist.owner.display_name}`,
    image: bestImage(playlist.images),
    type: "playlist",
  };
}

export function mapAlbumToLibraryItem(album: SpotifyAlbum): LibraryItem {
  return {
    id: album.id,
    title: album.name,
    subtitle: `Album • ${album.artists[0]?.name ?? ""}`,
    image: bestImage(album.images),
    type: "album",
  };
}

export function mapArtistToLibraryItem(artist: SpotifyArtist): LibraryItem {
  return {
    id: artist.id,
    title: artist.name,
    subtitle: "Artist",
    image: bestImage(artist.images),
    type: "artist",
  };
}
