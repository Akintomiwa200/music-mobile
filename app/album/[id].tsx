import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAlbum as getMockAlbum } from "../../constants/data";
import { SongRow } from "../../components/SongRow";
import { usePlayer } from "../../context/PlayerContext";
import { useSpotify } from "../../context/SpotifyContext";
import { ONVIZA } from "../../lib/theme";
import type { Album } from "../../types";

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, getAlbum } = useSpotify();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const data = await getAlbum(id!);
          if (!cancelled) setAlbum(data);
        } else {
          if (!cancelled) setAlbum(getMockAlbum(id!) ?? null);
        }
      } catch {
        if (!cancelled) setAlbum(getMockAlbum(id!) ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, getAlbum]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-onviza-bg">
        <ActivityIndicator color={ONVIZA.purpleLight} />
      </View>
    );
  }

  if (!album) {
    return (
      <View className="flex-1 items-center justify-center bg-onviza-bg">
        <Text className="text-white">Album not found</Text>
      </View>
    );
  }

  const isThisPlaying = currentSong && album.songs.some((s) => s.id === currentSong.id) && isPlaying;

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
          <View style={{ shadowColor: ONVIZA.purple, shadowOpacity: 0.35, shadowRadius: 20, elevation: 12 }}>
            <Image source={{ uri: album.image }} className="h-[220px] w-full rounded-3xl" contentFit="cover" />
          </View>
          <Text className="mt-5 text-[26px] font-extrabold text-white">{album.title}</Text>
          <Text className="mt-1 text-sm text-spotify-text-secondary">
            {album.year} · {album.artist} · {album.songs.length} songs
          </Text>

          <View className="mt-6 flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                if (isThisPlaying) togglePlay();
                else playQueue(album.songs, 0);
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
              <Ionicons
                name={isThisPlaying ? "pause" : "play"}
                size={28}
                color="#fff"
                style={{ marginLeft: isThisPlaying ? 0 : 3 }}
              />
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
          {album.songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} showAlbum={false} queue={album.songs} showImage />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
