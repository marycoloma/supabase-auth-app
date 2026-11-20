import { Link, Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthProvider";

export default function Home() {
  const { session } = useAuth();

  // Signed-in users should go to their protected area
  if (session) {
    return <Redirect href="/profile" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Text style={styles.subtitle}>
        Please sign in or create an account to continue.
      </Text>

      <View style={styles.nav}>
        <Link href="/sign-in" style={styles.link}>
          Sign In
        </Link>

        <Link href="/sign-up" style={styles.link}>
          Sign Up
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  nav: {
    gap: 16,
    width: "100%",
  },
  link: {
    fontSize: 16,
    backgroundColor: "#2563eb",
    color: "white",
    padding: 14,
    borderRadius: 8,
    textAlign: "center",
    overflow: "hidden",
  },
});
