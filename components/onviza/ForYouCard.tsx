import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { getItemRoute, type ContentType } from "../../lib/utils";

type Props = {
  id: string;
  title: string;
  image: string;
  type?: ContentType;
};

export function ForYouCard({ id, title, image, type = "playlist" }: Props) {
  return (
    <Pressable
      onPress={() => router.push(getItemRoute(type, id) as never)}
      className="mr-4 active:opacity-85"
      style={{ width: 140 }}
    >
      <View
        style={{
          shadowColor: "#9333EA",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Image source={{ uri: image }} className="h-[140px] w-[140px] rounded-2xl" contentFit="cover" />
      </View>
      <Text numberOfLines={1} className="mt-3 text-[15px] font-bold text-white">
        {title}
      </Text>
    </Pressable>
  );
}
