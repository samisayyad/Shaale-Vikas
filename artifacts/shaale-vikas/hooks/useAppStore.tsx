import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "alumni" | "headmaster" | "donor" | "admin";
  school?: string;
  totalDonated: number;
  schoolsSupported: number;
  donationCount: number;
  initials: string;
  avatarColor: string;
}

export interface Donation {
  id: string;
  schoolName: string;
  needTitle: string;
  amount: number;
  date: string;
  schoolId: string;
}

interface AppState {
  user: User | null;
  donations: Donation[];
  likedPosts: string[];
  onboardingComplete: boolean;
  setUser: (user: User | null) => void;
  addDonation: (donation: Donation) => void;
  toggleLike: (postId: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

const AppContext = createContext<AppState>({
  user: null,
  donations: [],
  likedPosts: [],
  onboardingComplete: false,
  setUser: () => {},
  addDonation: () => {},
  toggleLike: () => {},
  completeOnboarding: () => {},
  logout: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [u, d, l, o] = await Promise.all([
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("donations"),
          AsyncStorage.getItem("likedPosts"),
          AsyncStorage.getItem("onboarding"),
        ]);
        if (u) setUserState(JSON.parse(u));
        if (d) setDonations(JSON.parse(d));
        if (l) setLikedPosts(JSON.parse(l));
        if (o) setOnboardingComplete(true);
      } catch (_) {}
    }
    load();
  }, []);

  const setUser = async (u: User | null) => {
    setUserState(u);
    if (u) await AsyncStorage.setItem("user", JSON.stringify(u));
    else await AsyncStorage.removeItem("user");
  };

  const addDonation = async (donation: Donation) => {
    const updated = [donation, ...donations];
    setDonations(updated);
    await AsyncStorage.setItem("donations", JSON.stringify(updated));

    if (user) {
      const updatedUser: User = {
        ...user,
        totalDonated: user.totalDonated + donation.amount,
        donationCount: user.donationCount + 1,
        schoolsSupported: updated.filter(
          (d, i, arr) => arr.findIndex((x) => x.schoolId === d.schoolId) === i
        ).length,
      };
      await setUser(updatedUser);
    }
  };

  const toggleLike = async (postId: string) => {
    const updated = likedPosts.includes(postId)
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    setLikedPosts(updated);
    await AsyncStorage.setItem("likedPosts", JSON.stringify(updated));
  };

  const completeOnboarding = async () => {
    setOnboardingComplete(true);
    await AsyncStorage.setItem("onboarding", "done");
  };

  const logout = async () => {
    setUserState(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        donations,
        likedPosts,
        onboardingComplete,
        setUser,
        addDonation,
        toggleLike,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppContext);
}
