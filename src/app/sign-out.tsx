import { colors, theme } from "@/constants/app-theme";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthProvider";

export default function SignOutScreen() {
  const { session } = useAuth();
  const router = useRouter();
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
      // On success, the session becomes null and the layout shows the public screens
    } catch {
      setError("Network error. Check your internet connection and try again.");
    }

    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={theme.screen}>
      <View style={theme.card}>
        <Text style={theme.title}>Sign out</Text>
        <Text style={theme.subtitle}>Are you sure you want to leave?</Text>

        <View style={theme.infoBox}>
          <Text style={theme.muted}>Signed in as</Text>
          <Text style={theme.infoTitle}>{displayName}</Text>
          {session?.user.email && (
            <Text style={theme.muted}>{session.user.email}</Text>
          )}
        </View>

        {error && (
          <View style={theme.errorBox}>
            <Text style={theme.errorBoxText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            theme.button,
            (pressed || loading) && theme.buttonPressed,
          ]}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={theme.buttonText}>Sign out</Text>
          )}
        </Pressable>

        <Pressable
          style={theme.buttonOutline}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={theme.buttonOutlineText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
