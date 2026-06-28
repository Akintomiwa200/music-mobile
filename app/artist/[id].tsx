import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SongRow } from "../../components/SongRow";
import { AlbumCard } from "../../components/Cards";
import { SpotifyAuthRequired } from "../../components/spotify/SpotifyAuthRequired";
import { usePlayer } from "../../context/PlayerContext";
import { useSpotify } from "../../context/SpotifyContext";
import { ONVIZA } from "../../lib/theme";
import type { Album, Artist, Song } from "../../types";

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading, getArtist } = useSpotify();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const [artistAlbums, setArtistAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  useEffect(() => {
    if (!isAuthenticated || !id) {
      setArtist(null);
      setArtistSongs([]);
      setArtistAlbums([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getArtist(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setArtist(null);
          setArtistSongs([]);
          setArtistAlbums([]);
          return;
        }
        setArtist(data.artist);
        setArtistSongs(data.topTracks);
        setArtistAlbums(data.albums);
      })
      .catch((e) => {
        if (!cancelled) {
          setArtist(null);
          setArtistSongs([]);
          setArtistAlbums([]);
          setError(e instanceof Error ? e.message : "Failed to load artist");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, getArtist]);

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
        <SpotifyAuthRequired title="Artist details" message="Connect Spotify to view artist profiles, top tracks, and albums." />
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
        <SpotifyAuthRequired title="Couldn't load artist" message={error} compact />
      </View>
    );
  }

  if (!artist) {
    return (
      <View className="flex-1 items-center justify-center bg-onviza-bg">
        <Text className="text-white">Artist not found</Text>
      </View>
    );
  }

  const isThisPlaying = currentSong && artistSongs.some((s) => s.id === currentSong.id) && isPlaying;

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

        <View className="items-center px-5">
          <View
            style={{
              padding: 3,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: ONVIZA.purple,
              shadowColor: ONVIZA.purple,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <Image source={{ uri: artist.image }} className="h-48 w-48 rounded-full" contentFit="cover" />
          </View>
          <View className="mt-5 flex-row items-center">
            {artist.verified && <Ionicons name="checkmark-circle" size={22} color={ONVIZA.purpleLight} />}
            <Text className="ml-1 text-center text-[26px] font-extrabold text-white">{artist.name}</Text>
          </View>
          {!!artist.monthlyListeners && (
            <Text className="mt-2 text-sm text-spotify-text-secondary">{artist.monthlyListeners} monthly listeners</Text>
          )}

          <View className="mt-6 w-full flex-row items-center gap-3">
            <Pressable className="rounded-full px-5 py-2.5" style={{ borderWidth: 1, borderColor: ONVIZA.purpleLight }}>
              <Text className="font-semibold text-white">Follow</Text>
            </Pressable>
            <View className="flex-1" />
            <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-onviza-card">
              <Ionicons name="shuffle" size={22} color={ONVIZA.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => {
                if (isThisPlaying) togglePlay();
                else if (artistSongs.length > 0) playQueue(artistSongs, 0);
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
          </View>
        </View>

        {artistSongs.length > 0 && (
          <>
            <Text className="mb-2 mt-8 px-5 text-lg font-bold text-white">Popular</Text>
            <View className="px-1">
              {artistSongs.slice(0, 10).map((song, i) => (
                <SongRow key={song.id} song={song} index={i} queue={artistSongs} showImage />
              ))}
            </View>
          </>
        )}

        {artistAlbums.length > 0 && (
          <>
            <Text className="mb-3 mt-8 px-5 text-lg font-bold text-white">Discography</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {artistAlbums.map((a) => (
                <AlbumCard key={a.id} id={a.id} title={a.title} artist={a.artist} image={a.image} />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}
