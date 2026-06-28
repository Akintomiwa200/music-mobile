import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { SongRowCompact } from "../components/SongRow";
import { getItemRoute } from "../lib/utils";
import { useSpotify } from "../context/SpotifyContext";
import { SpotifyConnectBanner } from "../components/spotify/SpotifyConnectBanner";
import { SpotifyAuthRequired } from "../components/spotify/SpotifyAuthRequired";
import { ONVIZA } from "../lib/theme";
import type { Album, Artist, Playlist, Song } from "../types";

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const query = q ?? "";
  const { isAuthenticated, isLoading: authLoading, search } = useSpotify();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    if (!query.trim()) return;

    if (!isAuthenticated) {
      setSongs([]);
      setAlbums([]);
      setPlaylists([]);
      setArtists([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    search(query)
      .then((results) => {
        if (!cancelled) {
          setSongs(results.songs);
          setAlbums(results.albums);
          setPlaylists(results.playlists);
          setArtists(results.artists);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setSongs([]);
          setAlbums([]);
          setPlaylists([]);
          setArtists([]);
          setError(e instanceof Error ? e.message : "Search failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, isAuthenticated, search]);

  const hasResults = songs.length + albums.length + playlists.length + artists.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-onviza-card"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <View
          className="flex-1 flex-row items-center rounded-2xl px-4 py-3"
          style={{ backgroundColor: ONVIZA.bgCard, borderWidth: 1, borderColor: ONVIZA.border }}
        >
          <Ionicons name="search" size={18} color={ONVIZA.textMuted} />
          <Text numberOfLines={1} className="ml-2 flex-1 text-base text-white">
            {query}
          </Text>
        </View>
      </View>

      {!isAuthenticated && <SpotifyConnectBanner compact />}

      {authLoading || loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={ONVIZA.purpleLight} />
        </View>
      ) : !isAuthenticated ? (
        <SpotifyAuthRequired title="Search requires Spotify" message="Connect your account to search Spotify's catalog." />
      ) : error ? (
        <SpotifyAuthRequired title="Search failed" message={error} compact />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {!hasResults ? (
            <View className="items-center px-8 pt-16">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-onviza-card">
                <Ionicons name="search" size={40} color={ONVIZA.textDim} />
              </View>
              <Text className="mt-5 text-center text-xl font-bold text-white">No results for "{query}"</Text>
              <Text className="mt-2 text-center text-spotify-text-secondary">Try a different spelling or search term.</Text>
            </View>
          ) : (
            <>
              {songs.length > 0 && (
                <View className="px-4 pt-2">
                  <Text className="mb-2 text-lg font-bold text-white">Songs</Text>
                  {songs.map((song) => (
                    <SongRowCompact key={song.id} song={song} />
                  ))}
                </View>
              )}

              {artists.length > 0 && (
                <View className="px-4 pt-6">
                  <Text className="mb-3 text-lg font-bold text-white">Artists</Text>
                  {artists.map((artist) => (
                    <Pressable
                      key={artist.id}
                      onPress={() => router.push(getItemRoute("artist", artist.id) as never)}
                      className="mb-3 flex-row items-center rounded-2xl bg-onviza-card p-3 active:opacity-90"
                    >
                      <Image source={{ uri: artist.image }} className="h-16 w-16 rounded-full" contentFit="cover" />
                      <View className="ml-4 flex-1">
                        <Text className="text-lg font-semibold text-white">{artist.name}</Text>
                        <Text className="text-sm text-spotify-text-secondary">Artist</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {albums.length > 0 && (
                <View className="px-4 pt-6">
                  <Text className="mb-3 text-lg font-bold text-white">Albums</Text>
                  {albums.map((album) => (
                    <Pressable
                      key={album.id}
                      onPress={() => router.push(getItemRoute("album", album.id) as never)}
                      className="mb-3 flex-row items-center rounded-2xl bg-onviza-card p-3 active:opacity-90"
                    >
                      <Image source={{ uri: album.image }} className="h-16 w-16 rounded-xl" contentFit="cover" />
                      <View className="ml-4 flex-1">
                        <Text numberOfLines={1} className="text-base font-semibold text-white">
                          {album.title}
                        </Text>
                        <Text className="text-sm text-spotify-text-secondary">
                          {album.year} · {album.artist}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {playlists.length > 0 && (
                <View className="px-4 pt-6">
                  <Text className="mb-3 text-lg font-bold text-white">Playlists</Text>
                  {playlists.map((playlist) => (
                    <Pressable
                      key={playlist.id}
                      onPress={() => router.push(getItemRoute("playlist", playlist.id) as never)}
                      className="mb-3 flex-row items-center rounded-2xl bg-onviza-card p-3 active:opacity-90"
                    >
                      <Image source={{ uri: playlist.image }} className="h-16 w-16 rounded-xl" contentFit="cover" />
                      <View className="ml-4 flex-1">
                        <Text numberOfLines={1} className="text-base font-semibold text-white">
                          {playlist.title}
                        </Text>
                        <Text className="text-sm text-spotify-text-secondary">Playlist · {playlist.owner}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
