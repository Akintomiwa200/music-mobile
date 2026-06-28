import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
};

export function HeaderIconButton({ name, onPress, size = 24, color = "#fff" }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

export function HeaderIconRow({ children }: { children: React.ReactNode }) {
  return <View className="flex-row items-center gap-1">{children}</View>;
}
