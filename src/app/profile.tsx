import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import SignOut from "../../components/SignOut";
import { useAuth } from '../../context/AuthProvider';

type ProfileData = {
  display_name: string;
  favourite_instrument: string | null;
};

export default function Profile() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function getProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, favourite_instrument")
        .eq("id", userId)
        .single();

      if (cancelled) return;
      if (error) setError(error.message);
      else setProfile(data);
    }

    getProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!profile) return <ActivityIndicator />;

  return (
    <View style={styles.card}>
      <Text style={styles.badge}>PRIVATE</Text>
      <Text style={styles.label}>Display name</Text>
      <Text style={styles.value}>{profile.display_name}</Text>
      <Text style={styles.label}>Favourite instrument</Text>
      <Text style={styles.value}>
        {profile.favourite_instrument ?? "None yet"}
      </Text>
      <SignOut />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "bold",
    color: "crimson",
  },
  label: { fontSize: 12, color: "#666", marginTop: 8 },
  value: { fontSize: 18 },
  error: { color: "crimson" },
});