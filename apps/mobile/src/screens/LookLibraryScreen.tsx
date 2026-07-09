import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { ReferencePreview } from "../components/ReferencePreview";
import { Screen } from "../components/Screen";
import type { Look, RootStackParamList } from "../types";
import { difficultyLabels, occasionLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "LookLibrary">;

export function LookLibraryScreen({ navigation }: Props) {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLooks(await api.getLooks());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить образы");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLooks();
  }, [loadLooks]);

  return (
    <Screen error={error} loading={loading}>
      <Text style={styles.title}>Выбери образ</Text>
      <Text style={styles.subtitle}>Сначала урок, потом проверка твоей косметички.</Text>
      {looks.map((look) => (
        <Pressable
          accessibilityRole="button"
          key={look.id}
          onPress={() => navigation.navigate("LookDetail", { lookId: look.id })}
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
        >
          <ReferencePreview compact look={look} />
          <View style={styles.cardContent}>
            <Text style={styles.lookTitle}>{look.title}</Text>
            <Text style={styles.description}>{look.description}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{difficultyLabels[look.difficulty] ?? look.difficulty}</Text>
              <Text style={styles.meta}>{occasionLabels[look.occasion] ?? look.occasion}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#20201f",
    fontSize: 28,
    fontWeight: "800"
  },
  subtitle: {
    color: "#6f675f",
    fontSize: 15,
    lineHeight: 21
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#e5ded5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 12
  },
  pressed: {
    opacity: 0.84
  },
  cardContent: {
    flex: 1,
    gap: 8
  },
  lookTitle: {
    color: "#20201f",
    fontSize: 18,
    fontWeight: "800"
  },
  description: {
    color: "#4e4842",
    fontSize: 14,
    lineHeight: 20
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  meta: {
    backgroundColor: "#efe9e1",
    borderRadius: 8,
    color: "#4e4842",
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5
  }
});
