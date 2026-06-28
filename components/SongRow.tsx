import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Song } from "../types";
import { formatDuration } from "../lib/utils";
import { usePlayer } from "../context/PlayerContext";
import { ExplicitBadge } from "./IconButton";

type Props = {
  song: Song;
  index?: number;
  showImage?: boolean;
  showAlbum?: boolean;
  onPress?: () => void;
};

export function SongRow({ song, index, showImage = true, showAlbum = false, onPress, queue: customQueue }: Props & { queue?: Song[] }) {
  const { currentSong, isPlaying, playSong, queue } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    playSong(song, customQueue ?? (queue.length > 0 ? queue : [song]));
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3 active:bg-white/5"
    >
      {index !== undefined && (
        <View className="mr-4 w-6 items-center">
          {isActive && isPlaying ? (
            <Ionicons name="volume-medium" size={16} color="#A855F7" />
          ) : (
            <Text className={`text-sm ${isActive ? "text-onviza-purple-light" : "text-spotify-text-secondary"}`}>
              {index + 1}
            </Text>
          )}
        </View>
      )}
      {showImage && (
        <Image source={{ uri: song.image }} className="mr-3 h-12 w-12 rounded" contentFit="cover" />
      )}
      <View className="min-w-0 flex-1">
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            className={`text-base font-medium ${isActive ? "text-onviza-purple-light" : "text-spotify-text-primary"}`}
          >
            {song.title}
          </Text>
          {song.explicit && <ExplicitBadge />}
        </View>
        <Text numberOfLines={1} className="mt-0.5 text-sm text-spotify-text-secondary">
          {showAlbum ? song.album : song.artist}
        </Text>
      </View>
      <Pressable className="p-2">
        <Ionicons name="ellipsis-vertical" size={18} color="#B3B3B3" />
      </Pressable>
    </Pressable>
  );
}

export function SongRowCompact({ song }: { song: Song }) {
  const { playSong } = usePlayer();
  return (
    <Pressable
      onPress={() => playSong(song)}
      className="flex-row items-center py-3 active:opacity-70"
    >
      <Image source={{ uri: song.image }} className="mr-3 h-12 w-12 rounded" contentFit="cover" />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-base text-spotify-text-primary">
          {song.title}
        </Text>
        <Text numberOfLines={1} className="text-sm text-spotify-text-secondary">
          {song.artist} • {formatDuration(song.duration)}
        </Text>
      </View>
    </Pressable>
  );
}
