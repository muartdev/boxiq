import { Pressable, StyleSheet, Text, View } from "react-native";

import type { InlineCoachStep } from "../game/onboarding";
import { useSettings } from "../hooks/useSettings";
import { t } from "../i18n/translations";
import { Typography } from "../theme/typography";
import { ClueMiniPreview } from "./ClueMiniPreview";

function coachCopy(locale: "tr" | "en", step: InlineCoachStep) {
  const copy = {
    en: {
      fill: {
        title: "Tap an empty square",
        body: "Place your first circle to begin reading the board."
      },
      cycle: {
        title: "Tap once more",
        body: "Keep tapping the same square to cycle empty, filled, and hollow."
      },
      equal: {
        title: "Read the = clue",
        body: "These neighboring squares must match."
      },
      cross: {
        title: "Read the × clue",
        body: "These neighboring squares must be different."
      },
      check: {
        title: "Use Check",
        body: "When the board feels balanced, test the whole pattern."
      }
    },
    tr: {
      fill: {
        title: "Boş bir kutuya dokun",
        body: "Tahtayı okumaya başlamak için ilk daireyi yerleştir."
      },
      cycle: {
        title: "Bir kez daha dokun",
        body: "Aynı kutuya tekrar dokunarak boş, dolu ve halka arasında geçiş yap."
      },
      equal: {
        title: "= ipucunu oku",
        body: "Bu iki komşu kutu aynı sembolü taşımalı."
      },
      cross: {
        title: "× ipucunu oku",
        body: "Bu iki komşu kutu farklı semboller taşımalı."
      },
      check: {
        title: "Kontrol kullan",
        body: "Tahta dengeli görünüyorsa tüm örüntüyü test et."
      }
    }
  } as const;

  return copy[locale][step];
}

export function InlineCoach({
  step,
  onDismiss,
  onAdvanceClue
}: {
  step: InlineCoachStep;
  onDismiss: () => void;
  onAdvanceClue: () => void;
}) {
  const { locale, theme } = useSettings();
  const copy = coachCopy(locale, step);
  const isClueStep = step === "equal" || step === "cross";

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
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "firstGuide")}</Text>
        <Pressable accessibilityRole="button" onPress={onDismiss}>
          <Text style={[styles.skip, { color: theme.colors.muted }]}>{t(locale, "skip")}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {step === "equal" ? <ClueMiniPreview relation="=" left="filled" right="filled" /> : null}
        {step === "cross" ? <ClueMiniPreview relation="×" left="filled" right="hollow" /> : null}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{copy.title}</Text>
          <Text style={[styles.body, { color: theme.colors.muted }]}>{copy.body}</Text>
        </View>
      </View>

      {isClueStep ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAdvanceClue}
          style={[styles.action, { borderColor: theme.colors.border, backgroundColor: theme.colors.cardStrong }]}
        >
          <Text style={[styles.actionText, { color: theme.colors.accent }]}>{t(locale, "gotIt")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  kicker: {
    ...Typography.brandLabel
  },
  skip: {
    ...Typography.muted,
    fontSize: 14
  },
  content: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  textBlock: {
    flex: 1,
    gap: 4
  },
  title: {
    ...Typography.bodyStrong,
    fontSize: 16
  },
  body: {
    ...Typography.muted,
    fontSize: 15,
    lineHeight: 20
  },
  action: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  actionText: {
    ...Typography.bodyStrong,
    fontSize: 14
  }
});
