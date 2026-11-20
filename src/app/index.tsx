import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
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

  // Logged out: show the Sign in / Sign up buttons
  if (!session) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Home Page" }} />
        <Text style={styles.heading}>Home Page</Text>
        <Button title="Sign in" onPress={() => router.push("/sign-in")} />
        <Button title="Sign up" onPress={() => router.push("/sign-up")} />
      </View>
    );
  }

  // Logged in: show the user's name in the nav bar and the protected list
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Hi, ${displayName}`,
          headerRight: () => (
            <Button title="Sign out" onPress={() => router.push("/sign-out")} />
          ),
        }}
      />

      <Text style={styles.heading}>Members-only resources</Text>

      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && <Text>{item.description}</Text>}
          </View>
        )}
        ListEmptyComponent={
          loading ? undefined : <Text>No resources found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  title: { fontWeight: "bold" },
  error: { color: "crimson" },
});
