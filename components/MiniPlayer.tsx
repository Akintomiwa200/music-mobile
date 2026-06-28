import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { ProgressBar } from "./ProgressBar";

export function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, next, progress } = usePlayer();

  if (!currentSong) return null;

  return (
    <Pressable
      onPress={() => router.push("/player")}
      className="border-t border-spotify-highlight bg-spotify-elevated"
    >
      <ProgressBar progress={progress} duration={currentSong.duration} height={2} />
      <View className="flex-row items-center px-2 py-2">
        <Image source={{ uri: currentSong.image }} className="h-12 w-12 rounded" contentFit="cover" />
        <View className="ml-3 min-w-0 flex-1">
          <Text numberOfLines={1} className="text-sm font-medium text-spotify-text-primary">
            {currentSong.title}
          </Text>
          <Text numberOfLines={1} className="text-xs text-spotify-text-secondary">
            {currentSong.artist}
          </Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            togglePlay();
          }}
          className="p-3 active:opacity-60"
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#fff" />
        </Pressable>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            next();
          }}
          className="p-3 active:opacity-60"
        >
          <Ionicons name="play-skip-forward" size={24} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}
