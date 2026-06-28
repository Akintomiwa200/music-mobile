import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { searchAll } from "../constants/data";
import { SongRowCompact } from "../components/SongRow";
import { getItemRoute } from "../lib/utils";

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const query = q ?? "";
  const { songs, albums, playlists, artists } = searchAll(query);
  const hasResults = songs.length + albums.length + playlists.length + artists.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </Pressable>
        <View className="flex-1 flex-row items-center rounded-md bg-spotify-text-primary px-3 py-2.5">
          <Ionicons name="search" size={20} color="#121212" />
          <Text numberOfLines={1} className="ml-2 flex-1 text-base text-spotify-black">
            {query}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {!hasResults ? (
          <View className="items-center px-8 pt-16">
            <Ionicons name="search" size={64} color="#727272" />
            <Text className="mt-4 text-center text-xl font-bold text-spotify-text-primary">
              No results found for "{query}"
            </Text>
            <Text className="mt-2 text-center text-spotify-text-secondary">
              Please check the spelling or try a different search.
            </Text>
          </View>
        ) : (
          <>
            {songs.length > 0 && (
              <View className="px-4 pt-2">
                <Text className="mb-2 text-xl font-bold text-spotify-text-primary">Songs</Text>
                {songs.map((song) => (
                  <SongRowCompact key={song.id} song={song} />
                ))}
              </View>
            )}

            {artists.length > 0 && (
              <View className="px-4 pt-6">
                <Text className="mb-3 text-xl font-bold text-spotify-text-primary">Artists</Text>
                {artists.map((artist) => (
                  <Pressable
                    key={artist.id}
                    onPress={() => router.push(getItemRoute("artist", artist.id) as never)}
                    className="mb-4 flex-row items-center active:opacity-70"
                  >
                    <Image source={{ uri: artist.image }} className="h-16 w-16 rounded-full" contentFit="cover" />
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-semibold text-spotify-text-primary">{artist.name}</Text>
                      <Text className="text-sm text-spotify-text-secondary">Artist</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {albums.length > 0 && (
              <View className="px-4 pt-6">
                <Text className="mb-3 text-xl font-bold text-spotify-text-primary">Albums</Text>
                {albums.map((album) => (
                  <Pressable
                    key={album.id}
                    onPress={() => router.push(getItemRoute("album", album.id) as never)}
                    className="mb-4 flex-row items-center active:opacity-70"
                  >
                    <Image source={{ uri: album.image }} className="h-16 w-16 rounded" contentFit="cover" />
                    <View className="ml-4 flex-1">
                      <Text numberOfLines={1} className="text-base font-semibold text-spotify-text-primary">
                        {album.title}
                      </Text>
                      <Text className="text-sm text-spotify-text-secondary">
                        {album.year} • {album.artist}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {playlists.length > 0 && (
              <View className="px-4 pt-6">
                <Text className="mb-3 text-xl font-bold text-spotify-text-primary">Playlists</Text>
                {playlists.map((playlist) => (
                  <Pressable
                    key={playlist.id}
                    onPress={() => router.push(getItemRoute("playlist", playlist.id) as never)}
                    className="mb-4 flex-row items-center active:opacity-70"
                  >
                    <Image source={{ uri: playlist.image }} className="h-16 w-16 rounded" contentFit="cover" />
                    <View className="ml-4 flex-1">
                      <Text numberOfLines={1} className="text-base font-semibold text-spotify-text-primary">
                        {playlist.title}
                      </Text>
                      <Text className="text-sm text-spotify-text-secondary">
                        Playlist • {playlist.owner}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
