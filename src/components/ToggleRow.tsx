import { StyleSheet, Switch, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function ToggleRow({
  label,
  description,
  value,
  onValueChange
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { theme } = useSettings();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        {description ? <Text style={[styles.description, { color: theme.colors.muted }]}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.cardStrong, true: theme.colors.accentSoft }}
        thumbColor={value ? theme.colors.accent : theme.colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16
  },
  copy: {
    flex: 1,
    gap: 2
  },
  label: {
    ...Typography.bodyStrong
  },
  description: {
    ...Typography.muted,
    fontSize: 14,
    lineHeight: 18
  }
});
