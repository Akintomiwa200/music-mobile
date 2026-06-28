import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Playlist } from "../types";
import { getItemRoute, type ContentType } from "../lib/utils";

type Props = {
  playlist: Playlist;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: 140, md: 160, lg: 180 };

function ArtworkShadow({ children, size }: { children: React.ReactNode; size: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {children}
    </View>
  );
}

export function PlaylistCard({ playlist, size = "md" }: Props) {
  const dim = sizes[size];
  return (
    <Pressable onPress={() => router.push(`/playlist/${playlist.id}`)} className="mr-4 active:opacity-85" style={{ width: dim }}>
      <ArtworkShadow size={dim}>
        <Image source={{ uri: playlist.image }} style={{ width: dim, height: dim }} className="rounded-md" contentFit="cover" />
      </ArtworkShadow>
      <Text numberOfLines={1} className="mt-3 text-sm font-bold text-spotify-text-primary">
        {playlist.title}
      </Text>
      <Text numberOfLines={2} className="mt-0.5 text-xs leading-4 text-spotify-text-secondary">
        {playlist.description}
      </Text>
    </Pressable>
  );
}

export function AlbumCard({ id, title, artist, image }: { id: string; title: string; artist: string; image: string }) {
  return (
    <Pressable onPress={() => router.push(`/album/${id}`)} className="mr-4 w-[148px] active:opacity-85">
      <ArtworkShadow size={148}>
        <Image source={{ uri: image }} className="h-[148px] w-[148px] rounded-md" contentFit="cover" />
      </ArtworkShadow>
      <Text numberOfLines={1} className="mt-3 text-sm font-bold text-spotify-text-primary">
        {title}
      </Text>
      <Text numberOfLines={1} className="mt-0.5 text-xs text-spotify-text-secondary">
        {new Date().getFullYear()} • {artist}
      </Text>
    </Pressable>
  );
}

export function ShortcutCard({
  id,
  title,
  image,
  type = "playlist",
}: {
  id: string;
  title: string;
  image: string;
  type?: ContentType;
}) {
  const isLiked = title.toLowerCase().includes("liked");

  if (isLiked) {
    return (
      <Pressable
        onPress={() => router.push(getItemRoute(type, id) as never)}
        className="mb-2 overflow-hidden rounded-md active:opacity-90"
        style={{ minWidth: "48%", maxWidth: "48%" }}
      >
        <LinearGradient colors={["#450a0a", "#5038a0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-row items-center">
          <View className="h-[62px] w-[62px] items-center justify-center bg-[#450a0a]">
            <Ionicons name="heart" size={28} color="#fff" />
          </View>
          <Text numberOfLines={2} className="flex-1 px-3 text-sm font-bold text-white">
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(getItemRoute(type, id) as never)}
      className="mb-2 flex-row items-center overflow-hidden rounded-md bg-white/10 active:opacity-90"
      style={{ minWidth: "48%", maxWidth: "48%", height: 62 }}
    >
      <Image source={{ uri: image }} className="h-[62px] w-[62px]" contentFit="cover" />
      <Text numberOfLines={2} className="flex-1 px-3 text-sm font-bold text-spotify-text-primary">
        {title}
      </Text>
    </Pressable>
  );
}

export function RecentCard({
  id,
  title,
  image,
  type = "playlist",
}: {
  id: string;
  title: string;
  image: string;
  type?: ContentType;
}) {
  return (
    <Pressable onPress={() => router.push(getItemRoute(type, id) as never)} className="mr-4 w-[132px] active:opacity-85">
      <ArtworkShadow size={132}>
        <Image source={{ uri: image }} className="h-[132px] w-[132px] rounded-md" contentFit="cover" />
      </ArtworkShadow>
      <Text numberOfLines={2} className="mt-2.5 text-sm font-semibold leading-5 text-spotify-text-primary">
        {title}
      </Text>
    </Pressable>
  );
}
