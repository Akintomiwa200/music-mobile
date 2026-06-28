import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { cn } from "../lib/utils";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  className?: string;
  active?: boolean;
};

export function IconButton({ name, size = 24, color = "#fff", onPress, className, active }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={cn("items-center justify-center rounded-full p-2 active:opacity-60", className)}
    >
      <Ionicons name={name} size={size} color={active ? "#1DB954" : color} />
    </Pressable>
  );
}

export function PlayButton({ size = 56, onPress, playing }: { size?: number; onPress?: () => void; playing?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-full bg-spotify-green active:scale-95"
      style={{ width: size, height: size }}
    >
      <Ionicons name={playing ? "pause" : "play"} size={size * 0.45} color="#000" style={{ marginLeft: playing ? 0 : 3 }} />
    </Pressable>
  );
}

export function ExplicitBadge() {
  return (
    <View className="ml-1.5 rounded-sm bg-spotify-text-secondary px-1">
      <Text className="text-[10px] font-bold text-spotify-black">E</Text>
    </View>
  );
}
