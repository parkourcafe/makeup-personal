import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LookDetailScreen } from "./screens/LookDetailScreen";
import { LookLibraryScreen } from "./screens/LookLibraryScreen";
import { MakeupBagScreen } from "./screens/MakeupBagScreen";
import { ReadinessReportScreen } from "./screens/ReadinessReportScreen";
import { TutorialPlayerScreen } from "./screens/TutorialPlayerScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: "#f7f4ef" },
            headerStyle: { backgroundColor: "#f7f4ef" },
            headerTitleStyle: { color: "#20201f", fontSize: 18, fontWeight: "700" }
          }}
        >
          <Stack.Screen component={LookLibraryScreen} name="LookLibrary" options={{ title: "Образы" }} />
          <Stack.Screen component={LookDetailScreen} name="LookDetail" options={{ title: "Образ" }} />
          <Stack.Screen component={MakeupBagScreen} name="MakeupBag" options={{ title: "Косметичка" }} />
          <Stack.Screen component={ReadinessReportScreen} name="ReadinessReport" options={{ title: "Готовность" }} />
          <Stack.Screen component={TutorialPlayerScreen} name="TutorialPlayer" options={{ title: "Урок" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
