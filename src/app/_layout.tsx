import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "../../context/AuthProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const userEmail = session?.user.email ?? "User";

  const userName =
    session?.user.user_metadata?.full_name ||
    session?.user.user_metadata?.name ||
    userEmail;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />

      {/* Routes available to users who are NOT signed in */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />

        <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      </Stack.Protected>

      {/* Routes available ONLY to authenticated users */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen
          name="profile"
          options={{
            title: userName,
            headerBackVisible: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
