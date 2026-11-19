import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from '../../context/AuthProvider';


type Instrument = {
  id: number;
  name: string;
};

export default function Home() {
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function getInstruments() {
  //     const { data, error } = await supabase.from("instruments").select();

  //     if (error) {
  //       setError(error.message);
  //       return;
  //     }

  //     setInstruments(data ?? []);
  //   }
  //   getInstruments();
  // }, []);

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
        {session ? (
          <Link href="/profile" style={styles.link}>
            View your profile
          </Link>
        ) : (
          <>
            <Link href="/sign-in" style={styles.link}>
              Sign in
            </Link>
            <Link href="/sign-up" style={styles.link}>
              Sign up
            </Link>
          </>
        )}
      </View>
{/* 
      <Text style={styles.heading}>Instruments (public)</Text>
      <FlatList
        data={instruments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  nav: { flexDirection: "row", gap: 16, marginBottom: 24 },
  link: { fontSize: 16, color: "#1565c0", textDecorationLine: "underline" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  item: { fontSize: 16, paddingVertical: 4 },
});
