import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from '../../context/AuthProvider';


export default function Home() {
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading instruments: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>

      <View style={styles.nav}>
        {session ? 
          <View/>
         : 
          <>
            <Link href="/sign-in" style={styles.link}>
              Sign in
            </Link>
            <Link href="/sign-up" style={styles.link}>
              Sign up
            </Link>
          </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent:"center", alignItems:"center"},
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  nav: { gap: 16, marginBottom: 24 },
  link: { fontSize: 16, backgroundColor: "blue", color:"white", padding:"5px", borderRadius:"4px"  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  item: { fontSize: 16, paddingVertical: 4 },
});
