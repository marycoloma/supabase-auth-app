import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { AuthProvider, useAuth } from '../../context/AuthProvider';

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Page" }} />

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign up" }} />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
      </Stack.Protected>
    </Stack>
  );
}


SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <RootNavigator/>
    </AuthProvider>
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <AnimatedSplashOverlay />
    //   <AppTabs />
    // </ThemeProvider>
  );
}
