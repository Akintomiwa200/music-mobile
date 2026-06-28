import { View } from "react-native";

type Props = {
  size?: number;
  color?: string;
};

/** Abstract music mark — not Spotify trademark */
export function AppMark({ size = 64, color = "#9333EA" }: Props) {
  const barW = size * 0.14;
  const gap = size * 0.12;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap,
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      {[0.45, 0.75, 1].map((h, i) => (
        <View
          key={i}
          style={{
            width: barW,
            height: size * h * 0.38,
            borderRadius: barW / 2,
            backgroundColor: "#0A0A0F",
          }}
        />
      ))}
    </View>
  );
}

export function SpotifyWordmark({ size = 22 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <AppMark size={size * 1.4} />
    </View>
  );
}
