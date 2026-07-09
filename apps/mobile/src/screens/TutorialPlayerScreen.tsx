import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { DEMO_USER_ID } from "../config";
import { Screen } from "../components/Screen";
import type { ReadinessReport, RootStackParamList, Tutorial, UserProduct } from "../types";
import { statusLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "TutorialPlayer">;

export function TutorialPlayerScreen({ route }: Props) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextTutorial, nextProducts, nextReport] = await Promise.all([
        api.getTutorial(route.params.lookId),
        api.getUserProducts(DEMO_USER_ID),
        api.getReadinessReport(DEMO_USER_ID, route.params.lookId)
      ]);
      setTutorial(nextTutorial);
      setProducts(nextProducts);
      setReport(nextReport);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить урок");
    } finally {
      setLoading(false);
    }
  }, [route.params.lookId]);

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
                <Text style={styles.stepNumber}>Шаг {step.step_number}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
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
    color: "#20201f",
    fontSize: 27,
    fontWeight: "800"
  },
  summary: {
    color: "#5b554e",
    fontSize: 15,
    lineHeight: 22
  },
  stepCard: {
    backgroundColor: "#fff",
    borderColor: "#e5ded5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  stepNumber: {
    color: "#7a7168",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  stepTitle: {
    color: "#20201f",
    fontSize: 18,
    fontWeight: "800"
  },
  product: {
    backgroundColor: "#f6f0e9",
    borderRadius: 8,
    color: "#4e4842",
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    padding: 10
  },
  instruction: {
    color: "#4e4842",
    fontSize: 15,
    lineHeight: 22
  },
  tip: {
    color: "#4f5e37",
    fontSize: 14,
    lineHeight: 20
  },
  mistake: {
    color: "#7c342c",
    fontSize: 14,
    lineHeight: 20
  }
});
