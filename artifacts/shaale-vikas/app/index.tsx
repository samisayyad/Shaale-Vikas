import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export default function EntryScreen() {
  const colors = useColors();

  useEffect(() => {
    async function bootstrap() {
      try {
        const [onboarding, user] = await Promise.all([
          AsyncStorage.getItem("onboarding"),
          AsyncStorage.getItem("user"),
        ]);
        if (!onboarding) {
          router.replace("/onboarding");
        } else if (!user) {
          router.replace("/auth");
        } else {
          router.replace("/(tabs)");
        }
      } catch (_) {
        router.replace("/onboarding");
      }
    }
    bootstrap();
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
