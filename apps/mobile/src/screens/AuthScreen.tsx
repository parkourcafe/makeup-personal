import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "../auth/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { colors, radii, shadow } from "../theme";

type Mode = "login" | "register";

export function AuthScreen() {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [skinDepth, setSkinDepth] = useState("");
  const [skinUndertone, setSkinUndertone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password.trim() || (mode === "register" && !displayName.trim())) {
      setError("Заполни обязательные поля");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "register") {
        await auth.register({
          email: email.trim(),
          password,
          display_name: displayName.trim(),
          skin_depth: emptyToNull(skinDepth),
          skin_undertone: emptyToNull(skinUndertone)
        });
      } else {
        await auth.login(email.trim(), password);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось войти");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen error={error}>
      <View style={styles.hero}>
        <View style={styles.heroAccent} />
        <Text style={styles.kicker}>Makeup Personal</Text>
        <Text style={styles.title}>Личная косметичка для реальных образов</Text>
        <Text style={styles.heroText}>Сохраняй продукты, проверяй готовность и открывай уроки под то, что уже есть у тебя.</Text>
      </View>

      <View style={styles.segmented}>
        <ModeButton active={mode === "register"} label="Регистрация" onPress={() => setMode("register")} />
        <ModeButton active={mode === "login"} label="Вход" onPress={() => setMode("login")} />
      </View>

      <View style={styles.form}>
        {mode === "register" ? (
          <FormInput label="Имя" value={displayName} onChangeText={setDisplayName} />
        ) : null}
        <FormInput autoCapitalize="none" keyboardType="email-address" label="Email" value={email} onChangeText={setEmail} />
        <FormInput label="Пароль" secureTextEntry value={password} onChangeText={setPassword} />
        {mode === "register" ? (
          <View style={styles.twoColumn}>
            <FormInput label="Глубина кожи" value={skinDepth} onChangeText={setSkinDepth} />
            <FormInput label="Подтон" value={skinUndertone} onChangeText={setSkinUndertone} />
          </View>
        ) : null}
        <PrimaryButton disabled={submitting} onPress={submit}>
          {submitting ? "Сохраняю" : mode === "register" ? "Создать аккаунт" : "Войти"}
        </PrimaryButton>
      </View>
    </Screen>
  );
}

type ModeButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

function ModeButton({ active, label, onPress }: ModeButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.modeButton, active ? styles.modeButtonActive : null]}>
      <Text style={[styles.modeText, active ? styles.modeTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  secureTextEntry?: boolean;
};

function FormInput({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false
}: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#978f86"
        secureTextEntry={secureTextEntry}
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

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.charcoal,
    borderRadius: radii.md,
    gap: 12,
    minHeight: 218,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: 18,
    ...shadow
  },
  heroAccent: {
    backgroundColor: colors.rose,
    height: 8,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  kicker: {
    color: "#f3c7d2",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 35
  },
  heroText: {
    color: "#eadbd0",
    fontSize: 15,
    lineHeight: 22
  },
  segmented: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    flexDirection: "row",
    padding: 4
  },
  modeButton: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  modeButtonActive: {
    backgroundColor: colors.surface
  },
  modeText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  modeTextActive: {
    color: colors.ink
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 12,
    padding: 14,
    ...shadow
  },
  twoColumn: {
    gap: 12
  },
  inputGroup: {
    gap: 6
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
    minHeight: 48,
    paddingHorizontal: 12
  }
});
