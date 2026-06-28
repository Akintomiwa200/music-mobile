import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { formatDuration } from "../lib/utils";
import { ProgressBar } from "../components/ProgressBar";

export default function PlayerScreen() {
  const {
    currentSong,
    isPlaying,
    progress,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentSong) {
    return (
      <View className="flex-1 items-center justify-center bg-spotify-base">
        <Text className="text-spotify-text-secondary">No song playing</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-spotify-green">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#282828", "#121212", "#000"]} className="flex-1">
      <SafeAreaView className="flex-1 px-6" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </Pressable>
          <View className="items-center">
            <Text className="text-xs uppercase tracking-widest text-spotify-text-secondary">Playing from playlist</Text>
            <Text numberOfLines={1} className="text-sm font-semibold text-spotify-text-primary">
              Liked Songs
            </Text>
          </View>
          <Pressable className="p-2">
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Artwork */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={{ uri: currentSong.image }}
            className="aspect-square w-full max-w-sm rounded-lg shadow-2xl"
            contentFit="cover"
          />
        </View>

        {/* Song info */}
        <View className="mt-6 flex-row items-center justify-between">
          <View className="min-w-0 flex-1 pr-4">
            <Text numberOfLines={1} className="text-2xl font-bold text-spotify-text-primary">
              {currentSong.title}
            </Text>
            <Text numberOfLines={1} className="mt-1 text-base text-spotify-text-secondary">
              {currentSong.artist}
            </Text>
          </View>
          <Ionicons name="heart-outline" size={28} color="#B3B3B3" />
        </View>

        {/* Progress */}
        <View className="mt-6">
          <ProgressBar progress={progress} duration={currentSong.duration} height={4} seekable onSeek={seek} />
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-spotify-text-secondary">{formatDuration(progress)}</Text>
            <Text className="text-xs text-spotify-text-secondary">{formatDuration(currentSong.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View className="mt-4 flex-row items-center justify-between px-2">
          <Pressable onPress={toggleShuffle}>
            <Ionicons name="shuffle" size={24} color={shuffle ? "#1DB954" : "#B3B3B3"} />
          </Pressable>
          <Pressable onPress={previous} className="p-2">
            <Ionicons name="play-skip-back" size={36} color="#fff" />
          </Pressable>
          <Pressable
            onPress={togglePlay}
            className="h-16 w-16 items-center justify-center rounded-full bg-spotify-text-primary"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="#000"
              style={{ marginLeft: isPlaying ? 0 : 4 }}
            />
          </Pressable>
          <Pressable onPress={next} className="p-2">
            <Ionicons name="play-skip-forward" size={36} color="#fff" />
          </Pressable>
          <Pressable onPress={toggleRepeat}>
            <Ionicons
              name={repeat === "one" ? "repeat" : "repeat"}
              size={24}
              color={repeat !== "off" ? "#1DB954" : "#B3B3B3"}
            />
          </Pressable>
        </View>

        {/* Bottom actions */}
        <View className="mt-6 flex-row items-center justify-between pb-4">
          <Ionicons name="phone-portrait-outline" size={22} color="#B3B3B3" />
          <Ionicons name="share-outline" size={22} color="#B3B3B3" />
          <Pressable onPress={() => router.push("/queue")}>
            <Ionicons name="list" size={22} color="#B3B3B3" />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
