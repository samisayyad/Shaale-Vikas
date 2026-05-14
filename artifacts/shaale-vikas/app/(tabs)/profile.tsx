import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";

const ROLE_LABELS = {
  alumni: "Alumni",
  headmaster: "Headmaster",
  donor: "Donor",
  admin: "Admin",
};

const ROLE_COLORS = {
  alumni: "#3B82F6",
  headmaster: "#0A7C5C",
  donor: "#EC4899",
  admin: "#8B5CF6",
};

function formatAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function SettingRow({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon as any}
        size={20}
        color={destructive ? "#DC2626" : colors.mutedForeground}
      />
      <Text
        style={[
          styles.settingLabel,
          { color: destructive ? "#DC2626" : colors.foreground },
        ]}
      >
        {label}
      </Text>
      {!destructive && (
        <MaterialIcons name="chevron-right" size={20} color={colors.border} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, donations, logout } = useAppStore();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace("/auth");
        },
      },
    ]);
  };

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role] ?? colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
          },
        ]}
      >
        {/* Profile Hero */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
            <Text style={styles.avatarText}>{user.initials}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {user.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
            {user.email}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + "18", borderColor: roleColor + "44" }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>
              {ROLE_LABELS[user.role]}
            </Text>
          </View>
        </View>

        {/* Impact Stats */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Your Impact
        </Text>
        <View style={styles.impactRow}>
          <View style={[styles.impactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.impactValue, { color: colors.primary }]}>
              {formatAmount(user.totalDonated)}
            </Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>
              Total Donated
            </Text>
          </View>
          <View style={[styles.impactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.impactValue, { color: "#3B82F6" }]}>
              {user.schoolsSupported}
            </Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>
              Schools Helped
            </Text>
          </View>
          <View style={[styles.impactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.impactValue, { color: "#F59E0B" }]}>
              {user.donationCount}
            </Text>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>
              Donations
            </Text>
          </View>
        </View>

        {/* Donation History */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Donation History
        </Text>
        {donations.length === 0 ? (
          <View
            style={[
              styles.emptyHistory,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <MaterialIcons name="favorite-border" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No donations yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.mutedForeground }]}>
              Your first contribution will change a child's life
            </Text>
            <Pressable
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={[styles.browseBtnText, { color: colors.primaryForeground }]}>
                Browse Campaigns
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {donations.map((d, i) => (
              <View
                key={d.id}
                style={[
                  styles.historyRow,
                  i < donations.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
              >
                <View style={[styles.historyIcon, { backgroundColor: colors.secondary }]}>
                  <MaterialIcons name="favorite" size={16} color={colors.primary} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={[styles.historySchool, { color: colors.foreground }]} numberOfLines={1}>
                    {d.schoolName}
                  </Text>
                  <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>
                    {d.date}
                  </Text>
                </View>
                <Text style={[styles.historyAmount, { color: colors.primary }]}>
                  {formatAmount(d.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="notifications" label="Notifications" onPress={() => router.push("/notifications")} />
          <SettingRow icon="help" label="Help & Support" onPress={() => {}} />
          <SettingRow icon="info" label="About Shaale-Vikas" onPress={() => {}} />
          <SettingRow icon="logout" label="Sign Out" onPress={handleLogout} destructive />
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Shaale-Vikas v1.0 · Building Futures Together
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  heroCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  userName: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 12 },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: { fontSize: 13, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  impactRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  impactCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  impactValue: { fontSize: 20, fontWeight: "900", marginBottom: 4 },
  impactLabel: { fontSize: 11, textAlign: "center" },
  emptyHistory: {
    alignItems: "center",
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  emptyText: { fontSize: 16, fontWeight: "600" },
  emptySubtext: { fontSize: 13, textAlign: "center" },
  browseBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: { fontSize: 14, fontWeight: "700" },
  historyCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  historyInfo: { flex: 1 },
  historySchool: { fontSize: 14, fontWeight: "600" },
  historyDate: { fontSize: 12 },
  historyAmount: { fontSize: 15, fontWeight: "700" },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLabel: { flex: 1, fontSize: 15 },
  version: { fontSize: 12, textAlign: "center", marginBottom: 20 },
});
