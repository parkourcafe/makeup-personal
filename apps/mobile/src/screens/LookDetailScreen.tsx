import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import { PrimaryButton } from "../components/PrimaryButton";
import { ReferencePreview } from "../components/ReferencePreview";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";
import type { Look, LookRole, RootStackParamList } from "../types";
import { areaForCategory, categoryLabel, difficultyLabels, occasionLabels } from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "LookDetail">;

export function LookDetailScreen({ navigation, route }: Props) {
  const [look, setLook] = useState<Look | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLook(await api.getLook(route.params.lookId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить образ");
    } finally {
      setLoading(false);
    }
  }, [route.params.lookId]);

  useEffect(() => {
    void loadLook();
  }, [loadLook]);

  const groupedRoles = useMemo(() => groupRoles(look?.roles ?? []), [look?.roles]);

  return (
    <Screen error={error} loading={loading}>
      {look ? (
        <>
          <ReferencePreview look={look} />
          <View style={styles.header}>
            <Text style={styles.kicker}>{occasionLabels[look.occasion] ?? look.occasion}</Text>
            <Text style={styles.title}>{look.title}</Text>
            <Text style={styles.description}>{look.description}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{difficultyLabels[look.difficulty] ?? look.difficulty}</Text>
              <Text style={styles.meta}>{occasionLabels[look.occasion] ?? look.occasion}</Text>
              <Text style={styles.meta}>{look.roles.length} ролей</Text>
            </View>
          </View>

          {groupedRoles.map(([area, roles]) => (
            <View key={area} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{area}</Text>
                <Text style={styles.sectionCount}>{roles.length}</Text>
              </View>
              {roles.map((role) => (
                <View key={role.id} style={styles.roleRow}>
                  <View style={styles.roleText}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                  <Text style={styles.category}>{categoryLabel(role.native_category)}</Text>
                </View>
              ))}
            </View>
          ))}

          <PrimaryButton onPress={() => navigation.navigate("MakeupBag", { lookId: look.id })}>
            Проверить косметичку
          </PrimaryButton>
        </>
      ) : null}
    </Screen>
  );
}

function groupRoles(roles: LookRole[]): [string, LookRole[]][] {
  const grouped = roles.reduce<Record<string, LookRole[]>>((accumulator, role) => {
    const area = areaForCategory(role.native_category);
    accumulator[area] = [...(accumulator[area] ?? []), role];
    return accumulator;
  }, {});

  const order = ["Кожа", "Щеки", "Глаза", "Брови", "Губы", "Другое"];
  return order.filter((area) => grouped[area]?.length).map((area) => [area, grouped[area] ?? []]);
}

const styles = StyleSheet.create({
  header: {
    gap: 10
  },
  kicker: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 33
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
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
  },
  section: {
    gap: 8
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
  sectionCount: {
    backgroundColor: colors.plum,
    borderRadius: 999,
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  roleRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 8,
    padding: 12,
    ...shadow
  },
  roleText: {
    gap: 4
  },
  roleTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  roleDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: "#edf3ee",
    borderRadius: radii.sm,
    color: colors.sage,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5
  }
});
