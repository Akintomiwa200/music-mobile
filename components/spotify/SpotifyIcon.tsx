import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  size?: number;
  color?: string;
};

export function SpotifyIcon({ size = 22, color = "#fff" }: Props) {
  return <MaterialCommunityIcons name="spotify" size={size} color={color} />;
}
