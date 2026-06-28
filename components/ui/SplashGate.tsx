import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { APP_NAME, ONVIZA } from "../../lib/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_DURATION_MS = 5000;

type Props = {
  ready: boolean;
  children: React.ReactNode;
};

export function SplashGate({ ready, children }: Props) {
  const [showOverlay, setShowOverlay] = useState(true);
  const fade = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.4, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [logoOpacity, logoScale, glow]);

  useEffect(() => {
    if (!ready) return;
    const progressAnim = Animated.timing(progress, {
      toValue: 1,
      duration: SPLASH_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    progressAnim.start();
    const timer = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }).start(({ finished }) => {
        if (finished) {
          setShowOverlay(false);
          SplashScreen.hideAsync().catch(() => {});
        }
      });
    }, SPLASH_DURATION_MS);
    return () => {
      clearTimeout(timer);
      progressAnim.stop();
    };
  }, [ready, fade, progress]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] });

  return (
    <>
      {children}
      {showOverlay && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: fade }]} pointerEvents="auto">
          <LinearGradient colors={["#050508", ONVIZA.bg, "#14141C"]} style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.glowOrb, { opacity: glowOpacity }]} />
          <View style={styles.content}>
            <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
              <View style={styles.logoRing}>
                <View style={styles.logoCore}>
                  <Text style={styles.logoIcon}>♪</Text>
                </View>
              </View>
              <Text style={styles.brand}>{APP_NAME}</Text>
              <Text style={styles.tagline}>Feel the rhythm</Text>
            </Animated.View>
            <View style={styles.footer}>
              <View style={styles.track}>
                <Animated.View style={[styles.fill, { width: barWidth }]} />
              </View>
              <Text style={styles.loading}>Curating your experience…</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { zIndex: 9999, elevation: 9999, backgroundColor: ONVIZA.bg },
  glowOrb: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ONVIZA.purple,
    opacity: 0.4,
    transform: [{ scale: 1.8 }],
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoRing: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: ONVIZA.purpleLight,
    alignSelf: "center",
  },
  logoCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ONVIZA.purple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ONVIZA.purple,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  logoIcon: { fontSize: 40, color: "#fff", fontWeight: "700" },
  brand: { marginTop: 24, fontSize: 36, fontWeight: "800", color: "#fff", letterSpacing: -1 },
  tagline: { marginTop: 8, fontSize: 15, color: ONVIZA.textMuted },
  footer: { position: "absolute", bottom: 56, left: 40, right: 40, alignItems: "center" },
  track: { width: "100%", height: 3, borderRadius: 999, backgroundColor: ONVIZA.border, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999, backgroundColor: ONVIZA.purpleLight },
  loading: { marginTop: 12, fontSize: 12, color: ONVIZA.textDim },
});
