import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useDrawer } from "../../context/DrawerContext";
import { DRAWER_WIDTH, useLayoutMode } from "../../lib/layout";
import { DrawerContent } from "./DrawerContent";

type Props = {
  children: React.ReactNode;
};

export function DrawerLayout({ children }: Props) {
  const { isOpen, open, close, persistent } = useDrawer();
  const { isMobile, width } = useLayoutMode();
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (persistent) return;
    translateX.value = withTiming(isOpen ? 0 : -DRAWER_WIDTH, { duration: 250 });
    backdropOpacity.value = withTiming(isOpen ? 0.55 : 0, { duration: 250 });
  }, [isOpen, persistent, translateX, backdropOpacity]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: persistent ? 0 : translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const edgeSwipe = Gesture.Pan()
    .activeOffsetX(16)
    .failOffsetY([-12, 12])
    .onEnd((e) => {
      if (persistent || isOpen) return;
      if (e.x < 32 && e.translationX > 48) {
        runOnJS(open)();
      }
    });

  if (persistent) {
    return (
      <View className="flex-1 flex-row bg-spotify-base">
        <View style={{ width: DRAWER_WIDTH }}>
          <DrawerContent />
        </View>
        <View className="flex-1 border-l border-spotify-highlight">{children}</View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-spotify-base">
      {isMobile && (
        <GestureDetector gesture={edgeSwipe}>
          <View style={styles.edgeZone} />
        </GestureDetector>
      )}

      <View className="flex-1">{children}</View>

      {isOpen && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close menu" />
        </Animated.View>
      )}

      <Animated.View
        style={[styles.drawer, { width: Math.min(DRAWER_WIDTH, width * 0.85) }, drawerStyle]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <DrawerContent />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  edgeZone: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 30,
  },
  backdrop: {
    backgroundColor: "#000",
    zIndex: 40,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});
