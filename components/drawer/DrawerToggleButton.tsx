import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDrawer } from "../../context/DrawerContext";
import { useLayoutMode } from "../../lib/layout";

type Props = {
  color?: string;
  size?: number;
};

export function DrawerToggleButton({ color = "#fff", size = 26 }: Props) {
  const { toggle, persistent } = useDrawer();
  const { isWide } = useLayoutMode();

  if (persistent || isWide) return null;

  return (
    <Pressable onPress={toggle} className="p-1 active:opacity-60" accessibilityLabel="Open menu">
      <Ionicons name="menu" size={size} color={color} />
    </Pressable>
  );
}
