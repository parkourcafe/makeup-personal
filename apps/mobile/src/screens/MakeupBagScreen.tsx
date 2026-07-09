import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { api } from "../api/client";
import { DEMO_USER_ID } from "../config";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import type { ProductCreate, RootStackParamList, UserProduct } from "../types";
import { categoryLabel } from "../utils/labels";

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
  confidence: string;
  is_multi_use_safe: boolean;
};

const initialForm: ProductForm = {
  brand: "",
  name: "",
  category: "blush",
  color_family: "",
  undertone: "",
  finish: "",
  texture: "",
  coverage: "",
  intensity: "3",
  confidence: "1",
  is_multi_use_safe: false
};

export function MakeupBagScreen({ navigation, route }: Props) {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await api.getUserProducts(DEMO_USER_ID));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить косметичку");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

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
        confidence: parseNullableNumber(form.confidence),
        expires_at: null
      };
      const created = await api.createUserProduct(DEMO_USER_ID, payload);
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
      await api.deleteUserProduct(DEMO_USER_ID, productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось удалить продукт");
    }
  };

  return (
    <Screen error={error} loading={loading}>
      <View style={styles.header}>
        <Text style={styles.title}>Косметичка Алины</Text>
        <Text style={styles.subtitle}>Добавь продукт вручную или проверь текущий набор для выбранного образа.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Новый продукт</Text>
        <FormInput label="Бренд" value={form.brand} onChangeText={(value) => setForm({ ...form, brand: value })} />
        <FormInput label="Название" value={form.name} onChangeText={(value) => setForm({ ...form, name: value })} />
        <FormInput label="Категория" value={form.category} onChangeText={(value) => setForm({ ...form, category: value })} />
        <FormInput label="Цветовая семья" value={form.color_family} onChangeText={(value) => setForm({ ...form, color_family: value })} />
        <FormInput label="Подтон" value={form.undertone} onChangeText={(value) => setForm({ ...form, undertone: value })} />
        <FormInput label="Финиш" value={form.finish} onChangeText={(value) => setForm({ ...form, finish: value })} />
        <FormInput label="Текстура" value={form.texture} onChangeText={(value) => setForm({ ...form, texture: value })} />
        <FormInput label="Покрытие" value={form.coverage} onChangeText={(value) => setForm({ ...form, coverage: value })} />
        <FormInput
          keyboardType="numeric"
          label="Интенсивность 0-10"
          value={form.intensity}
          onChangeText={(value) => setForm({ ...form, intensity: value })}
        />
        <FormInput
          keyboardType="decimal-pad"
          label="Уверенность 0-1"
          value={form.confidence}
          onChangeText={(value) => setForm({ ...form, confidence: value })}
        />
        <View style={styles.switchRow}>
          <Text style={styles.label}>Безопасно использовать иначе</Text>
          <Switch
            onValueChange={(value) => setForm({ ...form, is_multi_use_safe: value })}
            value={form.is_multi_use_safe}
          />
        </View>
        <PrimaryButton disabled={saving} onPress={submit}>
          {saving ? "Добавляю" : "Добавить"}
        </PrimaryButton>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Продукты</Text>
        {products.map((product) => (
          <View key={product.id} style={styles.productRow}>
            <View style={styles.productText}>
              <Text style={styles.productTitle}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>
                {categoryLabel(product.category)} · {product.color_family ?? "цвет ?"} · {product.finish ?? "финиш ?"}
              </Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => void removeProduct(product.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Удалить</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <PrimaryButton onPress={() => navigation.navigate("ReadinessReport", { lookId: route.params.lookId })}>
        Сформировать отчет
      </PrimaryButton>
    </Screen>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
};

function FormInput({ label, value, onChangeText, keyboardType = "default" }: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9b948c"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseNullableNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const styles = StyleSheet.create({
  header: {
    gap: 6
  },
  title: {
    color: "#20201f",
    fontSize: 27,
    fontWeight: "800"
  },
  subtitle: {
    color: "#6f675f",
    fontSize: 15,
    lineHeight: 21
  },
  form: {
    backgroundColor: "#fff",
    borderColor: "#e5ded5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 12
  },
  formTitle: {
    color: "#20201f",
    fontSize: 18,
    fontWeight: "800"
  },
  inputGroup: {
    gap: 5
  },
  label: {
    color: "#4e4842",
    fontSize: 13,
    fontWeight: "700"
  },
  input: {
    backgroundColor: "#f7f4ef",
    borderColor: "#ded6cd",
    borderRadius: 8,
    borderWidth: 1,
    color: "#20201f",
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: "#20201f",
    fontSize: 18,
    fontWeight: "800"
  },
  productRow: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e5ded5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 12
  },
  productText: {
    flex: 1,
    gap: 3
  },
  productTitle: {
    color: "#20201f",
    fontSize: 15,
    fontWeight: "800"
  },
  productName: {
    color: "#4e4842",
    fontSize: 14
  },
  productMeta: {
    color: "#7a7168",
    fontSize: 12
  },
  deleteButton: {
    borderColor: "#c7beb3",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  deleteText: {
    color: "#5b554e",
    fontSize: 12,
    fontWeight: "800"
  }
});
