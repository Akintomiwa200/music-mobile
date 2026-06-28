import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { LibraryItem } from "../../types";
import { ONVIZA } from "../../lib/theme";

type Props = {
  item: LibraryItem;
  compact?: boolean;
  onPress: () => void;
};

const IMAGE_SIZE = 56;
const IMAGE_SIZE_COMPACT = 48;

export function LibraryRow({ item, compact, onPress }: Props) {
  const size = compact ? IMAGE_SIZE_COMPACT : IMAGE_SIZE;
  const isArtist = item.type === "artist";

  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 active:opacity-80" style={{ paddingVertical: compact ? 8 : 10 }}>
      <LibraryThumbnail item={item} size={size} isArtist={isArtist} />
      <View className="ml-3 min-w-0 flex-1">
        <Text numberOfLines={1} className="text-base font-bold text-white">
          {item.title}
        </Text>
        <View className="mt-1 flex-row items-center">
          {item.pinned && (
            <Ionicons name="pin" size={12} color={ONVIZA.purpleLight} style={{ marginRight: 4, transform: [{ rotate: "45deg" }] }} />
          )}
          <Text numberOfLines={1} className="flex-1 text-sm text-spotify-text-secondary">
            {item.subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function LibraryThumbnail({
  item,
  size,
  isArtist,
}: {
  item: LibraryItem;
  size: number;
  isArtist: boolean;
}) {
  const radius = isArtist ? size / 2 : 4;

  if (item.special === "liked-songs") {
    return (
      <LinearGradient
        colors={["#450a0a", "#312e81", "#9333EA"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ width: size, height: size, borderRadius: 4, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name="heart" size={size * 0.42} color="#fff" />
      </LinearGradient>
    );
  }

  if (item.special === "your-episodes") {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 4,
          backgroundColor: "#1a3d2e",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="radio" size={size * 0.4} color="#fff" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: item.image }}
      style={{ width: size, height: size, borderRadius: radius }}
      contentFit="cover"
    />
  );
}
