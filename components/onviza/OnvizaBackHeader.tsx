import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ONVIZA } from "../../lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
};

export function OnvizaBackHeader({ title, subtitle, onBack, right, large }: Props) {
  const handleBack = onBack ?? (() => router.back());

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="min-w-0 flex-1 flex-row items-center">
        <Pressable
          onPress={handleBack}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-onviza-card active:opacity-80"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className={`font-extrabold text-white ${large ? "text-[26px]" : "text-xl"}`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} className="mt-0.5 text-sm text-spotify-text-secondary">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {right && <View className="ml-2 flex-row items-center gap-3">{right}</View>}
    </View>
  );
}

export function OnvizaIconButton({
  icon,
  onPress,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-onviza-card active:opacity-80"
    >
      <Ionicons name={icon} size={22} color={active ? ONVIZA.purpleLight : "#fff"} />
    </Pressable>
  );
}
