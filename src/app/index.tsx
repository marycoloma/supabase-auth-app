import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [publicData, setPublicData] = useState<string>("Loading...");
  const [protectedData, setProtectedData] = useState<string>("Loading...");

  useEffect(() => {
    supabase
      .from("Sample Table")
      .select("*")
      .then(({ data, error }) => {
        setPublicData(
          error ? `Error: ${error.message}` : JSON.stringify(data, null, 2),
        );
      });

    supabase
      .from("resources")
      .select("*")
      .then(({ data, error }) => {
        setProtectedData(
          error ? `Error: ${error.message}` : JSON.stringify(data, null, 2),
        );
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Sample Table (public — should show 4 names)
      </Text>
      <Text style={styles.code}>{publicData}</Text>

      <Text style={styles.heading}>
        resources (protected — should be [] when logged out)
      </Text>
      <Text style={styles.code}>{protectedData}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  heading: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  code: { fontFamily: "monospace", fontSize: 12 },
});
