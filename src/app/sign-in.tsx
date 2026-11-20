import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

// Zod schema: rules for the sign-in form
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

// Turn Supabase errors into messages the user can understand
function getErrorMessage(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (message.includes("fetch") || message.includes("Network")) {
    return "Network error. Check your internet connection and try again.";
  }
  return message;
}

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInForm) {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) setError(getErrorMessage(error.message));
      // On success, the layout sees the new session and shows the protected screens
    } catch {
      setError("Network error. Check your internet connection and try again.");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign in</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Sign in" onPress={() => handleSubmit(onSubmit)()} />
      )}

      <Link href="/sign-up" style={styles.link}>
        Need an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  error: { color: "crimson" },
  link: { color: "#1565c0" },
});
