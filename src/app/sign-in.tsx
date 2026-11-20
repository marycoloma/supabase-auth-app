import { colors, theme } from "@/constants/app-theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
    <ScrollView
      contentContainerStyle={theme.screen}
      keyboardShouldPersistTaps="handled"
    >
      <View style={theme.card}>
        <Text style={theme.title}>Welcome back</Text>
        <Text style={theme.subtitle}>
          Sign in to see your members-only resources
        </Text>

        {error && (
          <View style={theme.errorBox}>
            <Text style={theme.errorBoxText}>{error}</Text>
          </View>
        )}

        <Text style={theme.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[theme.input, errors.email && theme.inputError]}
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />
        {errors.email && (
          <Text style={theme.fieldError}>{errors.email.message}</Text>
        )}

        <Text style={theme.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[theme.input, errors.password && theme.inputError]}
              placeholder="Your password"
              placeholderTextColor={colors.muted}
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
          <Text style={theme.fieldError}>{errors.password.message}</Text>
        )}

        <Pressable
          style={({ pressed }) => [
            theme.button,
            (pressed || loading) && theme.buttonPressed,
          ]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={theme.buttonText}>Sign in</Text>
          )}
        </Pressable>

        <View style={theme.footer}>
          <Text style={theme.muted}>Need an account? </Text>
          <Link href="/sign-up" style={theme.link}>
            Sign up
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
