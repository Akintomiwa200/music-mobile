import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "../lib/utils";

type Props = {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
};

export function FilterChips({ filters, active, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3" contentContainerStyle={{ gap: 8 }}>
      {filters.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => onChange(filter)}
          className={cn(
            "rounded-full px-4 py-2",
            active === filter ? "bg-spotify-text-primary" : "bg-spotify-highlight"
          )}
        >
          <Text
            className={cn(
              "text-sm font-semibold",
              active === filter ? "text-spotify-black" : "text-spotify-text-primary"
            )}
          >
            {filter}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-3 px-4">
      <Text className="text-xl font-bold text-spotify-text-primary">{title}</Text>
      {subtitle && <Text className="mt-0.5 text-sm text-spotify-text-secondary">{subtitle}</Text>}
    </View>
  );
}

export function SearchCategoryCard({ title, color, onPress }: { title: string; color: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-lg active:opacity-90"
      style={{ backgroundColor: color, height: 100, width: "48%" }}
    >
      <Text className="p-3 text-lg font-bold text-white">{title}</Text>
      <View className="absolute -bottom-2 -right-2 h-16 w-16 rotate-[25deg] rounded-md bg-black/20" />
    </Pressable>
  );
}
