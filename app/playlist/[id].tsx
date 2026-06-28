import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SongRow } from "../../components/SongRow";
import { SpotifyAuthRequired } from "../../components/spotify/SpotifyAuthRequired";
import { usePlayer } from "../../context/PlayerContext";
import { useSpotify } from "../../context/SpotifyContext";
import { LIKED_SONGS_ID } from "../../lib/spotify-constants";
import { ONVIZA } from "../../lib/theme";
import type { Playlist } from "../../types";

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading, getPlaylist, getLikedSongsPlaylist } = useSpotify();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  useEffect(() => {
    if (!isAuthenticated || !id) {
      setPlaylist(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchPlaylist = id === LIKED_SONGS_ID ? getLikedSongsPlaylist() : getPlaylist(id);

    fetchPlaylist
      .then((data) => {
        if (!cancelled) setPlaylist(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setPlaylist(null);
          setError(e instanceof Error ? e.message : "Failed to load playlist");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, getPlaylist, getLikedSongsPlaylist]);

  if (authLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-onviza-bg">
        <ActivityIndicator color={ONVIZA.purpleLight} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-onviza-bg">
        <SafeAreaView edges={["top"]}>
          <View className="px-4 py-3">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
        <SpotifyAuthRequired title="Playlist details" message="Connect Spotify to view playlists and play tracks." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-onviza-bg">
        <SafeAreaView edges={["top"]}>
          <View className="px-4 py-3">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
        <SpotifyAuthRequired title="Couldn't load playlist" message={error} compact />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View className="flex-1 items-center justify-center bg-onviza-bg">
        <Text className="text-white">Playlist not found</Text>
      </View>
    );
  }

  const isThisPlaying = currentSong && playlist.songs.some((s) => s.id === currentSong.id) && isPlaying;

  return (
    <View className="flex-1 bg-onviza-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <SafeAreaView edges={["top"]}>
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>

        <View className="px-5">
          {playlist.image ? (
            <View style={{ shadowColor: ONVIZA.purple, shadowOpacity: 0.35, shadowRadius: 20, elevation: 12 }}>
              <Image source={{ uri: playlist.image }} className="h-[220px] w-full rounded-3xl" contentFit="cover" />
            </View>
          ) : (
            <View
              className="h-[220px] w-full items-center justify-center rounded-3xl"
              style={{ backgroundColor: ONVIZA.purple }}
            >
              <Ionicons name="heart" size={72} color="#fff" />
            </View>
          )}
          <Text className="mt-5 text-[26px] font-extrabold text-white">{playlist.title}</Text>
          <Text className="mt-1 text-sm text-spotify-text-secondary">
            {playlist.owner} · {playlist.songCount} songs
          </Text>
          {!!playlist.description && (
            <Text className="mt-2 text-sm leading-5 text-spotify-text-muted">{playlist.description}</Text>
          )}

          <View className="mt-6 flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                if (isThisPlaying) togglePlay();
                else if (playlist.songs.length > 0) playQueue(playlist.songs, 0);
              }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: ONVIZA.purple,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: ONVIZA.purple,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Ionicons name={isThisPlaying ? "pause" : "play"} size={28} color="#fff" style={{ marginLeft: isThisPlaying ? 0 : 3 }} />
            </Pressable>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="shuffle" size={22} color={ONVIZA.textMuted} />
            </Pressable>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="heart-outline" size={22} color={ONVIZA.textMuted} />
            </Pressable>
          </View>
        </View>

        <View className="mt-6 px-1">
          {playlist.songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={playlist.songs} showImage />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
