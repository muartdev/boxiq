import * as React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { t } from "../i18n/translations";
import { Typography } from "../theme/typography";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

function StepPreview({ step }: { step: number }) {
  const { theme } = useSettings();

  if (step === 0) {
    return (
      <View style={styles.previewGrid}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.previewCell,
              {
                backgroundColor: index === 1 ? theme.colors.accentSoft : theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
          >
            {index === 1 ? <View style={[styles.previewFilled, { backgroundColor: theme.colors.accent }]} /> : null}
            {index === 2 ? <View style={[styles.previewHollow, { borderColor: theme.colors.accent }]} /> : null}
            {index === 0 || index === 3 ? <View style={[styles.previewDot, { backgroundColor: theme.colors.emptyDot }]} /> : null}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.cluePreview}>
      <View style={[styles.clueCell, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} />
      <View style={[styles.clueBadge, { borderColor: theme.colors.border, backgroundColor: theme.colors.cardStrong }]}>
        <Text style={[styles.clueText, { color: theme.colors.accent }]}>{step === 1 ? "=" : step === 2 ? "×" : "✓"}</Text>
      </View>
      <View style={[styles.clueCell, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} />
    </View>
  );
}

export function TutorialModal({
  visible,
  onSkip,
  onClose
}: {
  visible: boolean;
  onSkip: () => void;
  onClose: () => void;
}) {
  const { locale, theme } = useSettings();
  const steps = [
    { title: t(locale, "tutorialStepFillTitle"), body: t(locale, "tutorialStepFillBody") },
    { title: t(locale, "tutorialStepEqualTitle"), body: t(locale, "tutorialStepEqualBody") },
    { title: t(locale, "tutorialStepCrossTitle"), body: t(locale, "tutorialStepCrossBody") },
    { title: t(locale, "tutorialStepCheckTitle"), body: t(locale, "tutorialStepCheckBody") }
  ];
  const [index, setIndex] = React.useState(0);
  const isLast = index === steps.length - 1;

  React.useEffect(() => {
    if (visible) {
      setIndex(0);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onSkip}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "tutorialTitle")}</Text>
            <Text style={[styles.progress, { color: theme.colors.muted }]}>
              {index + 1}/{steps.length}
            </Text>
          </View>

          <StepPreview step={index} />

          <Text style={[styles.title, { color: theme.colors.text }]}>{steps[index].title}</Text>
          <Text style={[styles.body, { color: theme.colors.muted }]}>{steps[index].body}</Text>

          <View style={styles.dots}>
            {steps.map((step, stepIndex) => (
              <Pressable
                key={step.title}
                onPress={() => setIndex(stepIndex)}
                style={[
                  styles.dot,
                  {
                    backgroundColor: stepIndex === index ? theme.colors.accent : theme.colors.cardStrong
                  }
                ]}
              />
            ))}
          </View>

          <View style={styles.row}>
            <SecondaryButton
              label={index > 0 ? t(locale, "back") : t(locale, "skip")}
              onPress={index > 0 ? () => setIndex((current) => current - 1) : onSkip}
            />
            <PrimaryButton
              label={isLast ? t(locale, "start") : t(locale, "next")}
              onPress={() => {
                if (isLast) {
                  onClose();
                  return;
                }

                setIndex((current) => current + 1);
              }}
            />
          </View>
          {index > 0 && !isLast ? (
            <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipLink}>
              <Text style={[styles.skipText, { color: theme.colors.muted }]}>{t(locale, "skip")}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(10, 14, 12, 0.34)",
    padding: 20
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    gap: 14
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  kicker: {
    ...Typography.brandLabel
  },
  progress: {
    ...Typography.muted,
    fontSize: 14
  },
  title: {
    ...Typography.cardTitle
  },
  body: {
    ...Typography.body
  },
  dots: {
    flexDirection: "row",
    gap: 8
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: 112
  },
  previewCell: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  previewFilled: {
    width: 22,
    height: 22,
    borderRadius: 11
  },
  previewHollow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  cluePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  clueCell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1
  },
  clueBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  clueText: {
    ...Typography.sectionTitle,
    fontSize: 16,
    lineHeight: 18
  },
  skipLink: {
    alignSelf: "center"
  },
  skipText: {
    ...Typography.bodyStrong,
    fontSize: 14
  }
});
