import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { APP_NAME } from "../../lib/theme";

export function OnvizaHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
      <Text className="text-[28px] font-extrabold tracking-tight text-white">{APP_NAME}</Text>
      <Pressable
        onPress={() => router.push("/search")}
        className="h-11 w-11 items-center justify-center rounded-full bg-onviza-card active:opacity-80"
      >
        <Ionicons name="search" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
