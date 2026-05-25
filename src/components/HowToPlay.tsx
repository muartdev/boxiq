import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Typography } from "../constants/fonts";
import { t } from "../i18n/translations";
import { useSettings } from "../hooks/useSettings";
import { SecondaryButton } from "./SecondaryButton";

export function HowToPlay() {
  const { locale, theme, showTutorial } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen((value) => !value)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "howToPlay")}</Text>
        <Text style={[styles.chevron, { color: theme.colors.accent }]}>{open ? "−" : "+"}</Text>
      </Pressable>
      {open ? (
        <View style={styles.content}>
          <Text style={[styles.body, { color: theme.colors.muted }]}>{t(locale, "howToPlayBody")}</Text>
          <View style={styles.clues}>
            <Text style={[styles.clue, { color: theme.colors.text }]}>= {t(locale, "tutorialStepEqualBody")}</Text>
            <Text style={[styles.clue, { color: theme.colors.text }]}>× {t(locale, "tutorialStepCrossBody")}</Text>
          </View>
          <View style={styles.row}>
            <SecondaryButton label={t(locale, "watchTutorial")} onPress={showTutorial} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    ...Typography.sectionTitle
  },
  chevron: {
    fontSize: 24,
    fontFamily: Typography.sectionTitle.fontFamily
  },
  body: {
    ...Typography.body
  },
  content: {
    marginTop: 12,
    gap: 12
  },
  clues: {
    gap: 8
  },
  clue: {
    ...Typography.bodyStrong,
    fontSize: 15,
    lineHeight: 20
  },
  row: {
    flexDirection: "row"
  }
});
