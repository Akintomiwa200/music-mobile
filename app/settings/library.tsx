import { ScrollView, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";
import { FilterChip } from "../../components/FilterChips";
import type { LibrarySettings } from "../../types/settings";

const FILTERS: LibrarySettings["defaultFilter"][] = ["Playlists", "Albums", "Artists", "Podcasts"];
const SORT_ORDERS: { id: LibrarySettings["sortOrder"]; label: string }[] = [
  { id: "recent", label: "Recently added" },
  { id: "alphabetical", label: "Alphabetical" },
  { id: "creator", label: "Creator" },
];

export default function LibrarySettingsScreen() {
  const { settings, updateLibrary } = useSettings();
  const { library } = settings;

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <SettingsHeader title="Library" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Default view">
          <View className="flex-row flex-wrap gap-2.5 p-4">
            {FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                active={library.defaultFilter === filter}
                onPress={() => updateLibrary({ defaultFilter: filter })}
                accentColor={settings.accentColor}
              />
            ))}
          </View>
        </SettingSection>

        <SettingSection title="Sort order">
          {SORT_ORDERS.map((sort, i) => (
            <View key={sort.id}>
              {i > 0 && <View className="h-px bg-onviza-border" />}
              <Pressable
                onPress={() => updateLibrary({ sortOrder: sort.id })}
                className="flex-row items-center px-4 py-4 active:bg-spotify-highlight/50"
              >
                <Text className="flex-1 text-base font-medium text-spotify-text-primary">{sort.label}</Text>
                {library.sortOrder === sort.id && (
                  <View className="h-5 w-5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                )}
              </Pressable>
            </View>
          ))}
        </SettingSection>

        <SettingSection title="Downloads">
          <SettingToggle
            icon="download-outline"
            title="Downloaded only"
            subtitle="Show only content saved on this device"
            value={library.showDownloadedOnly}
            onValueChange={(v) => updateLibrary({ showDownloadedOnly: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
