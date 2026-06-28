import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { useSettings } from "../context/SettingsContext";
import { formatDuration } from "../lib/utils";
import { WaveformProgress } from "../components/onviza/WaveformProgress";
import { fetchLyrics, getActiveLyricIndex, type LyricLine } from "../services/spotify/lyrics";
import { SpotifyIcon } from "../components/spotify/SpotifyIcon";
import { ONVIZA } from "../lib/theme";

export default function PlayerScreen() {
  const { settings } = useSettings();
  const [liked, setLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(settings.playback.showLyrics);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  const {
    currentSong,
    isPlaying,
    progress,
    shuffle,
    repeat,
    hasPreview,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
    openInSpotify,
  } = usePlayer();

  useEffect(() => {
    if (!currentSong || !showLyrics) {
      setLyrics([]);
      return;
    }

    let cancelled = false;
    fetchLyrics(currentSong.title, currentSong.artist).then((lines) => {
      if (!cancelled) setLyrics(lines);
    });

    return () => {
      cancelled = true;
    };
  }, [currentSong?.id, currentSong?.title, currentSong?.artist, showLyrics]);

  if (!currentSong) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: ONVIZA.playerBg }}>
        <Ionicons name="musical-notes-outline" size={64} color={ONVIZA.textDim} />
        <Text className="mt-4 text-lg font-bold text-white">Nothing playing</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-full px-8 py-3"
          style={{ backgroundColor: ONVIZA.purple }}
        >
          <Text className="font-bold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const activeLine = getActiveLyricIndex(lyrics, progress * 1000);

  return (
    <View className="flex-1" style={{ backgroundColor: ONVIZA.playerBg }}>
      <SafeAreaView className="flex-1 px-6" edges={["top", "bottom"]}>
        <View className="flex-row items-center justify-between py-2">
          <Pressable onPress={() => router.back()} hitSlop={12} className="h-10 w-10 items-center justify-center">
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </Pressable>
          <Text className="text-base font-semibold text-white">Now Playing</Text>
          <Pressable onPress={() => setLiked((v) => !v)} hitSlop={12} className="h-10 w-10 items-center justify-center">
            <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? "#fff" : ONVIZA.textMuted} />
          </Pressable>
        </View>

        <View className="mt-4 flex-1 items-center justify-center">
          <View
            style={{
              width: "100%",
              maxWidth: 340,
              shadowColor: ONVIZA.purple,
              shadowOpacity: 0.35,
              shadowRadius: 28,
              shadowOffset: { width: 0, height: 12 },
              elevation: 14,
            }}
          >
            <Image source={{ uri: currentSong.image }} className="aspect-square w-full rounded-3xl" contentFit="cover" />
          </View>
        </View>

        <View className="mt-6 flex-row items-start">
          <View className="min-w-0 flex-1 pr-4">
            <Text numberOfLines={1} className="text-[22px] font-bold text-white">
              {currentSong.title}
            </Text>
            <Text numberOfLines={1} className="mt-1 text-base text-spotify-text-secondary">
              {currentSong.artist}
            </Text>
            {!hasPreview && (
              <Pressable onPress={openInSpotify} className="mt-2 flex-row items-center">
                <SpotifyIcon size={16} color={ONVIZA.purpleLight} />
                <Text className="ml-1.5 text-sm font-semibold text-onviza-purple-light">Open full track in Spotify</Text>
              </Pressable>
            )}
          </View>
          <Pressable onPress={() => setLiked((v) => !v)} hitSlop={8} className="pt-1">
            <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color="#fff" />
          </Pressable>
        </View>

        <View className="mt-6">
          <WaveformProgress progress={progress} duration={currentSong.duration} onSeek={seek} seed={currentSong.id} />
          <View className="mt-2 flex-row justify-between">
            <Text className="text-xs tabular-nums text-spotify-text-secondary">{formatDuration(progress)}</Text>
            <Text className="text-xs tabular-nums text-spotify-text-secondary">{formatDuration(currentSong.duration)}</Text>
          </View>
        </View>

        {showLyrics && (
          <ScrollView className="mt-4 max-h-28" showsVerticalScrollIndicator={false}>
            {lyrics.length === 0 ? (
              <Text className="text-center text-sm text-spotify-text-secondary">Lyrics not available for this track</Text>
            ) : (
              lyrics.map((line, i) => (
                <Text
                  key={`${i}-${line.text}`}
                  className="py-0.5 text-center text-sm"
                  style={{
                    color: i === activeLine ? ONVIZA.purpleLight : ONVIZA.textDim,
                    fontWeight: i === activeLine ? "700" : "400",
                  }}
                >
                  {line.text}
                </Text>
              ))
            )}
          </ScrollView>
        )}

        <View className="mt-6 flex-row items-center justify-between px-1">
          <Pressable onPress={toggleShuffle} hitSlop={10} className="w-10 items-center">
            <Ionicons name="shuffle" size={22} color={shuffle ? ONVIZA.purpleLight : ONVIZA.textMuted} />
          </Pressable>
          <Pressable onPress={previous} hitSlop={10} className="w-10 items-center">
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </Pressable>
          <Pressable
            onPress={togglePlay}
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
              shadowRadius: 14,
              elevation: 10,
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="#fff"
              style={{ marginLeft: isPlaying ? 0 : 3 }}
            />
          </Pressable>
          <Pressable onPress={next} hitSlop={10} className="w-10 items-center">
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </Pressable>
          <Pressable onPress={toggleRepeat} hitSlop={10} className="w-10 items-center">
            <Ionicons name="repeat" size={22} color={repeat !== "off" ? ONVIZA.purpleLight : ONVIZA.textMuted} />
          </Pressable>
        </View>

        <View className="mt-8 flex-row items-center justify-between pb-2">
          <Pressable
            onPress={() => setShowLyrics((v) => !v)}
            className="flex-row items-center rounded-full px-4 py-2.5"
            style={{
              backgroundColor: showLyrics ? ONVIZA.purple : "rgba(147, 51, 234, 0.15)",
              borderWidth: showLyrics ? 0 : 1,
              borderColor: ONVIZA.border,
            }}
          >
            <Ionicons name="text" size={18} color="#fff" />
            <Text className="ml-2 text-sm font-semibold text-white">Lyrics</Text>
          </Pressable>

          <View className="flex-row items-center gap-6">
            <Pressable hitSlop={8}>
              <Ionicons name="share-outline" size={22} color={ONVIZA.textMuted} />
            </Pressable>
            <Pressable onPress={() => router.push("/queue")} hitSlop={8}>
              <Ionicons name="list" size={22} color={ONVIZA.textMuted} />
            </Pressable>
            <Pressable onPress={openInSpotify} hitSlop={8}>
              <SpotifyIcon size={22} color={ONVIZA.purpleLight} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
