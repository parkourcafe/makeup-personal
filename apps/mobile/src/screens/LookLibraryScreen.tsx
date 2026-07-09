import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { ReferencePreview } from "../components/ReferencePreview";
import { Screen } from "../components/Screen";
import type { Look, RootStackParamList } from "../types";
import { difficultyLabels, occasionLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "LookLibrary">;

export function LookLibraryScreen({ navigation }: Props) {
  const auth = useAuth();
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
      <View style={styles.topBar}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Образы</Text>
          <Text style={styles.subtitle}>{auth.user?.display_name}, собери макияж из своей косметички.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => void auth.logout()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Выйти</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => looks[0] ? navigation.navigate("MakeupBag", { lookId: looks[0].id }) : undefined}
        style={styles.bagCard}
      >
        <Text style={styles.bagTitle}>Косметичка</Text>
        <Text style={styles.bagText}>Добавь продукты один раз, затем проверяй готовность к любому образу.</Text>
      </Pressable>
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
  topBar: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  titleBlock: {
    flex: 1,
    gap: 4
  },
  title: {
    color: "#231f20",
    fontSize: 28,
    fontWeight: "800"
  },
  subtitle: {
    color: "#6f675f",
    fontSize: 15,
    lineHeight: 21
  },
  logoutButton: {
    borderColor: "#d4c7ba",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  logoutText: {
    color: "#4f4740",
    fontSize: 12,
    fontWeight: "800"
  },
  bagCard: {
    backgroundColor: "#231f20",
    borderRadius: 8,
    gap: 6,
    padding: 14
  },
  bagTitle: {
    color: "#fffaf4",
    fontSize: 17,
    fontWeight: "900"
  },
  bagText: {
    color: "#e7d9cb",
    fontSize: 14,
    lineHeight: 20
  },
  card: {
    backgroundColor: "#fffaf4",
    borderColor: "#e2d5c8",
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
