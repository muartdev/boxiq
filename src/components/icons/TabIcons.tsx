/**
 * Boxiq Tab Bar Icons
 *
 * A unified custom icon family built with pure React Native Views.
 * Design language: geometric · rounded · minimal · same stroke weight · same optical size
 *
 * All icons are 24×24 optical units, centered in a 28×28 container.
 */

import React from "react";
import { View, StyleSheet } from "react-native";

// ---------------------------------------------------------------------------
// Shared tokens
// ---------------------------------------------------------------------------
const SIZE = 24; // optical icon size
const STROKE = 2; // unified stroke weight
const RADIUS_SM = 2.5; // small corner radius (bars, cells)
const RADIUS_MD = 4; // medium corner radius (grid cells)
const RADIUS_FULL = SIZE / 2; // full circle

type IconProps = { color: string; size?: number };

// ---------------------------------------------------------------------------
// 1. OynaIcon  –  filled circle (inspired by a filled game cell)
// ---------------------------------------------------------------------------
export function OynaIcon({ color, size = SIZE }: IconProps) {
  const scale = size / SIZE;
  const diameter = Math.round(14 * scale);
  return (
    <View style={styles.container}>
      <View
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// 2. SeviyelerIcon  –  3×3 rounded-square grid (puzzle board)
// ---------------------------------------------------------------------------
export function SeviyelerIcon({ color, size = SIZE }: IconProps) {
  const scale = size / SIZE;
  const cellSize = Math.round(4 * scale);   // slightly smaller → less dense
  const gap = Math.round(3.5 * scale);       // more breathing room between cells
  const gridSize = cellSize * 3 + gap * 2;

  const cells = Array.from({ length: 9 });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: gridSize,
          height: gridSize,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: gap,
        }}
      >
        {cells.map((_, i) => (
          <View
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              borderRadius: RADIUS_MD * scale,
              backgroundColor: color,
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 3. IstatistiklerIcon  –  3-bar rising chart (ascending steps)
// ---------------------------------------------------------------------------
export function IstatistiklerIcon({ color, size = SIZE }: IconProps) {
  const scale = size / SIZE;
  const barWidth = Math.round(5.5 * scale); // heavier bars → matches visual weight of other icons
  const gap = Math.round(3 * scale);
  const maxH = Math.round(14 * scale);

  // Heights: short → medium → tall (left to right)
  const heights = [
    Math.round(6 * scale),
    Math.round(10 * scale),
    maxH,
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: gap,
          height: maxH,
        }}
      >
        {heights.map((h, i) => (
          <View
            key={i}
            style={{
              width: barWidth,
              height: h,
              borderRadius: RADIUS_SM * scale,
              backgroundColor: color,
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 4. AyarlarIcon  –  horizontal sliders (three staggered lines with dots)
// ---------------------------------------------------------------------------
export function AyarlarIcon({ color, size = SIZE }: IconProps) {
  const scale = size / SIZE;
  const lineH = Math.round(STROKE * scale);
  const dotSize = Math.round(5.5 * scale); // larger thumbs → more prominent, easier to read
  const lineW = Math.round(14 * scale);
  const gap = Math.round(4.5 * scale);

  // Dot positions along the track (left / right / center offset)
  const dotPositions = [
    Math.round(4 * scale),   // top slider: dot on left
    Math.round(9 * scale),   // middle slider: dot on right
    Math.round(3 * scale),   // bottom slider: dot center-left
  ];

  return (
    <View style={styles.container}>
      <View style={{ gap: gap }}>
        {dotPositions.map((dotLeft, i) => (
          <View
            key={i}
            style={{
              width: lineW,
              height: Math.max(dotSize, lineH + 2),
              justifyContent: "center",
            }}
          >
            {/* Track line */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: lineH,
                borderRadius: lineH / 2,
                backgroundColor: color,
                top: (Math.max(dotSize, lineH + 2) - lineH) / 2,
              }}
            />
            {/* Thumb dot */}
            <View
              style={{
                position: "absolute",
                left: dotLeft,
                top: (Math.max(dotSize, lineH + 2) - dotSize) / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: color,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Shared container — keeps all icons in the same 28×28 optical frame
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
