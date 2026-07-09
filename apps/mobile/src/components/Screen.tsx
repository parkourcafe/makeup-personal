import type { ReactNode } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radii } from "../theme";

type ScreenProps = {
  children?: ReactNode;
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
    backgroundColor: colors.background
  },
  content: {
    alignSelf: "center",
    gap: 16,
    maxWidth: 560,
    padding: 16,
    paddingBottom: 30,
    width: "100%"
  },
  center: {
    alignItems: "center",
    gap: 10,
    paddingTop: 60
  },
  muted: {
    color: colors.muted,
    fontSize: 14
  },
  error: {
    backgroundColor: colors.dangerBg,
    borderColor: "#e8b6ae",
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.dangerText,
    padding: 12
  }
});
