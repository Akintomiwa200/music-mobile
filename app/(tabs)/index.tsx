import { Image } from "expo-image";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getGreeting } from "../../lib/utils";
import { FilterChips } from "../../components/FilterChips";
import { SectionHeader } from "../../components/FilterChips";
import { PlaylistCard, ShortcutCard, RecentCard, AlbumCard } from "../../components/Cards";
import { playlists, albums, homeShortcuts, recentlyPlayed } from "../../constants/data";
import { useSettings } from "../../context/SettingsContext";
import { MOOD_SEEDS } from "../../lib/config";
import { DrawerToggleButton } from "../../components/drawer/DrawerToggleButton";

export default function HomeScreen() {
  const { settings } = useSettings();
  const [filter, setFilter] = useState("All");
  const { homeSections, favoriteGenres, defaultMood, accentColor, avatarUri, displayName } = settings;
  const mood = defaultMood ? MOOD_SEEDS[defaultMood] : null;

  const genreLabel =
    favoriteGenres.length > 0
      ? `Because you like ${favoriteGenres.slice(0, 2).join(" & ")}`
      : "Made for you";

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
          <View className="flex-row items-center gap-2">
            <DrawerToggleButton />
            <Pressable
              onPress={() => router.push("/settings/profile")}
              className="flex-row items-center gap-3 active:opacity-80"
            >
              <Image source={{ uri: avatarUri }} className="h-8 w-8 rounded-full" contentFit="cover" />
              <Text className="text-2xl font-bold text-spotify-text-primary">{getGreeting(displayName)}</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4">
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <Pressable onPress={() => router.push("/settings/notifications")}>
              <Ionicons name="time-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.push("/settings")}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        <FilterChips filters={["All", "Music", "Podcasts"]} active={filter} onChange={setFilter} />

        {/* Mood match banner */}
        {homeSections.moodMatch && mood && (
          <Pressable
            onPress={() => router.push("/settings/personalization")}
            className="mx-4 mb-4 overflow-hidden rounded-xl active:opacity-90"
            style={{ backgroundColor: mood.color }}
          >
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-wider text-white/80">Your vibe today</Text>
                <Text className="mt-1 text-xl font-bold text-white">
                  {mood.emoji} {mood.label} mode
                </Text>
                <Text className="mt-1 text-sm text-white/80">Tap to change your default mood</Text>
              </View>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-black/20">
                <Ionicons name="play" size={28} color="#fff" />
              </View>
            </View>
          </Pressable>
        )}

        {/* Shortcuts grid */}
        {homeSections.shortcuts && (
          <View className="flex-row flex-wrap justify-between px-4">
            {homeShortcuts.map((item) => (
              <ShortcutCard key={item.id} id={item.id} title={item.title} image={item.image} type={item.type} />
            ))}
          </View>
        )}

        {/* Jump back in */}
        {homeSections.jumpBackIn && (
          <View className="mt-6">
            <SectionHeader title="Jump back in" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {recentlyPlayed.map((item) => (
                <RecentCard key={item.id} id={item.id} title={item.title} image={item.image} type={item.type} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Made for you */}
        {homeSections.madeForYou && (
          <View className="mt-6">
            <SectionHeader title="Made for you" subtitle={genreLabel} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {playlists.slice(0, 5).map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recently played albums */}
        {homeSections.recentlyPlayed && (
          <View className="mt-6">
            <SectionHeader title="Recently played" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {albums.slice(0, 6).map((a) => (
                <AlbumCard key={a.id} id={a.id} title={a.title} artist={a.artist} image={a.image} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Your top mixes */}
        {homeSections.topMixes && (
          <View className="mt-6">
            <SectionHeader
              title="Your top mixes"
              subtitle={favoriteGenres.length ? `Based on ${favoriteGenres[0]}` : undefined}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {playlists.slice(2, 7).map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Personalization CTA */}
        <Pressable
          onPress={() => router.push("/settings/personalization")}
          className="mx-4 mt-8 flex-row items-center rounded-xl border border-spotify-highlight p-4 active:opacity-80"
        >
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: accentColor + "33" }}>
            <Ionicons name="sparkles" size={24} color={accentColor} />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-spotify-text-primary">Fine-tune your taste</Text>
            <Text className="text-sm text-spotify-text-secondary">
              {favoriteGenres.length} genres selected · Customize home layout
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#727272" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
