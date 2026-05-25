import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import type { CellValue, Relation } from "../game/types";
import { useSettings } from "../hooks/useSettings";
import { BoxiqCell } from "./BoxiqCell";
import { RelationBadge } from "./RelationBadge";

const BOARD_DIMENSION = 6;
const GAP = 8;

export function BoxiqBoard({
  board,
  fixedCells,
  hintedCells,
  invalidCells,
  relations,
  onCellPress
}: {
  board: CellValue[][];
  fixedCells: boolean[][];
  hintedCells: Set<string>;
  invalidCells: Set<string>;
  relations: Relation[];
  onCellPress: (row: number, col: number) => void;
}) {
  const { theme } = useSettings();
  const [boardSize, setBoardSize] = useState(0);
  const [activeCell, setActiveCell] = useState<string | undefined>();
  const cellSize = boardSize > 0 ? (boardSize - GAP * (BOARD_DIMENSION - 1)) / BOARD_DIMENSION : 0;
  const badgeSize = Math.max(22, Math.min(30, cellSize * 0.4));

  function handleLayout(event: LayoutChangeEvent) {
    const width = event.nativeEvent.layout.width;
    setBoardSize(width);
  }

  function cellCenter(row: number, col: number) {
    return {
      x: col * (cellSize + GAP) + cellSize / 2,
      y: row * (cellSize + GAP) + cellSize / 2
    };
  }

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.frame,
        {
          backgroundColor: theme.colors.cardStrong,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow
        }
      ]}
    >
      {boardSize > 0 ? (
        <View style={{ width: boardSize, height: boardSize }}>
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <BoxiqCell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                fixed={fixedCells[rowIndex][colIndex]}
                hinted={hintedCells.has(`${rowIndex}-${colIndex}`)}
                invalid={invalidCells.has(`${rowIndex}-${colIndex}`)}
                active={activeCell === `${rowIndex}-${colIndex}`}
                size={cellSize}
                left={colIndex * (cellSize + GAP)}
                top={rowIndex * (cellSize + GAP)}
                onPress={() => {
                  setActiveCell(`${rowIndex}-${colIndex}`);
                  onCellPress(rowIndex, colIndex);
                }}
              />
            ))
          )}
          {relations.map((relation, index) => {
            const first = cellCenter(relation.r1, relation.c1);
            const second = cellCenter(relation.r2, relation.c2);
            return (
              <RelationBadge
                key={`${relation.r1}-${relation.c1}-${relation.r2}-${relation.c2}-${index}`}
                type={relation.type}
                size={badgeSize}
                left={(first.x + second.x) / 2 - badgeSize / 2}
                top={(first.y + second.y) / 2 - badgeSize / 2}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 0,
    overflow: "visible",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  }
});
