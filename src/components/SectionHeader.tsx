import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function SectionHeader({
  title,
  body
}: {
  title: string;
  body?: string;
}) {
  const { theme } = useSettings();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.colors.accent }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: theme.colors.muted }]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4
  },
  title: {
    ...Typography.brandLabel
  },
  body: {
    ...Typography.muted,
    fontSize: 15,
    lineHeight: 20
  }
});
