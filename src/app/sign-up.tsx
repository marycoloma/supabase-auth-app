import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    setNotice(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (!data.session) {
      // Email confirmation is on: the account exists, but nobody is signed in yet
      setNotice("Check your email to confirm your account.");
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <View style={styles.form}>
        <Text style={styles.heading}>Sign up</Text>
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
          autoComplete="new-password"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text>{notice}</Text>}
        <Button
          title="Create account"
          onPress={handleSignUp}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  error: { color: "crimson" },
});
