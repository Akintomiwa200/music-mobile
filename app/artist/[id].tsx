import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getArtist, albums, songs } from "../../constants/data";
import { SongRow } from "../../components/SongRow";
import { PlayButton } from "../../components/IconButton";
import { AlbumCard } from "../../components/Cards";
import { usePlayer } from "../../context/PlayerContext";

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artist = getArtist(id!);
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();

  if (!artist) {
    return (
      <View className="flex-1 items-center justify-center bg-spotify-base">
        <Text className="text-spotify-text-primary">Artist not found</Text>
      </View>
    );
  }

  const artistSongs = songs.filter((s) => s.artistId === artist.id);
  const artistAlbums = albums.filter((a) => a.artistId === artist.id);
  const isThisPlaying = currentSong && artistSongs.some((s) => s.id === currentSong.id) && isPlaying;

  return (
    <View className="flex-1 bg-spotify-base">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#555", "#121212"]} className="px-4 pb-6 pt-14">
          <SafeAreaView edges={["top"]}>
            <Pressable onPress={() => router.back()} className="mb-4 self-start p-1">
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>
            <View className="items-center">
              <Image source={{ uri: artist.image }} className="h-56 w-56 rounded-full" contentFit="cover" />
              <View className="mt-4 flex-row items-center">
                {artist.verified && <Ionicons name="checkmark-circle" size={20} color="#3D91F4" />}
                <Text className="ml-1 text-center text-3xl font-bold text-spotify-text-primary">{artist.name}</Text>
              </View>
              <Text className="mt-2 text-sm text-spotify-text-secondary">
                {artist.monthlyListeners} monthly listeners
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View className="flex-row items-center gap-4 px-4 py-4">
          <Pressable className="rounded-full border border-spotify-text-secondary px-4 py-2">
            <Text className="font-semibold text-spotify-text-primary">Follow</Text>
          </Pressable>
          <Ionicons name="ellipsis-horizontal" size={24} color="#B3B3B3" />
          <View className="flex-1" />
          <Ionicons name="shuffle" size={24} color="#B3B3B3" />
          <PlayButton
            playing={!!isThisPlaying}
            onPress={() => {
              if (isThisPlaying) togglePlay();
              else playQueue(artistSongs, 0);
            }}
          />
        </View>

        <Text className="mb-2 px-4 text-lg font-bold text-spotify-text-primary">Popular</Text>
        {artistSongs.slice(0, 5).map((song, i) => (
          <SongRow key={song.id} song={song} index={i} queue={artistSongs} />
        ))}

        <Text className="mb-2 mt-6 px-4 text-lg font-bold text-spotify-text-primary">Discography</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {artistAlbums.map((a) => (
            <AlbumCard key={a.id} id={a.id} title={a.title} artist={a.artist} image={a.image} />
          ))}
        </ScrollView>
        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
