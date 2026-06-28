import { useState } from "react";
import { ScrollView, TextInput, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SearchCategoryCard } from "../../components/FilterChips";
import { searchCategories } from "../../constants/data";
import { APP_NAME, ONVIZA } from "../../lib/theme";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";

export default function SearchScreen() {
  const bottomPad = useTabScreenPadding();
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      router.push({ pathname: "/search-results", params: { q: query.trim() } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <View className="px-5 pb-4 pt-4">
        <Text className="text-[28px] font-extrabold text-white">{APP_NAME}</Text>
        <Text className="mt-1 text-sm text-spotify-text-secondary">Discover music</Text>
      </View>

      <View className="px-5 pb-4">
        <View
          className="flex-row items-center rounded-2xl px-4 py-3.5"
          style={{ backgroundColor: ONVIZA.card, borderWidth: 1, borderColor: ONVIZA.border }}
        >
          <Ionicons name="search" size={20} color={ONVIZA.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Artists, songs, or podcasts"
            placeholderTextColor={ONVIZA.textDim}
            returnKeyType="search"
            className="ml-3 flex-1 text-base text-white"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={ONVIZA.textDim} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}>
        <Text className="mb-4 text-sm font-bold uppercase tracking-wider text-spotify-text-secondary">Browse all</Text>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {searchCategories.map((cat) => (
            <SearchCategoryCard
              key={cat.id}
              title={cat.title}
              color={cat.color}
              onPress={() => router.push({ pathname: "/search-results", params: { q: cat.title } })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
