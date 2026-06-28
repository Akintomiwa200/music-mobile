import { Pressable, ScrollView, Text, View, type ViewStyle } from "react-native";
import { cn } from "../lib/utils";
import { ONVIZA } from "../lib/theme";

export function filterChipStyle(active: boolean, accentColor: string = ONVIZA.purple): ViewStyle {
  return active
    ? {
        backgroundColor: accentColor,
        shadowColor: accentColor,
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
      }
    : { backgroundColor: ONVIZA.card, borderWidth: 1, borderColor: ONVIZA.border };
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  accentColor?: string;
};

/** Single pill — same look as homepage All / Pop / … chips */
export function FilterChip({ label, active, onPress, accentColor = ONVIZA.purple }: ChipProps) {
  return (
    <Pressable onPress={onPress} className="rounded-full px-5 py-2.5" style={filterChipStyle(active, accentColor)}>
      <Text className={cn("text-sm font-bold", active ? "text-white" : "text-spotify-text-secondary")}>{label}</Text>
    </Pressable>
  );
}

type Props = {
  filters: readonly string[];
  active: string;
  onChange: (filter: string) => void;
  accentColor?: string;
  /** Override horizontal padding (default px-5) */
  contentClassName?: string;
};

export function FilterChips({
  filters,
  active,
  onChange,
  accentColor = ONVIZA.purple,
  contentClassName = "px-5 py-3",
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={contentClassName}
      contentContainerStyle={{ gap: 10, paddingRight: 20 }}
    >
      {filters.map((filter) => (
        <FilterChip
          key={filter}
          label={filter}
          active={active === filter}
          onPress={() => onChange(filter)}
          accentColor={accentColor}
        />
      ))}
    </ScrollView>
  );
}

export function SectionHeader({
  title,
  subtitle,
  onSeeAll,
}: {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between px-5">
      <View className="min-w-0 flex-1">
        <Text className="text-xl font-extrabold tracking-tight text-white">{title}</Text>
        {subtitle && <Text className="mt-1 text-sm text-spotify-text-secondary">{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={8} className="ml-3 pb-0.5">
          <Text className="text-sm font-semibold text-spotify-text-secondary">See All</Text>
        </Pressable>
      )}
    </View>
  );
}

export function SearchCategoryCard({ title, color, onPress }: { title: string; color: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl active:opacity-90"
      style={{ backgroundColor: color, height: 108, width: "48%" }}
    >
      <Text className="p-4 text-[17px] font-extrabold leading-5 text-white">{title}</Text>
      <View className="absolute -bottom-3 -right-3 h-[72px] w-[72px] rotate-[25deg] rounded-xl bg-black/25" />
    </Pressable>
  );
}
