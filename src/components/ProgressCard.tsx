import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Fonts } from "../constants/fonts";

export function ProgressCard({ label, value }: { label: string; value: string }) {
  const { theme } = useSettings();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardStrong,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 92,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12
  },
  value: {
    fontSize: 18,
    fontFamily: Fonts.subheading,
    marginBottom: 4
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.body,
  }
});
