import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";
import type { ReadinessReport, RootStackParamList, Tutorial, UserProduct } from "../types";
import { statusLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "TutorialPlayer">;

export function TutorialPlayerScreen({ route }: Props) {
  const auth = useAuth();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.user) {
        throw new Error("Нет активного пользователя");
      }
      const [nextTutorial, nextProducts, nextReport] = await Promise.all([
        api.getTutorial(route.params.lookId),
        api.getUserProducts(auth.user.id),
        api.getReadinessReport(auth.user.id, route.params.lookId)
      ]);
      setTutorial(nextTutorial);
      setProducts(nextProducts);
      setReport(nextReport);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить урок");
    } finally {
      setLoading(false);
    }
  }, [auth.user, route.params.lookId]);

  useEffect(() => {
    void loadTutorial();
  }, [loadTutorial]);

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const matchesByRoleId = useMemo(
    () => new Map((report?.role_matches ?? []).map((match) => [match.look_role_id, match])),
    [report?.role_matches]
  );

  return (
    <Screen error={error} loading={loading}>
      {tutorial ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{tutorial.title}</Text>
            <Text style={styles.summary}>{tutorial.summary}</Text>
          </View>

          {tutorial.steps.map((step) => {
            const match = step.look_role_id ? matchesByRoleId.get(step.look_role_id) : null;
            const product = match?.matched_product_id ? productsById.get(match.matched_product_id) : null;
            return (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>{step.step_number}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                {product ? (
                  <Text style={styles.product}>
                    Используй: {product.brand} · {product.name}
                  </Text>
                ) : match ? (
                  <Text style={styles.product}>Статус: {statusLabels[match.status]}</Text>
                ) : null}
                <Text style={styles.instruction}>{step.instruction}</Text>
                {step.technique_tip ? <Text style={styles.tip}>Техника: {step.technique_tip}</Text> : null}
                {step.common_mistake ? <Text style={styles.mistake}>Ошибка: {step.common_mistake}</Text> : null}
              </View>
            );
          })}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 33
  },
  summary: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    ...shadow
  },
  stepHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  stepNumber: {
    backgroundColor: colors.plum,
    borderRadius: 999,
    color: colors.surface,
    fontSize: 13,
    fontWeight: "800",
    minWidth: 30,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
    textAlign: "center"
  },
  stepTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  product: {
    backgroundColor: "#edf3ee",
    borderRadius: radii.md,
    color: colors.successText,
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    padding: 10
  },
  instruction: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22
  },
  tip: {
    color: colors.successText,
    fontSize: 14,
    lineHeight: 20
  },
  mistake: {
    color: colors.dangerText,
    fontSize: 14,
    lineHeight: 20
  }
});
