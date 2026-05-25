import { Pressable, StyleSheet, View } from "react-native";

import type { CellValue } from "../game/types";
import { useSettings } from "../hooks/useSettings";

export function BoxiqCell({
  value,
  fixed,
  hinted,
  invalid,
  active,
  size,
  left,
  top,
  onPress
}: {
  value: CellValue;
  fixed: boolean;
  hinted: boolean;
  invalid: boolean;
  active: boolean;
  size: number;
  left: number;
  top: number;
  onPress: () => void;
}) {
  const { theme } = useSettings();
  const circleSize = size * 0.48;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Boxiq cell"
      disabled={fixed}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        {
          width: size,
          height: size,
          left,
          top,
          borderColor: invalid
            ? theme.colors.danger
            : hinted || active
              ? theme.colors.accent
              : theme.colors.border,
          backgroundColor: fixed
            ? theme.colors.fixedCell
            : invalid
              ? theme.mode === "dark"
                ? "#341A23"
                : "#F5E4E1"
              : hinted || active
                ? theme.colors.accentSoft
                : theme.colors.card,
          opacity: pressed ? 0.72 : 1
        }
      ]}
    >
      <View>
        {value === 0 ? (
          <View
            style={[
              styles.emptyDot,
              {
                width: circleSize * 0.22,
                height: circleSize * 0.22,
                borderRadius: circleSize * 0.11,
                backgroundColor: theme.colors.emptyDot
              }
            ]}
          />
        ) : (
          <View
            style={[
              styles.symbol,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderColor: theme.colors.accent,
                borderWidth: value === 2 ? Math.max(3, size * 0.07) : 0,
                backgroundColor: value === 1 ? theme.colors.accent : "transparent"
              }
            ]}
          >
            {value === 1 ? <View style={[styles.innerMark, { backgroundColor: theme.colors.card }]} /> : null}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyDot: {
    opacity: 0.55
  },
  symbol: {
    alignItems: "center",
    justifyContent: "center"
  },
  innerMark: {
    width: 5,
    height: 5,
    borderRadius: 3,
    opacity: 0.42
  }
});
