import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  const { theme } = useSettings();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: selected ? theme.colors.accent : theme.colors.card,
                borderColor: selected ? theme.colors.accent : theme.colors.border,
                opacity: pressed ? 0.74 : 1
              }
            ]}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: selected ? (theme.mode === "dark" ? "#06101A" : "#FFFFFF") : theme.colors.text
                }
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10
  },
  option: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  optionText: {
    ...Typography.bodyStrong
  }
});
