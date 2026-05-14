import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { NOTIFICATIONS, Notification } from "@/data/mockData";

const TYPE_CONFIG = {
  milestone: { icon: "flag", color: "#F59E0B", bg: "#FFFBEB" },
  new_campaign: { icon: "campaign", color: "#3B82F6", bg: "#EFF6FF" },
  thank_you: { icon: "favorite", color: "#EC4899", bg: "#FDF2F8" },
  update: { icon: "update", color: "#8B5CF6", bg: "#F5F3FF" },
  celebration: { icon: "emoji-events", color: "#0A7C5C", bg: "#F0FDF4" },
};

function NotifCard({ notif }: { notif: Notification }) {
  const colors = useColors();
  const config = TYPE_CONFIG[notif.type];

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: notif.read ? colors.card : colors.secondary,
          borderColor: notif.read ? colors.border : colors.primary + "44",
          borderRadius: colors.radius ?? 16,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
        <MaterialIcons name={config.icon as any} size={22} color={config.color} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {notif.title}
          </Text>
          {!notif.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {notif.message}
        </Text>
        <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
          {notif.timestamp}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifs] = useState<Notification[]>(NOTIFICATIONS);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text style={[styles.unreadCount, { color: colors.mutedForeground }]}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={notifs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotifCard notif={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="notifications-off" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No notifications yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  unreadCount: { fontSize: 12 },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: "700", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  message: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
  timestamp: { fontSize: 11 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 16 },
});
