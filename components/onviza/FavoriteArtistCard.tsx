import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { Artist } from "../../types";
import { ONVIZA } from "../../lib/theme";

type Props = {
  artist: Artist;
  size?: number;
};

export function FavoriteArtistCard({ artist, size = 96 }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/artist/${artist.id}`)}
      className="mr-4 items-center active:opacity-85"
      style={{ width: size + 8 }}
    >
      <View
        style={{
          padding: 2,
          borderRadius: size / 2 + 2,
          borderWidth: 1.5,
          borderColor: ONVIZA.border,
        }}
      >
        <Image
          source={{ uri: artist.image }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      </View>
      <Text numberOfLines={2} className="mt-2.5 text-center text-[13px] font-semibold leading-4 text-white">
        {artist.name}
      </Text>
    </Pressable>
  );
}
