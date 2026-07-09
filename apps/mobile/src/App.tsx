import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Screen } from "./components/Screen";
import { AuthScreen } from "./screens/AuthScreen";
import { LookDetailScreen } from "./screens/LookDetailScreen";
import { LookLibraryScreen } from "./screens/LookLibraryScreen";
import { MakeupBagScreen } from "./screens/MakeupBagScreen";
import { ReadinessReportScreen } from "./screens/ReadinessReportScreen";
import { TutorialPlayerScreen } from "./screens/TutorialPlayerScreen";
import { colors } from "./theme";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppNavigator() {
  const auth = useAuth();

  if (auth.loading) {
    return <Screen loading />;
  }

  if (!auth.user) {
    return (
      <>
        <StatusBar style="light" />
        <AuthScreen />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.ink,
          headerTitleStyle: { color: colors.ink, fontSize: 18, fontWeight: "800" }
        }}
      >
        <Stack.Screen component={LookLibraryScreen} name="LookLibrary" options={{ title: "Образы" }} />
        <Stack.Screen component={LookDetailScreen} name="LookDetail" options={{ title: "Образ" }} />
        <Stack.Screen component={MakeupBagScreen} name="MakeupBag" options={{ title: "Косметичка" }} />
        <Stack.Screen component={ReadinessReportScreen} name="ReadinessReport" options={{ title: "Готовность" }} />
        <Stack.Screen component={TutorialPlayerScreen} name="TutorialPlayer" options={{ title: "Урок" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
