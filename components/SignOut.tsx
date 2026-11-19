import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SignOut() {
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  }

  return (
    <View style={styles.wrapper}>
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.text}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  button: {
    backgroundColor: "#d32f2f",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
  text: { color: "white", fontWeight: "bold" },
  error: { color: "crimson" },
});