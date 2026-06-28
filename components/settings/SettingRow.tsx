import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../lib/utils";

type BaseProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  showChevron?: boolean;
  danger?: boolean;
  accentColor?: string;
};

export function SettingRow({
  icon,
  iconColor = "#B3B3B3",
  title,
  subtitle,
  value,
  showChevron = true,
  danger,
  onPress,
}: BaseProps & { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center px-4 py-3.5 active:bg-spotify-highlight/50"
    >
      {icon && (
        <View className="mr-4 h-9 w-9 items-center justify-center rounded-full bg-onviza-elevated">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text className={cn("text-base font-medium", danger ? "text-red-400" : "text-spotify-text-primary")}>
          {title}
        </Text>
        {subtitle && (
          <Text className="mt-0.5 text-sm text-spotify-text-secondary">{subtitle}</Text>
        )}
      </View>
      {value && <Text className="mr-2 text-sm text-spotify-text-secondary">{value}</Text>}
      {showChevron && onPress && <Ionicons name="chevron-forward" size={18} color="#727272" />}
    </Pressable>
  );
}

export function SettingToggle({
  icon,
  iconColor = "#B3B3B3",
  title,
  subtitle,
  value,
  onValueChange,
  accentColor = "#9333EA",
}: BaseProps & { value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      {icon && (
        <View className="mr-4 h-9 w-9 items-center justify-center rounded-full bg-onviza-elevated">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text className="text-base font-medium text-spotify-text-primary">{title}</Text>
        {subtitle && <Text className="mt-0.5 text-sm text-spotify-text-secondary">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#535353", true: accentColor }}
        thumbColor="#fff"
      />
    </View>
  );
}

export function SettingSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      {title && (
        <Text className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-spotify-text-secondary">
          {title}
        </Text>
      )}
      <View className="overflow-hidden rounded-2xl bg-onviza-card mx-4">{children}</View>
    </View>
  );
}

export function SettingsHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View className="flex-row items-center px-4 py-3">
      <Pressable onPress={onBack} className="mr-4 p-1">
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </Pressable>
      <Text className="text-2xl font-bold text-spotify-text-primary">{title}</Text>
    </View>
  );
}
