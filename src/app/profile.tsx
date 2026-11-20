import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import SignOut from "../../components/SignOut";
import { useAuth } from "../../context/AuthProvider";
import { supabase } from "../lib/supabase";

type Resource = Record<string, unknown>;

export default function ProfileScreen() {
  const { session } = useAuth();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const email = session?.user.email ?? "";

  const metadata = session?.user.user_metadata;

  const name =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    email ||
    "User";

  async function fetchResources() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from("resources").select("*");

      if (error) {
        throw error;
      }

      setResources(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load resources. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResources();
  }, []);

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "N/A";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User information */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {name}!</Text>

        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Sign out */}
      <View style={styles.signOutContainer}>
        <SignOut />
      </View>

      {/* Protected resources */}
      <View style={styles.section}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text>Loading resources...</Text>
          </View>
        ) : error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.error}>Error: {error}</Text>

            <Pressable style={styles.retryButton} onPress={fetchResources}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : resources.length === 0 ? (
          <Text style={styles.empty}>No resources found.</Text>
        ) : (
          resources.map((resource, index) => (
            <View
              key={String(resource.id ?? index)}
              style={styles.resourceCard}
            >
              {Object.entries(resource).map(([key, value]) => (
                <View key={key} style={styles.resourceRow}>
                  <Text style={styles.resourceLabel}>
                    {key.replace(/_/g, " ")}:
                  </Text>

                  <Text style={styles.resourceValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ))
        )}

        {!loading && !error && (
          <Pressable style={styles.refreshButton} onPress={fetchResources}>
            <Text style={styles.buttonText}>Refresh Resources</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  email: {
    fontSize: 15,
    color: "#666",
  },
  signOutContainer: {
    marginBottom: 24,
  },
  section: {
    gap: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 21,
  },
  loading: {
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  messageContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    gap: 12,
  },
  error: {
    color: "#c62828",
    fontSize: 14,
  },
  empty: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    color: "#666",
    textAlign: "center",
  },
  resourceCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resourceRow: {
    gap: 3,
  },
  resourceLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  resourceValue: {
    fontSize: 15,
    color: "#555",
  },
  retryButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
