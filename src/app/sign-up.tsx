import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
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
    <View style={styles.container}>
      <Text style={styles.heading}>Our team</Text>
      {membersLoading ? (
        <ActivityIndicator />
      ) : (
        members.map((member) => <Text key={member.id}>• {member.name}</Text>)
      )}

      <Text style={styles.heading}>Sign up</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

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
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.success}>{message}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Sign up" onPress={() => handleSubmit(onSubmit)()} />
      )}

      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  error: { color: "crimson" },
  success: { color: "green" },
  link: { color: "#1565c0" },
});
