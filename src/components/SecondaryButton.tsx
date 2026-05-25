import { Pressable, StyleSheet, Text } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function SecondaryButton({
  label,
  onPress,
  danger = false,
  disabled = false
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
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
          backgroundColor: theme.colors.card,
          borderColor: disabled
            ? theme.colors.cardStrong
            : danger
              ? theme.colors.danger
              : theme.colors.border,
          opacity: disabled ? 0.42 : pressed ? 0.72 : 1
        }
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: disabled
              ? theme.colors.muted
              : danger
                ? theme.colors.danger
                : theme.colors.text
          }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
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
