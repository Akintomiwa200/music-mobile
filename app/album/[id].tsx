import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAlbum } from "../../constants/data";
import { SongRow } from "../../components/SongRow";
import { PlayButton } from "../../components/IconButton";
import { usePlayer } from "../../context/PlayerContext";

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const album = getAlbum(id!);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  if (!album) {
    return (
      <View className="flex-1 items-center justify-center bg-spotify-base">
        <Text className="text-spotify-text-primary">Album not found</Text>
      </View>
    );
  }

  const isThisPlaying = currentSong && album.songs.some((s) => s.id === currentSong.id) && isPlaying;

  return (
    <View className="flex-1 bg-spotify-base">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#333", "#121212"]} className="px-4 pb-6 pt-14">
          <SafeAreaView edges={["top"]}>
            <Pressable onPress={() => router.back()} className="mb-4 self-start p-1">
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>
            <View className="items-center">
              <Image source={{ uri: album.image }} className="h-56 w-56 rounded-md" contentFit="cover" />
              <Text className="mt-6 text-center text-2xl font-bold text-spotify-text-primary">{album.title}</Text>
              <Text className="mt-2 text-center text-sm text-spotify-text-secondary">
                {album.year} • {album.artist} • {album.songs.length} songs
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center gap-6">
            <Ionicons name="heart-outline" size={28} color="#B3B3B3" />
            <Ionicons name="ellipsis-horizontal" size={28} color="#B3B3B3" />
          </View>
          <View className="flex-row items-center gap-4">
            <Ionicons name="shuffle" size={24} color="#B3B3B3" />
            <PlayButton
              playing={!!isThisPlaying}
              onPress={() => {
                if (isThisPlaying) togglePlay();
                else playQueue(album.songs, 0);
              }}
            />
          </View>
        </View>

        {album.songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} showAlbum={false} queue={album.songs} />
        ))}
        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
