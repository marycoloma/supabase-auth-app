import { colors, theme } from "@/constants/app-theme";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthProvider";

type Resource = { id: number; title: string; description: string | null };

export default function HomeScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Name saved at sign-up, or the email if there is no name
  const displayName =
    session?.user.user_metadata?.full_name ?? session?.user.email;

  // Load the protected data only when the user is logged in
  useEffect(() => {
    if (!session) {
      setResources([]);
      return;
    }

    async function loadResources() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description")
        .order("id");
      if (error) setError("Could not load resources. " + error.message);
      else setResources(data ?? []);
      setLoading(false);
    }
    loadResources();
  }, [session]);

  // Logged out: welcome card with Sign in / Sign up
  if (!session) {
    return (
      <View style={theme.screen}>
        <Stack.Screen options={{ title: "Study Hub" }} />
        <View style={theme.card}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={[theme.title, styles.center]}>Study Hub</Text>
          <Text style={[theme.subtitle, styles.center]}>
            Sign in to access members-only study resources.
          </Text>

          <Pressable
            style={({ pressed }) => [
              theme.button,
              pressed && theme.buttonPressed,
            ]}
            onPress={() => router.push("/sign-in")}
          >
            <Text style={theme.buttonText}>Sign in</Text>
          </Pressable>

          <Pressable
            style={theme.buttonOutline}
            onPress={() => router.push("/sign-up")}
          >
            <Text style={theme.buttonOutlineText}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Logged in: name in the nav bar + protected list
  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          title: `Hi, ${displayName}`,
          headerRight: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => router.push("/sign-out")}
            >
              <Text style={styles.headerButtonText}>Sign out</Text>
            </Pressable>
          ),
        }}
      />

      <Text style={theme.title}>Members-only resources</Text>
      <Text style={theme.subtitle}>
        Only signed-in users can see this list.
      </Text>

      {loading && <ActivityIndicator color={colors.primary} />}
      {error && (
        <View style={theme.errorBox}>
          <Text style={theme.errorBoxText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            {item.description && (
              <Text style={theme.muted}>{item.description}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          loading ? undefined : (
            <Text style={theme.muted}>No resources found.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  center: { textAlign: "center" },
  logo: { fontSize: 48, textAlign: "center" },
  resourceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: colors.accent,
    gap: 4,
    boxShadow: "0 2px 8px rgba(27, 94, 32, 0.08)",
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  headerButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  headerButtonText: { color: colors.primary, fontWeight: "bold" },
});
