import { signUpSchema, type SignUpFormData } from "@/lib/auth-schemas";
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

export default function SignUp() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSignUp(values: SignUpFormData) {
    setServerError(null);
    setNotice(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message);
      } else if (!data.session) {
        setNotice("Account created! Check your email to confirm your account.");
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
              autoComplete="new-password"
            />
          )}
        />

        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        {/* Confirm password field */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#777"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
            />
          )}
        />

        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}

        {serverError && <Text style={styles.error}>{serverError}</Text>}

        {notice && <Text style={styles.notice}>{notice}</Text>}

        <Button
          title={isSubmitting ? "Creating account..." : "Create Account"}
          onPress={handleSubmit(handleSignUp)}
          disabled={isSubmitting}
        />

        {isSubmitting && <ActivityIndicator />}
      </View>

      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
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
  notice: {
    color: "green",
    fontSize: 14,
  },
  link: {
    color: "#1565c0",
  },
});
