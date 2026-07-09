import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";
import type { ProductCreate, RootStackParamList, UserProduct, Vocabulary } from "../types";
import {
  categoryLabel,
  colorFamilyLabel,
  coverageLabel,
  finishLabel,
  textureLabel,
  undertoneLabel
} from "../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "MakeupBag">;

type ProductForm = {
  brand: string;
  name: string;
  category: string;
  color_family: string;
  undertone: string;
  finish: string;
  texture: string;
  coverage: string;
  intensity: string;
  is_multi_use_safe: boolean;
};

const initialForm: ProductForm = {
  brand: "",
  name: "",
  category: "blush",
  color_family: "rose",
  undertone: "",
  finish: "satin",
  texture: "cream",
  coverage: "",
  intensity: "3",
  is_multi_use_safe: false
};

const fallbackVocabulary: Vocabulary = {
  categories: ["foundation", "concealer", "blush", "bronzer", "eyeshadow", "eyeliner", "mascara", "lipstick", "lip_tint", "lip_gloss"],
  color_families: ["nude", "rose", "pink", "peach", "coral", "berry", "plum", "mauve", "brown", "bronze", "beige", "clear"],
  undertones: ["neutral", "warm", "cool"],
  finishes: ["natural", "satin", "dewy", "matte", "gloss"],
  textures: ["cream", "liquid", "powder", "gel", "balm", "pencil"],
  coverage: ["sheer", "light", "medium", "full"],
  sources: ["manual"],
  offer_statuses: []
};

