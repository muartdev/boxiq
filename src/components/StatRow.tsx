import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function StatRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  const { theme } = useSettings();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16
  },
  label: {
    ...Typography.muted
  },
  value: {
    ...Typography.bodyStrong
  }
});
