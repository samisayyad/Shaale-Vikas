import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { SchoolNeed } from "@/data/mockData";
import AnimatedProgressBar from "./AnimatedProgressBar";

interface Props {
  need: SchoolNeed;
  compact?: boolean;
}

const URGENCY_CONFIG = {
  critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
  high: { label: "High Priority", color: "#D97706", bg: "#FFFBEB" },
  medium: { label: "Medium", color: "#059669", bg: "#F0FDF4" },
  low: { label: "Low", color: "#6B7280", bg: "#F9FAFB" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Sanitation: "water",
  Technology: "laptop",
  Infrastructure: "office-building",
  Library: "bookshelf",
  Furniture: "chair-school",
};

function formatAmount(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function SchoolNeedCard({ need, compact = false }: Props) {
  const colors = useColors();
  const urgency = URGENCY_CONFIG[need.urgency];
  const progress = need.raisedAmount / need.goalAmount;
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/donate/${need.id}`);
  };

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          animStyle,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius ?? 16,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.secondary },
            ]}
          >
            <MaterialCommunityIcons
              name={(CATEGORY_ICONS[need.category] ?? "school") as any}
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {need.category}
            </Text>
          </View>
          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: urgency.bg },
            ]}
          >
            {need.urgency === "critical" && (
              <MaterialIcons name="warning" size={12} color={urgency.color} />
            )}
            <Text style={[styles.urgencyText, { color: urgency.color }]}>
              {urgency.label}
            </Text>
          </View>
        </View>

        {/* School */}
        <Text
          style={[styles.schoolName, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {need.schoolName}
        </Text>
        <Text
          style={[styles.needTitle, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {need.needTitle}
        </Text>

        {!compact && (
          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {need.description}
          </Text>
        )}

        {/* Progress */}
        <View style={styles.progressSection}>
          <AnimatedProgressBar
            progress={progress}
            height={6}
            color={need.urgency === "critical" ? "#DC2626" : colors.primary}
          />
          <View style={styles.amountRow}>
            <Text style={[styles.raised, { color: colors.foreground }]}>
              {formatAmount(need.raisedAmount)}{" "}
              <Text style={{ color: colors.mutedForeground, fontWeight: "400" }}>
                raised
              </Text>
            </Text>
            <Text style={[styles.goal, { color: colors.mutedForeground }]}>
              of {formatAmount(need.goalAmount)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <MaterialIcons name="people" size={14} color={colors.mutedForeground} />
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              {need.sponsors} supporters
            </Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialIcons name="schedule" size={14} color={need.daysLeft <= 7 ? "#DC2626" : colors.mutedForeground} />
            <Text
              style={[
                styles.footerText,
                { color: need.daysLeft <= 7 ? "#DC2626" : colors.mutedForeground },
              ]}
            >
              {need.daysLeft}d left
            </Text>
          </View>
          <View
            style={[styles.donateBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.donateBtnText, { color: colors.primaryForeground }]}>
              Support
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: "700",
  },
  schoolName: {
    fontSize: 12,
    marginBottom: 2,
  },
  needTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
    gap: 6,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  raised: {
    fontSize: 14,
    fontWeight: "700",
  },
  goal: {
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  donateBtn: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  donateBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
