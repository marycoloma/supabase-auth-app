import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSignIn() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <View style={styles.form}>
        <Text style={styles.heading}>Sign in</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Sign in" onPress={handleSignIn} disabled={loading} />
      </View>
      <Link href="/sign-up" style={styles.link}>Need an account? Sign up</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  error: { color: "crimson" },
  link: { color:"#1565c0" }
});
