import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "../context/PlayerContext";
import { ProgressBar } from "./ProgressBar";
import { ONVIZA } from "../lib/theme";
import { getTabBarBottomInset } from "../lib/layout";

export function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, next, progress } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!currentSong) return null;

  const bottom = getTabBarBottomInset(insets.bottom) + 8;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom,
        left: 12,
        right: 12,
        zIndex: 90,
        elevation: 90,
        borderRadius: 16,
        backgroundColor: ONVIZA.card,
        borderWidth: 1,
        borderColor: ONVIZA.border,
        shadowColor: ONVIZA.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        overflow: "hidden",
      }}
    >
      <ProgressBar progress={progress} duration={currentSong.duration} height={2} accentColor={ONVIZA.purpleLight} />
      <Pressable onPress={() => router.push("/player")} className="flex-row items-center px-3 py-2.5 active:opacity-95">
        <Image source={{ uri: currentSong.image }} className="h-[48px] w-[48px] rounded-xl" contentFit="cover" />
        <View className="ml-3 min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[14px] font-bold text-white">
            {currentSong.title}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-xs text-spotify-text-secondary">
            {currentSong.artist}
          </Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            togglePlay();
          }}
          className="p-2"
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={26} color={ONVIZA.purpleLight} />
        </Pressable>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            next();
          }}
          className="p-2"
        >
          <Ionicons name="play-skip-forward" size={22} color="#fff" />
        </Pressable>
      </Pressable>
    </View>
  );
}
