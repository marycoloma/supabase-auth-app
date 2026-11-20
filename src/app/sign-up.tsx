import { colors, theme } from "@/constants/app-theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
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

// Zod schema: rules for the sign-up form
const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

type Member = { id: number; name: string };

// Turn Supabase errors into messages the user can understand
function getErrorMessage(message: string) {
  if (message.includes("already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (message.includes("Password should")) {
    return "That password is too weak. Use at least 8 characters with a number and an uppercase letter.";
  }
  if (message.includes("fetch") || message.includes("Network")) {
    return "Network error. Check your internet connection and try again.";
  }
  return message;
}

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Public data from Supabase (anyone can read it because of the RLS policy)
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await supabase
        .from("Sample Table")
        .select("id, name");
      if (error) setError("Could not load data. " + error.message);
      else setMembers(data ?? []);
      setMembersLoading(false);
    }
    loadMembers();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpForm) {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { data: { full_name: values.name } }, // saved so the nav bar can show the name
      });

      if (error) setError(getErrorMessage(error.message));
      else if (!data.session)
        setMessage(
          "Account created! Check your email to confirm, then sign in.",
        );
      // If there is a session, the layout shows the protected screens automatically
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
        <Text style={theme.title}>Create an account</Text>
        <Text style={theme.subtitle}>
          Join to unlock members-only resources
        </Text>

        {/* Public data from Sample Table */}
        <View style={theme.infoBox}>
          <Text style={theme.infoTitle}>Meet our team</Text>
          {membersLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            members.map((member) => (
              <Text key={member.id} style={{ color: colors.text }}>
                🌿 {member.name}
              </Text>
            ))
          )}
        </View>

        {error && (
          <View style={theme.errorBox}>
            <Text style={theme.errorBoxText}>{error}</Text>
          </View>
        )}
        {message && (
          <View style={theme.successBox}>
            <Text style={theme.successBoxText}>{message}</Text>
          </View>
        )}

        <Text style={theme.label}>Full name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[theme.input, errors.name && theme.inputError]}
              placeholder="Jane Doe"
              placeholderTextColor={colors.muted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.name && (
          <Text style={theme.fieldError}>{errors.name.message}</Text>
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
              placeholder="At least 8 characters"
              placeholderTextColor={colors.muted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && (
          <Text style={theme.fieldError}>{errors.password.message}</Text>
        )}

        <Text style={theme.label}>Confirm password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[theme.input, errors.confirmPassword && theme.inputError]}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.muted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoCapitalize="none"
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={theme.fieldError}>{errors.confirmPassword.message}</Text>
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
            <Text style={theme.buttonText}>Sign up</Text>
          )}
        </Pressable>

        <View style={theme.footer}>
          <Text style={theme.muted}>Already have an account? </Text>
          <Link href="/sign-in" style={theme.link}>
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
