import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../../context/AuthProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();

  // Hide the native splash once we know if the user is logged in
  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  // Loading screen while the session is being restored
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home Page" }} />

      {/* Only when logged OUT */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign up" }} />
      </Stack.Protected>

      {/* Only when logged IN */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="sign-out" options={{ title: "Sign out" }} />
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
