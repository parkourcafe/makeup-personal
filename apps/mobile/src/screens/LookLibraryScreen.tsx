import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { ReferencePreview } from "../components/ReferencePreview";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";
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

  const firstLook = looks[0] ?? null;

  return (
    <Screen error={error} loading={loading}>
      <View style={styles.topBar}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>Сегодня</Text>
          <Text style={styles.title}>Привет, {auth.user?.display_name}</Text>
          <Text style={styles.subtitle}>Выбери образ и проверь, что уже можно повторить из твоей косметички.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => void auth.logout()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Выйти</Text>
        </Pressable>
      </View>

      {firstLook ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("MakeupBag", { lookId: firstLook.id })}
          style={styles.bagCard}
        >
          <View style={styles.bagAccent} />
          <Text style={styles.bagTitle}>Косметичка</Text>
          <Text style={styles.bagText}>Продукты сохраняются в аккаунте и участвуют в подборе для каждого образа.</Text>
          <Text style={styles.bagAction}>Открыть косметичку</Text>
        </Pressable>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Подборка образов</Text>
        <Text style={styles.sectionMeta}>{looks.length} вариантов</Text>
      </View>

      {looks.map((look) => (
        <Pressable
          accessibilityRole="button"
          key={look.id}
          onPress={() => navigation.navigate("LookDetail", { lookId: look.id })}
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
        >
          <ReferencePreview compact look={look} />
          <View style={styles.cardContent}>
            <Text style={styles.cardKicker}>{occasionLabels[look.occasion] ?? look.occasion}</Text>
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
  kicker: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  },
  logoutButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  logoutText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  bagCard: {
    backgroundColor: colors.charcoal,
    borderRadius: radii.md,
    gap: 8,
    overflow: "hidden",
    padding: 16,
    ...shadow
  },
  bagAccent: {
    backgroundColor: colors.sage,
    bottom: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: 8
  },
  bagTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900"
  },
  bagText: {
    color: "#e8ddd2",
    fontSize: 14,
    lineHeight: 20
  },
  bagAction: {
    color: "#d5ead9",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionMeta: {
    color: colors.subtle,
    fontSize: 13,
    fontWeight: "800"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 12,
    ...shadow
  },
  pressed: {
    opacity: 0.84
  },
  cardContent: {
    flex: 1,
    gap: 7,
    justifyContent: "center"
  },
  cardKicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  lookTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  meta: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5
  }
});
