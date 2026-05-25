import { StyleSheet, Text, View } from "react-native";

import type { RelationType } from "../game/types";
import { useSettings } from "../hooks/useSettings";
import { Fonts } from "../constants/fonts";

export function RelationBadge({
  type,
  size,
  left,
  top
}: {
  type: RelationType;
  size: number;
  left: number;
  top: number;
}) {
  const { theme } = useSettings();

  return (
    <View
      pointerEvents="none"
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left,
          top,
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.accent
        }
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.accent, fontSize: size * 0.62, lineHeight: size * 0.72 }]}>
        {type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    zIndex: 3,
    borderWidth: 1.8,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: Fonts.subheading,
  }
});
