import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  amount: number;
  schoolName: string;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#0A7C5C", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6", "#10B981"];

function ConfettiDot({ color, delay }: { color: string; delay: number }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 10 }));
    x.value = withDelay(delay, withTiming(Math.cos(angle) * distance, { duration: 800 }));
    y.value = withDelay(delay, withSequence(
      withTiming(-100 - Math.random() * 80, { duration: 500 }),
      withTiming(Math.sin(angle) * distance + 100, { duration: 400 })
    ));

    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
    }, delay + 900);
    return () => clearTimeout(timeout);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${Math.random() * 360}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiDot,
        style,
        { backgroundColor: color, width: 8 + Math.random() * 6, height: 8 + Math.random() * 6 },
      ]}
    />
  );
}

export default function CelebrationOverlay({ visible, amount, schoolName, onClose }: Props) {
  const colors = useColors();
  const containerOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.7);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      containerOpacity.value = withTiming(1, { duration: 300 });
      cardScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 200 }));
      cardOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
      iconScale.value = withDelay(300, withSequence(
        withSpring(1.3, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      ));
    } else {
      containerOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible) return null;

  const confettiItems = Array.from({ length: 24 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: i * 30,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
      <View style={styles.confettiContainer}>
        {confettiItems.map((item, i) => (
          <ConfettiDot key={i} color={item.color} delay={item.delay} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.card,
          cardStyle,
          { backgroundColor: colors.card, borderRadius: 24 },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            iconStyle,
            { backgroundColor: colors.secondary },
          ]}
        >
          <MaterialIcons name="favorite" size={36} color={colors.primary} />
        </Animated.View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Thank You!
        </Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ₹{amount.toLocaleString("en-IN")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          pledged to support
        </Text>
        <Text style={[styles.school, { color: colors.foreground }]} numberOfLines={2}>
          {schoolName}
        </Text>
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          Your generosity will change lives. Every child deserves a chance to learn.
        </Text>

        <Pressable
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={onClose}
        >
          <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
            See Your Impact
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: 24,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  confettiDot: {
    position: "absolute",
    borderRadius: 4,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  school: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
  },
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
