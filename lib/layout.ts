import { useWindowDimensions } from "react-native";

export const DRAWER_WIDTH = 280;
const WIDE_BREAKPOINT = 1024;

/** Shared layout metrics for floating tab bar + mini player */
export const TAB_BAR = {
  height: 60,
  horizontalInset: 20,
  bottomGap: 8,
  borderRadius: 28,
} as const;

export function useLayoutMode() {
  const { width, height } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const isMobile = !isWide;
  const drawerPersistent = isWide;

  return { width, height, isWide, isMobile, drawerPersistent };
}

export function getTabBarBottomInset(safeBottom: number) {
  return safeBottom + TAB_BAR.bottomGap + TAB_BAR.height;
}

export function getMiniPlayerBottom(safeBottom: number, hasMiniPlayer: boolean) {
  const tabTop = getTabBarBottomInset(safeBottom);
  return hasMiniPlayer ? tabTop + 8 + 64 : tabTop;
}

export function getScreenBottomPadding(safeBottom: number, hasMiniPlayer = false) {
  return getMiniPlayerBottom(safeBottom, hasMiniPlayer) + 16;
}
