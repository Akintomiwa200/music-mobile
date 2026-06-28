import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getPlaylist } from "../../constants/data";
import { SongRow } from "../../components/SongRow";
import { PlayButton } from "../../components/IconButton";
import { usePlayer } from "../../context/PlayerContext";

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlist = getPlaylist(id!);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  if (!playlist) {
    return (
      <View className="flex-1 items-center justify-center bg-spotify-base">
        <Text className="text-spotify-text-primary">Playlist not found</Text>
      </View>
    );
  }

  const isThisPlaying = currentSong && playlist.songs.some((s) => s.id === currentSong.id) && isPlaying;

  return (
    <View className="flex-1 bg-spotify-base">
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={playlist.gradient ?? ["#5038a0", "#121212"]}
          className="px-4 pb-6 pt-14"
        >
          <SafeAreaView edges={["top"]}>
            <Pressable onPress={() => router.back()} className="mb-4 self-start p-1">
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>
            <View className="items-center">
              <Image source={{ uri: playlist.image }} className="h-56 w-56 rounded-md shadow-lg" contentFit="cover" />
              <Text className="mt-6 text-center text-2xl font-bold text-spotify-text-primary">{playlist.title}</Text>
              <Text className="mt-2 text-center text-sm text-spotify-text-secondary">{playlist.description}</Text>
              <View className="mt-3 flex-row items-center">
                <Image
                  source={{ uri: "https://picsum.photos/seed/profile/50/50" }}
                  className="mr-2 h-6 w-6 rounded-full"
                />
                <Text className="text-sm text-spotify-text-secondary">
                  {playlist.owner} • {playlist.songCount} songs
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center gap-6">
            <Ionicons name="heart-outline" size={28} color="#B3B3B3" />
            <Ionicons name="arrow-down-circle-outline" size={28} color="#B3B3B3" />
            <Ionicons name="ellipsis-horizontal" size={28} color="#B3B3B3" />
          </View>
          <View className="flex-row items-center gap-4">
            <Ionicons name="shuffle" size={24} color="#B3B3B3" />
            <PlayButton
              playing={!!isThisPlaying}
              onPress={() => {
                if (isThisPlaying) togglePlay();
                else playQueue(playlist.songs, 0);
              }}
            />
          </View>
        </View>

        {playlist.songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} queue={playlist.songs} />
        ))}
        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
