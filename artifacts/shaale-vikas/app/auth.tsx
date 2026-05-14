import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";
import { User } from "@/hooks/useAppStore";

const ROLES = [
  { id: "alumni", label: "Alumni", icon: "school", description: "Support your alma mater" },
  { id: "donor", label: "Donor", icon: "favorite", description: "Help any school in need" },
  { id: "headmaster", label: "Headmaster", icon: "manage-accounts", description: "Post school needs" },
] as const;

const AVATAR_COLORS = ["#0A7C5C", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#DC2626"];

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUser } = useAppStore();

  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"alumni" | "headmaster" | "donor">("alumni");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const initials =
      mode === "register"
        ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : email.substring(0, 2).toUpperCase();

    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const user: User = {
      id: Date.now().toString(),
      name: mode === "register" ? name.trim() : email.split("@")[0],
      email: email.trim(),
      role,
      totalDonated: 0,
      schoolsSupported: 0,
      donationCount: 0,
      initials,
      avatarColor,
    };

    await setUser(user);
    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 24,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoMark, { backgroundColor: colors.secondary }]}>
            <MaterialIcons name="school" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>Shaale-Vikas</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Building Schools, Building Futures
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.muted }]}>
          {(["register", "login"] as const).map((m) => (
            <Pressable
              key={m}
              style={[
                styles.toggleBtn,
                mode === m && { backgroundColor: colors.card },
              ]}
              onPress={() => setMode(m)}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: mode === m ? colors.foreground : colors.mutedForeground,
                    fontWeight: mode === m ? "700" : "500",
                  },
                ]}
              >
                {m === "register" ? "Create Account" : "Sign In"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Role selector (register only) */}
        {mode === "register" && (
          <View>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              I am a...
            </Text>
            <View style={styles.rolesRow}>
              {ROLES.map((r) => (
                <Pressable
                  key={r.id}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: role === r.id ? colors.secondary : colors.card,
                      borderColor: role === r.id ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setRole(r.id)}
                >
                  <MaterialIcons
                    name={r.icon as any}
                    size={24}
                    color={role === r.id ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.roleLabel,
                      { color: role === r.id ? colors.primary : colors.foreground },
                    ]}
                  >
                    {r.label}
                  </Text>
                  <Text
                    style={[styles.roleDesc, { color: colors.mutedForeground }]}
                    numberOfLines={2}
                  >
                    {r.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Fields */}
        {mode === "register" && (
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <MaterialIcons name="person" size={20} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Full Name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <MaterialIcons name="email" size={20} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Email Address"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <MaterialIcons name="lock" size={20} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <Pressable onPress={() => setShowPass(!showPass)}>
            <MaterialIcons
              name={showPass ? "visibility-off" : "visibility"}
              size={20}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
            <MaterialIcons name="error-outline" size={16} color="#DC2626" />
            <Text style={[styles.errorText, { color: "#DC2626" }]}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={[
            styles.submitBtn,
            { backgroundColor: loading ? colors.secondary : colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={[styles.submitText, { color: colors.primary }]}>
              Please wait...
            </Text>
          ) : (
            <>
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                {mode === "register" ? "Create Account" : "Sign In"}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.primaryForeground} />
            </>
          )}
        </Pressable>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          By continuing, you support transparent community-driven school development.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24 },
  header: { alignItems: "center", marginBottom: 28 },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  tagline: { fontSize: 14 },
  toggle: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleText: { fontSize: 14 },
  sectionLabel: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  rolesRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  roleCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    gap: 4,
  },
  roleLabel: { fontSize: 13, fontWeight: "700" },
  roleDesc: { fontSize: 10, textAlign: "center", lineHeight: 14 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 10,
  },
  input: { flex: 1, height: 52, fontSize: 15 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, flex: 1 },
  submitBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  submitText: { fontSize: 17, fontWeight: "700" },
  footer: { fontSize: 12, textAlign: "center", lineHeight: 17 },
});
