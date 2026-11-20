import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthProvider";

export default function SignOutScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show the name saved at sign-up, or the email if there is no name
  const displayName =
    session?.user.user_metadata?.full_name ?? session?.user.email;

  async function handleSignOut() {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) setError("Could not sign out. Please try again.");
      // On success, the session becomes null and the layout sends the user to Sign in
    } catch {
      setError("Network error. Check your internet connection and try again.");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Signed in as</Text>
      <Text>{displayName}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Sign out" onPress={handleSignOut} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  error: { color: "crimson" },
});
