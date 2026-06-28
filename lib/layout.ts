import { useWindowDimensions } from "react-native";

export const DRAWER_WIDTH = 280;
export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1024;

export type LayoutMode = "mobile" | "tablet" | "desktop";

export function getLayoutMode(width: number): LayoutMode {
  if (width >= DESKTOP_BREAKPOINT) return "desktop";
  if (width >= TABLET_BREAKPOINT) return "tablet";
  return "mobile";
}

export function useLayoutMode() {
  const { width, height } = useWindowDimensions();
  const mode = getLayoutMode(width);
  return {
    width,
    height,
    mode,
    isMobile: mode === "mobile",
    isTablet: mode === "tablet",
    isDesktop: mode === "desktop",
    isWide: mode !== "mobile",
    drawerPersistent: mode === "desktop",
    drawerOverlay: mode !== "desktop",
  };
}
