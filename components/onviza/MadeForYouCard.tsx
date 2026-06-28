import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { Song } from "../../types";
import { usePlayer } from "../../context/PlayerContext";
import { ONVIZA } from "../../lib/theme";

type Props = {
  song: Song;
  queue?: Song[];
  size?: number;
};

export function MadeForYouCard({ song, queue, size = 140 }: Props) {
  const { playSong } = usePlayer();

  return (
    <Pressable
      onPress={() => {
        playSong(song, queue ?? [song]);
        router.push("/player");
      }}
      className="mr-4 active:opacity-85"
      style={{ width: size }}
    >
      <View
        style={{
          shadowColor: ONVIZA.purple,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Image
          source={{ uri: song.image }}
          style={{ width: size, height: size, borderRadius: 16 }}
          contentFit="cover"
        />
      </View>
      <Text numberOfLines={1} className="mt-2.5 text-[15px] font-bold text-white">
        {song.title}
      </Text>
      <Text numberOfLines={1} className="mt-0.5 text-sm text-spotify-text-secondary">
        {song.artist}
      </Text>
    </Pressable>
  );
}
