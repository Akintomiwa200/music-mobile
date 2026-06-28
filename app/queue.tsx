import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SongRow } from "../components/SongRow";
import { ScreenHeader } from "../components/drawer/ScreenHeader";
import { usePlayer } from "../context/PlayerContext";

export default function QueueScreen() {
  const { queue, queueIndex, currentSong, shuffle, toggleShuffle, clearQueue } = usePlayer();

  const upcoming = queue.slice(queueIndex + 1);
  const history = queue.slice(0, queueIndex);

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScreenHeader title="Queue" left="back" onBack={() => router.back()} />

      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable onPress={toggleShuffle} className="flex-row items-center gap-2">
          <Ionicons name="shuffle" size={18} color={shuffle ? "#1DB954" : "#B3B3B3"} />
          <Text className={shuffle ? "text-spotify-green" : "text-spotify-text-secondary"}>
            Shuffle {shuffle ? "on" : "off"}
          </Text>
        </Pressable>
        {queue.length > 0 && (
          <Pressable onPress={clearQueue}>
            <Text className="text-sm text-spotify-text-secondary">Clear</Text>
          </Pressable>
        )}
      </View>

      {!currentSong ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="musical-notes-outline" size={64} color="#727272" />
          <Text className="mt-4 text-center text-lg font-bold text-spotify-text-primary">Your queue is empty</Text>
          <Text className="mt-2 text-center text-spotify-text-secondary">
            Start playing something and it will show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...upcoming]}
          keyExtractor={(item) => `up-${item.id}`}
          ListHeaderComponent={
            <>
              <Text className="px-4 pb-2 pt-2 text-xs font-bold uppercase tracking-wider text-spotify-text-secondary">
                Now playing
              </Text>
              <SongRow song={currentSong} showImage queue={queue} />
              {upcoming.length > 0 && (
                <Text className="px-4 pb-2 pt-4 text-xs font-bold uppercase tracking-wider text-spotify-text-secondary">
                  Next up
                </Text>
              )}
            </>
          }
          renderItem={({ item }) => <SongRow song={item} showImage queue={queue} />}
          ListFooterComponent={
            history.length > 0 ? (
              <View className="mt-4">
                <Text className="px-4 pb-2 text-xs font-bold uppercase tracking-wider text-spotify-text-secondary">
                  Previously played
                </Text>
                {history.map((song) => (
                  <SongRow key={`hist-${song.id}`} song={song} showImage queue={queue} />
                ))}
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}
