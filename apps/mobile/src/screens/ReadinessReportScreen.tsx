import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";
import type { MatchStatus, MockOffer, ReadinessReport, RootStackParamList, UserProduct } from "../types";
import { categoryLabel, overallLabels, statusLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "ReadinessReport">;

export function ReadinessReportScreen({ navigation, route }: Props) {
  const auth = useAuth();
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [mockOffersByGap, setMockOffersByGap] = useState<Record<string, MockOffer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.user) {
        throw new Error("Нет активного пользователя");
      }
      const [nextProducts, nextReport] = await Promise.all([
        api.getUserProducts(auth.user.id),
        api.getReadinessReport(auth.user.id, route.params.lookId)
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
  }, [auth.user, route.params.lookId]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const readyCount = report?.role_matches.filter((match) => match.status === "enough").length ?? 0;
  const gapCount = report?.role_matches.filter((match) => match.status === "missing").length ?? 0;

  return (
    <Screen error={error} loading={loading}>
      {report ? (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>{overallLabels[report.overall_status]}</Text>
            <Text style={styles.score}>{report.readiness_score}%</Text>
            <View style={styles.summaryPills}>
              <Text style={styles.summaryPill}>{readyCount} готово</Text>
              <Text style={styles.summaryPill}>{gapCount} докупить</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Роли образа</Text>
            {report.role_matches.map((match) => {
              const product = match.matched_product_id ? productsById.get(match.matched_product_id) : null;
              return (
                <View key={match.look_role_id} style={[styles.matchCard, statusCardStyle(match.status)]}>
                  <View style={styles.matchHeader}>
                    <Text style={[styles.status, statusTextStyle(match.status)]}>{statusLabels[match.status]}</Text>
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
                      <Text style={styles.mockLabel}>Техническая демонстрация доступности. Не live-остатки.</Text>
                      {(mockOffersByGap[match.shopping_gap.gap_id] ?? []).map((offer) => (
                        <View key={offer.id} style={styles.offerRow}>
                          <Text style={styles.offerName}>
                            {offer.brand} · {offer.product_name}
                          </Text>
                          <Text style={styles.offerMeta}>
                            {offer.store?.name ?? "Демо-магазин"} · {offer.price} {offer.currency}
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

function statusCardStyle(status: MatchStatus) {
  if (status === "enough") {
    return styles.matchCardReady;
  }
  if (status === "missing") {
    return styles.matchCardGap;
  }
  if (status === "needs_confirmation") {
    return styles.matchCardConfirm;
  }
  return styles.matchCardNeutral;
}

function statusTextStyle(status: MatchStatus) {
  if (status === "enough") {
    return styles.statusReady;
  }
  if (status === "missing") {
    return styles.statusGap;
  }
  if (status === "needs_confirmation") {
    return styles.statusConfirm;
  }
  return styles.statusNeutral;
}

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    backgroundColor: colors.charcoal,
    borderRadius: radii.md,
    gap: 8,
    padding: 20,
    ...shadow
  },
  summaryLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center"
  },
  score: {
    color: colors.surface,
    fontSize: 40,
    fontWeight: "900"
  },
  summaryPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  summaryPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.sm,
    color: "#efe7dc",
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  matchCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 8,
    padding: 12,
    ...shadow
  },
  matchCardReady: {
    borderLeftColor: colors.sage,
    borderLeftWidth: 5
  },
  matchCardGap: {
    borderLeftColor: colors.clay,
    borderLeftWidth: 5
  },
  matchCardConfirm: {
    borderLeftColor: colors.blue,
    borderLeftWidth: 5
  },
  matchCardNeutral: {
    borderLeftColor: colors.plum,
    borderLeftWidth: 5
  },
  matchHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  status: {
    fontSize: 16,
    fontWeight: "900"
  },
  statusReady: {
    color: colors.successText
  },
  statusGap: {
    color: colors.warningText
  },
  statusConfirm: {
    color: colors.blue
  },
  statusNeutral: {
    color: colors.plum
  },
  scoreSmall: {
    color: colors.subtle,
    fontSize: 13,
    fontWeight: "900"
  },
  product: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800"
  },
  reason: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  howTo: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    overflow: "hidden",
    padding: 10
  },
  gapBox: {
    backgroundColor: colors.warningBg,
    borderColor: "#edc56e",
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 4,
    padding: 10
  },
  gapTitle: {
    color: colors.warningText,
    fontSize: 14,
    fontWeight: "800"
  },
  gapText: {
    color: colors.warningText,
    fontSize: 13,
    lineHeight: 18
  },
  mockLabel: {
    color: colors.warningText,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  offerRow: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderRadius: radii.md,
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
