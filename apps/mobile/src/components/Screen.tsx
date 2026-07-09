import type { ReactNode } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
};

export function Screen({ children, loading = false, error = null }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.muted}>Загрузка</Text>
          </View>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading ? children : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f4ef"
  },
  content: {
    padding: 16,
    gap: 14
  },
  center: {
    alignItems: "center",
    gap: 10,
    paddingTop: 60
  },
  muted: {
    color: "#726b63",
    fontSize: 14
  },
  error: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    borderRadius: 8,
    borderWidth: 1,
    color: "#991b1b",
    padding: 12
  }
});
