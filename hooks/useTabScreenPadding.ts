import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "../context/PlayerContext";
import { getScreenBottomPadding } from "../lib/layout";

/** Bottom padding so scroll content clears the floating tab bar + mini player */
export function useTabScreenPadding(extra = 0) {
  const insets = useSafeAreaInsets();
  const { currentSong } = usePlayer();
  return getScreenBottomPadding(insets.bottom, Boolean(currentSong)) + extra;
}
