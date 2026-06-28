import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Song } from "../../types";
import { usePlayer } from "../../context/PlayerContext";
import { ONVIZA } from "../../lib/theme";
import { router } from "expo-router";

type Props = {
  song: Song;
  queue?: Song[];
  isLast?: boolean;
};

export function TrendingRow({ song, queue, isLast }: Props) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const active = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, queue ?? [song]);
    router.push("/player");
  };

  return (
    <Pressable
      onPress={handlePlay}
      className="flex-row items-center py-3 active:opacity-80"
      style={!isLast ? { borderBottomWidth: 1, borderBottomColor: ONVIZA.border } : undefined}
    >
      <Image source={{ uri: song.image }} className="h-12 w-12 rounded-lg" contentFit="cover" />
      <View className="ml-3 min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-[15px] font-semibold text-white"
          style={active ? { color: ONVIZA.purpleLight } : undefined}
        >
          {song.title}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-sm text-spotify-text-secondary">
          {song.artist}
        </Text>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          handlePlay();
        }}
        hitSlop={8}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: ONVIZA.purple,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={active && isPlaying ? "pause" : "play"}
          size={16}
          color="#fff"
          style={{ marginLeft: active && isPlaying ? 0 : 2 }}
        />
      </Pressable>
    </Pressable>
  );
}
