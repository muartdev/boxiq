import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../theme/typography";

type SymbolKind = "filled" | "hollow";
type RelationKind = "=" | "×";

function SymbolMark({ kind }: { kind: SymbolKind }) {
  const { theme } = useSettings();

  if (kind === "filled") {
    return <View style={[styles.filled, { backgroundColor: theme.colors.accent }]} />;
  }

  return <View style={[styles.hollow, { borderColor: theme.colors.accent }]} />;
}

export function ClueMiniPreview({
  relation,
  left,
  right
}: {
  relation: RelationKind;
  left: SymbolKind;
  right: SymbolKind;
}) {
  const { theme } = useSettings();

  return (
    <View style={styles.wrap}>
      <View style={[styles.cell, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
        <SymbolMark kind={left} />
      </View>
      <View
        style={[
          styles.badge,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.cardStrong
          }
        ]}
      >
        <Text style={[styles.badgeText, { color: theme.colors.accent }]}>{relation}</Text>
      </View>
      <View style={[styles.cell, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
        <SymbolMark kind={right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  cell: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    ...Typography.bodyStrong,
    fontSize: 11,
    lineHeight: 12
  },
  filled: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  hollow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2
  }
});
