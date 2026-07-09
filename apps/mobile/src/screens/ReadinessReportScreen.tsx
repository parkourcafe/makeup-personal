import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { DEMO_USER_ID } from "../config";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import type { MockOffer, ReadinessReport, RootStackParamList, UserProduct } from "../types";
import { categoryLabel, overallLabels, statusLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "ReadinessReport">;

export function ReadinessReportScreen({ navigation, route }: Props) {
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [mockOffersByGap, setMockOffersByGap] = useState<Record<string, MockOffer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextProducts, nextReport] = await Promise.all([
        api.getUserProducts(DEMO_USER_ID),
        api.getReadinessReport(DEMO_USER_ID, route.params.lookId)
      ]);
      setProducts(nextProducts);
      setReport(nextReport);
      const gapIds = nextReport.role_matches
        .map((match) => match.shopping_gap?.gap_id)
        .filter((gapId): gapId is string => Boolean(gapId));
      const offerEntries = await Promise.all(
        gapIds.map(async (gapId) => [gapId, await api.getMockOffers(gapId)] as const)
      );
      setMockOffersByGap(Object.fromEntries(offerEntries));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сформировать отчет");
    } finally {
      setLoading(false);
    }
  }, [route.params.lookId]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  return (
    <Screen error={error} loading={loading}>
      {report ? (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>{overallLabels[report.overall_status]}</Text>
            <Text style={styles.score}>{report.readiness_score}%</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Роли образа</Text>
            {report.role_matches.map((match) => {
              const product = match.matched_product_id ? productsById.get(match.matched_product_id) : null;
              return (
                <View key={match.look_role_id} style={styles.matchCard}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.status}>{statusLabels[match.status]}</Text>
                    <Text style={styles.scoreSmall}>{match.score}%</Text>
                  </View>
                  {product ? (
                    <Text style={styles.product}>
                      {product.brand} · {product.name}
                    </Text>
                  ) : null}
                  <Text style={styles.reason}>{match.reason}</Text>
                  {match.how_to_use ? <Text style={styles.howTo}>{match.how_to_use}</Text> : null}
                  {match.shopping_gap ? (
                    <View style={styles.gapBox}>
                      <Text style={styles.gapTitle}>Пробел: {categoryLabel(match.shopping_gap.needed_category)}</Text>
                      <Text style={styles.gapText}>{match.shopping_gap.needed_description}</Text>
                      <Text style={styles.mockLabel}>Mock availability for demo. Not live inventory.</Text>
                      {(mockOffersByGap[match.shopping_gap.gap_id] ?? []).map((offer) => (
                        <View key={offer.id} style={styles.offerRow}>
                          <Text style={styles.offerName}>
                            {offer.brand} · {offer.product_name}
                          </Text>
                          <Text style={styles.offerMeta}>
                            {offer.store?.name ?? "Mock store"} · {offer.price} {offer.currency}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          <PrimaryButton onPress={() => navigation.navigate("TutorialPlayer", { lookId: route.params.lookId })}>
            Перейти к уроку
          </PrimaryButton>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    backgroundColor: "#20201f",
    borderRadius: 8,
    gap: 8,
    padding: 20
  },
  summaryLabel: {
    color: "#f8f5ef",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center"
  },
  score: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900"
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: "#20201f",
    fontSize: 18,
    fontWeight: "800"
  },
  matchCard: {
    backgroundColor: "#fff",
    borderColor: "#e5ded5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12
  },
  matchHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  status: {
    color: "#20201f",
    fontSize: 16,
    fontWeight: "800"
  },
  scoreSmall: {
    color: "#6f675f",
    fontSize: 13,
    fontWeight: "800"
  },
  product: {
    color: "#4e4842",
    fontSize: 14,
    fontWeight: "700"
  },
  reason: {
    color: "#5b554e",
    fontSize: 14,
    lineHeight: 20
  },
  howTo: {
    backgroundColor: "#f6f0e9",
    borderRadius: 8,
    color: "#4e4842",
    fontSize: 14,
    lineHeight: 20,
    overflow: "hidden",
    padding: 10
  },
  gapBox: {
    backgroundColor: "#fff4df",
    borderColor: "#f1c36d",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10
  },
  gapTitle: {
    color: "#7c4a03",
    fontSize: 14,
    fontWeight: "800"
  },
  gapText: {
    color: "#7c4a03",
    fontSize: 13,
    lineHeight: 18
  },
  mockLabel: {
    color: "#7c4a03",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  offerRow: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderRadius: 8,
    gap: 3,
    marginTop: 4,
    padding: 8
  },
  offerName: {
    color: "#5f3f0a",
    fontSize: 13,
    fontWeight: "800"
  },
  offerMeta: {
    color: "#7c4a03",
    fontSize: 12
  }
});
