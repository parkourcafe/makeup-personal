import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ children, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null, disabled ? styles.disabled : null]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#20201f",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  pressed: {
    opacity: 0.82
  },
  disabled: {
    backgroundColor: "#9b948c"
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700"
  }
});