export function MakeupBagScreen({ navigation, route }: Props) {
  const auth = useAuth();
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary>(fallbackVocabulary);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.user) {
        return;
      }
      const [nextProducts, nextVocabulary] = await Promise.all([
        api.getUserProducts(auth.user.id),
        api.getVocabulary()
      ]);
      setProducts(nextProducts);
      setVocabulary(nextVocabulary);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить косметичку");
    } finally {
      setLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const productCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((accumulator, product) => {
      accumulator[product.category] = (accumulator[product.category] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [products]);

  const submit = async () => {
    if (!form.brand.trim() || !form.name.trim() || !form.category.trim()) {
      setError("Заполни бренд, название и категорию");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: ProductCreate = {
        brand: form.brand.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        color_family: emptyToNull(form.color_family),
        undertone: emptyToNull(form.undertone),
        finish: emptyToNull(form.finish),
        texture: emptyToNull(form.texture),
        coverage: emptyToNull(form.coverage),
        intensity: parseNullableNumber(form.intensity),
        is_multi_use_safe: form.is_multi_use_safe,
        source: "manual",
        confidence: 1,
        expires_at: null
      };
      if (!auth.user) {
        throw new Error("Нет активного пользователя");
      }
      const created = await api.createUserProduct(auth.user.id, payload);
      setProducts((current) => [...current, created]);
      setForm(initialForm);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось добавить продукт");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (productId: number) => {
    setError(null);
    try {
      if (!auth.user) {
        throw new Error("Нет активного пользователя");
      }
      await api.deleteUserProduct(auth.user.id, productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось удалить продукт");
    }
  };

  return (
    <Screen error={error} loading={loading}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Твой набор</Text>
          <Text style={styles.title}>Косметичка</Text>
        </View>
        <Text style={styles.subtitle}>{auth.user?.display_name}: {products.length} продуктов сохранено.</Text>
      </View>

      {products.length ? (
        <View style={styles.statsRow}>
          {Object.entries(productCounts).slice(0, 4).map(([category, count]) => (
            <View key={category} style={styles.statPill}>
              <Text style={styles.statNumber}>{count}</Text>
              <Text style={styles.statLabel}>{categoryLabel(category)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Новый продукт</Text>
          <Text style={styles.formHint}>Бренд, название и категория обязательны.</Text>
        </View>
        <FormInput label="Бренд" value={form.brand} onChangeText={(value) => setForm({ ...form, brand: value })} />
        <FormInput label="Название" value={form.name} onChangeText={(value) => setForm({ ...form, name: value })} />
        <ChipGroup
          label="Категория"
          options={vocabulary.categories}
          value={form.category}
          onChange={(value) => setForm({ ...form, category: value })}
          labelFor={categoryLabel}
        />
        <ChipGroup
          allowEmpty
          label="Цвет"
          options={vocabulary.color_families}
          value={form.color_family}
          onChange={(value) => setForm({ ...form, color_family: value })}
          labelFor={colorFamilyLabel}
        />
        <ChipGroup
          allowEmpty
          label="Финиш"
          options={vocabulary.finishes}
          value={form.finish}
          onChange={(value) => setForm({ ...form, finish: value })}
          labelFor={finishLabel}
        />
        <ChipGroup
          allowEmpty
          label="Текстура"
          options={vocabulary.textures}
          value={form.texture}
          onChange={(value) => setForm({ ...form, texture: value })}
          labelFor={textureLabel}
        />
        <ChipGroup
          allowEmpty
          label="Покрытие"
          options={vocabulary.coverage}
          value={form.coverage}
          onChange={(value) => setForm({ ...form, coverage: value })}
          labelFor={coverageLabel}
        />
        <ChipGroup
          allowEmpty
          label="Подтон"
          options={vocabulary.undertones}
          value={form.undertone}
          onChange={(value) => setForm({ ...form, undertone: value })}
          labelFor={undertoneLabel}
        />
        <ChipGroup
          label="Интенсивность"
          options={["1", "3", "5", "7", "9"]}
          value={form.intensity}
          onChange={(value) => setForm({ ...form, intensity: value })}
          labelFor={(value) => value}
        />
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.label}>Мульти-продукт</Text>
            <Text style={styles.switchHint}>Можно безопасно использовать не только в родной зоне.</Text>
          </View>
          <Switch
            onValueChange={(value) => setForm({ ...form, is_multi_use_safe: value })}
            thumbColor={form.is_multi_use_safe ? colors.sage : colors.surface}
            trackColor={{ false: "#d5cabe", true: "#bfd0c4" }}
            value={form.is_multi_use_safe}
          />
        </View>
        <PrimaryButton disabled={saving} onPress={submit}>
          {saving ? "Добавляю" : "Добавить продукт"}
        </PrimaryButton>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Продукты</Text>
          <Text style={styles.sectionCount}>{products.length}</Text>
        </View>
        {products.length ? (
          products.map((product) => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productAccent} />
              <View style={styles.productText}>
                <Text style={styles.productTitle}>{product.brand}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {categoryLabel(product.category)} · {product.color_family ? colorFamilyLabel(product.color_family) : "цвет не указан"} · {product.finish ? finishLabel(product.finish) : "финиш не указан"}
                </Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => void removeProduct(product.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Удалить</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Пока пусто</Text>
            <Text style={styles.emptyText}>Добавь хотя бы один продукт, чтобы проверить готовность к образу.</Text>
          </View>
        )}
      </View>

      <PrimaryButton onPress={() => navigation.navigate("ReadinessReport", { lookId: route.params.lookId })}>
        Проверить готовность
      </PrimaryButton>
    </Screen>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
};

function FormInput({ label, value, onChangeText }: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.subtle}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

type ChipGroupProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  labelFor: (value: string) => string;
  allowEmpty?: boolean;
};

function ChipGroup({ label, options, value, onChange, labelFor, allowEmpty = false }: ChipGroupProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = value === option;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onChange(active && allowEmpty ? "" : option)}
              style={[styles.chip, active ? styles.chipActive : null]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{labelFor(option)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseNullableNumber(value: string): number | null {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) ? parsed : null;
}

const styles = StyleSheet.create({
  header: {
    gap: 6
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
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  statPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: 74,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  statNumber: {
    color: colors.plum,
    fontSize: 18,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 13,
    padding: 14,
    ...shadow
  },
  formHeader: {
    gap: 3
  },
  formTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  formHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  inputGroup: {
    gap: 7
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  },
  input: {
    backgroundColor: "#faf5ef",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 12
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    backgroundColor: "#faf5ef",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: colors.plum,
    borderColor: colors.plum
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  chipTextActive: {
    color: colors.surface
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between"
  },
  switchText: {
    flex: 1,
    gap: 3
  },
  switchHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17
  },
  section: {
    gap: 9
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
    color: colors.subtle,
    fontSize: 13,
    fontWeight: "900"
  },
  productRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    overflow: "hidden",
    padding: 12,
    ...shadow
  },
  productAccent: {
    backgroundColor: colors.rose,
    alignSelf: "stretch",
    borderRadius: 99,
    width: 4
  },
  productText: {
    flex: 1,
    gap: 4
  },
  productTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  productName: {
    color: colors.muted,
    fontSize: 14
  },
  productMeta: {
    color: colors.subtle,
    fontSize: 12,
    lineHeight: 17
  },
  deleteButton: {
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  deleteText: {
    color: colors.dangerText,
    fontSize: 12,
    fontWeight: "900"
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 5,
    padding: 14
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
