import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Fonts } from "../constants/fonts";

export function StatCard({ label, value }: { label: string; value: string }) {
  const { theme } = useSettings();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow
        }
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  label: {
    fontSize: 11,
    fontFamily: Fonts.label,
    textTransform: "uppercase",
    marginBottom: 6
  },
  value: {
    fontSize: 16,
    fontFamily: Fonts.subheading,
  }
});
