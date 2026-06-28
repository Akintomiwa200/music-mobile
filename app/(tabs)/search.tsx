import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SearchCategoryCard } from "../../components/FilterChips";
import { searchCategories } from "../../constants/data";
import { ScreenHeader } from "../../components/drawer/ScreenHeader";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      router.push({ pathname: "/search-results", params: { q: query.trim() } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScreenHeader title="Search" left="menu" />
      <View className="px-4 pb-2">
        <View className="flex-row items-center rounded-md bg-spotify-text-primary px-3 py-3">
          <Ionicons name="search" size={22} color="#121212" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="What do you want to listen to?"
            placeholderTextColor="#727272"
            returnKeyType="search"
            className="ml-3 flex-1 text-base text-spotify-black"
          />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={20} color="#727272" onPress={() => setQuery("")} />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
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
