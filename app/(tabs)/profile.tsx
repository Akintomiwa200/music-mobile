import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";
import { useSpotify } from "../../context/SpotifyContext";
import { LIKED_SONGS_ID } from "../../lib/spotify-constants";
import { ONVIZA } from "../../lib/theme";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";

export default function ProfileScreen() {
  const bottomPad = useTabScreenPadding();
  const { settings } = useSettings();
  const { isAuthenticated, user } = useSpotify();

  const displayName = isAuthenticated && user?.display_name ? user.display_name : settings.displayName;
  const avatarUri = isAuthenticated && user?.images?.[0]?.url ? user.images[0].url : settings.avatarUri;

  const links = [
    { icon: "person-outline" as const, label: "Edit profile", href: "/settings/profile" },
    { icon: "color-palette-outline" as const, label: "Personalization", href: "/settings/personalization" },
    { icon: "settings-outline" as const, label: "Settings", href: "/settings" },
    { icon: "heart-outline" as const, label: "Liked songs", href: `/playlist/${LIKED_SONGS_ID}` },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }}>
        <View style={styles.header}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.subtitle}>{isAuthenticated ? "Spotify connected" : "Onviza member"}</Text>
        </View>

        <View style={styles.card}>
          {links.map((link, i) => (
            <Pressable
              key={link.label}
              onPress={() => router.push(link.href as never)}
              style={[styles.row, i > 0 && styles.rowBorder]}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={link.icon} size={20} color={ONVIZA.purpleLight} />
              </View>
              <Text style={styles.rowLabel}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={ONVIZA.textDim} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ONVIZA.bg },
  header: { alignItems: "center", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
  avatarRing: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: ONVIZA.purple,
  },
  avatar: { width: 112, height: 112, borderRadius: 56 },
  name: { marginTop: 16, fontSize: 24, fontWeight: "800", color: "#fff" },
  subtitle: { marginTop: 4, fontSize: 14, color: "#9CA3AF" },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: ONVIZA.bgCard,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: ONVIZA.border },
  iconWrap: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ONVIZA.bgElevated,
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: "#fff" },
});
