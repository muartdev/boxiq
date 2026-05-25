import { Pressable, StyleSheet, Text } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function PrimaryButton({
  label,
  onPress,
  disabled = false
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { theme } = useSettings();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.accent,
          opacity: disabled ? 0.48 : pressed ? 0.86 : 1
        }
      ]}
    >
      <Text style={[styles.label, { color: theme.mode === "dark" ? "#06101A" : "#FFFFFF" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  label: {
    ...Typography.buttonText,
    fontSize: 20,
    lineHeight: 22
  }
});
