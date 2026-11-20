import { signInSchema, type SignInFormData } from "@/lib/auth-schemas";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignInScreen() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(values: SignInFormData) {
    setServerError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message);
      }
    } catch {
      setServerError(
        "Unable to connect. Please check your internet connection and try again.",
      );
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <View style={styles.form}>
        {/* Email field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#777"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />

        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* Password field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#777"
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

        {serverError && <Text style={styles.error}>{serverError}</Text>}

        <Button
          title={isSubmitting ? "Signing in..." : "Sign In"}
          onPress={handleSubmit(handleSignIn)}
          disabled={isSubmitting}
        />

        {isSubmitting && <ActivityIndicator />}
      </View>

      <Link href="/sign-up" style={styles.link}>
        Need an account? Sign up
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 12,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 10,
  },
  error: {
    color: "crimson",
    fontSize: 13,
  },
  link: {
    color: "#1565c0",
  },
});
