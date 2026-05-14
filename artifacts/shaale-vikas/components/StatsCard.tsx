import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface Props {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  delay?: number;
  flex?: number;
}

export default function StatsCard({
  icon,
  label,
  value,
  subValue,
  color,
  delay = 0,
  flex = 1,
}: Props) {
  const colors = useColors();
  const cardColor = color ?? colors.primary;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const animStyle = useAnimatedProps(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        animStyle,
        {
          flex,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius ?? 16,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: cardColor + "18" }]}>
        <MaterialIcons name={icon as any} size={20} color={cardColor} />
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]} numberOfLines={2}>
        {label}
      </Text>
      {subValue && (
        <Text style={[styles.subValue, { color: cardColor }]}>{subValue}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderWidth: 1,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
  },
  subValue: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
});
