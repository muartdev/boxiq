import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import type { CellValue } from "../game/types";
import { useSettings } from "../hooks/useSettings";

export function BoxiqCell({
  value,
  fixed,
  hinted,
  active,
  size,
  left,
  top,
  onPress
}: {
  value: CellValue;
  fixed: boolean;
  hinted: boolean;
  active: boolean;
  size: number;
  left: number;
  top: number;
  onPress: () => void;
}) {
  const { theme } = useSettings();
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const circleSize = size * 0.48;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: value === 0 ? 0.96 : 1.08,
        useNativeDriver: true,
        friction: 5
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6
      })
    ]).start();
  }, [scale, value]);

  useEffect(() => {
    if (!hinted) {
      pulse.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: false })
    ]).start();
  }, [hinted, pulse]);

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
          borderColor: hinted || active ? theme.colors.accent : theme.colors.border,
          backgroundColor: fixed ? theme.colors.fixedCell : active ? theme.colors.accentSoft : theme.colors.card,
          opacity: pressed ? 0.72 : 1
        }
      ]}
    >
      <Animated.View
        style={{
          transform: [
            { scale: Animated.add(scale, pulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] })) }
          ]
        }}
      >
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
          <Animated.View
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
          </Animated.View>
        )}
      </Animated.View>
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
