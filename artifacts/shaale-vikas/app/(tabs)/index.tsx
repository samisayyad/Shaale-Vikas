import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";
import { SCHOOL_NEEDS, ANALYTICS } from "@/data/mockData";
import SchoolNeedCard from "@/components/SchoolNeedCard";
import StatsCard from "@/components/StatsCard";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";

function formatAmount(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const featured = SCHOOL_NEEDS.find((n) => n.featured) ?? SCHOOL_NEEDS[0];
  const others = SCHOOL_NEEDS.filter((n) => !n.featured);
  const criticalCount = SCHOOL_NEEDS.filter((n) => n.urgency === "critical").length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {greeting()},{" "}
              <Text style={[styles.greetingName, { color: colors.foreground }]}>
                {user?.name?.split(" ")[0] ?? "Friend"}
              </Text>
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {criticalCount} campaigns need urgent help
            </Text>
          </View>
          <Pressable
            style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/notifications");
            }}
          >
            <MaterialIcons name="notifications" size={22} color={colors.foreground} />
            <View style={[styles.badge, { backgroundColor: "#DC2626" }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="account-balance-wallet"
            label="Total Raised"
            value={formatAmount(ANALYTICS.totalFunds)}
            color={colors.primary}
            delay={0}
          />
          <StatsCard
            icon="check-circle"
            label="Projects Done"
            value={ANALYTICS.projectsCompleted.toString()}
            color="#3B82F6"
            delay={100}
          />
          <StatsCard
            icon="people"
            label="Supporters"
            value={ANALYTICS.activeSupporters.toLocaleString()}
            color="#F59E0B"
            delay={200}
          />
        </View>

        {/* Featured Campaign */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.urgentDot, { backgroundColor: "#DC2626" }]} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Most Urgent
            </Text>
          </View>

          <Pressable
            onPress={() => router.push(`/donate/${featured.id}`)}
            style={[
              styles.featuredCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: 20,
              },
            ]}
          >
            {/* Urgency stripe */}
            <View style={[styles.urgencyStripe, { backgroundColor: "#DC2626" }]}>
              <MaterialIcons name="warning" size={14} color="#FFFFFF" />
              <Text style={styles.urgencyStripeText}>CRITICAL · {featured.daysLeft} DAYS LEFT</Text>
            </View>

            <View style={styles.featuredContent}>
              <View style={styles.featuredMeta}>
                <Text style={[styles.featuredSchool, { color: colors.mutedForeground }]}>
                  {featured.schoolName}
                </Text>
                <Text style={[styles.featuredLocation, { color: colors.mutedForeground }]}>
                  {featured.location}
                </Text>
              </View>

              <Text style={[styles.featuredTitle, { color: colors.foreground }]}>
                {featured.needTitle}
              </Text>
              <Text style={[styles.featuredDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {featured.description}
              </Text>

              <View style={styles.featuredProgress}>
                <AnimatedProgressBar
                  progress={featured.raisedAmount / featured.goalAmount}
                  height={10}
                  color="#DC2626"
                  delay={500}
                />
                <View style={styles.featuredAmounts}>
                  <Text style={[styles.featuredRaised, { color: colors.foreground }]}>
                    {formatAmount(featured.raisedAmount)}{" "}
                    <Text style={{ color: colors.mutedForeground, fontWeight: "400" }}>raised</Text>
                  </Text>
                  <Text style={[styles.featuredPercent, { color: "#DC2626" }]}>
                    {Math.round((featured.raisedAmount / featured.goalAmount) * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.featuredFooter}>
                <Text style={[styles.featuredStudents, { color: colors.mutedForeground }]}>
                  {featured.students} students impacted
                </Text>
                <View style={[styles.featuredDonateBtn, { backgroundColor: "#DC2626" }]}>
                  <Text style={styles.featuredDonateBtnText}>Donate Now</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Active Campaigns */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Active Campaigns
            </Text>
            <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
              {SCHOOL_NEEDS.length} schools
            </Text>
          </View>

          {others.map((need) => (
            <SchoolNeedCard key={need.id} need={need} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  greeting: { fontSize: 15 },
  greetingName: { fontSize: 15, fontWeight: "700" },
  headerSub: { fontSize: 13, marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  urgentDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "800", flex: 1 },
  sectionCount: { fontSize: 13 },
  featuredCard: {
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  urgencyStripe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  urgencyStripeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  featuredContent: { padding: 16 },
  featuredMeta: { marginBottom: 6 },
  featuredSchool: { fontSize: 13, fontWeight: "600" },
  featuredLocation: { fontSize: 12 },
  featuredTitle: { fontSize: 20, fontWeight: "800", marginBottom: 6, lineHeight: 26 },
  featuredDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  featuredProgress: { gap: 8, marginBottom: 16 },
  featuredAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featuredRaised: { fontSize: 16, fontWeight: "700" },
  featuredPercent: { fontSize: 16, fontWeight: "800" },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredStudents: { fontSize: 13 },
  featuredDonateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  featuredDonateBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});
