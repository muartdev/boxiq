import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "../src/components/AppShell";
import { DailyCard } from "../src/components/DailyCard";
import { LevelCard } from "../src/components/LevelCard";
import { useBoxiqGame } from "../src/hooks/useBoxiqGame";
import { useSettings } from "../src/hooks/useSettings";
import { t } from "../src/i18n/translations";
import { Typography } from "../src/theme/typography";

const chapterDescriptions: Record<string, { en: string; tr: string }> = {
  Starter: {
    en: "Learn the visual language and settle into the rhythm.",
    tr: "Görsel dili öğren ve ritme yumuşakça gir."
  },
  Classic: {
    en: "Pure Boxiq balance with cleaner deductions.",
    tr: "Daha temiz çıkarımlarla klasik Boxiq dengesi."
  },
  Expert: {
    en: "Tighter clue chains and less forgiving reads.",
    tr: "Daha sıkı ipucu zincirleri ve daha sert okumalar."
  },
  Master: {
    en: "Late-game logic for the calm obsessive mind.",
    tr: "Sakin ama takıntılı zihinler için ileri seviye mantık."
  },
  "Başlangıç": {
    en: "",
    tr: "Görsel dili öğren ve ritme yumuşakça gir."
  },
  Klasik: {
    en: "",
    tr: "Daha temiz çıkarımlarla klasik Boxiq dengesi."
  },
  Uzman: {
    en: "",
    tr: "Daha sıkı ipucu zincirleri ve daha sert okumalar."
  },
  Usta: {
    en: "",
    tr: "Sakin ama takıntılı zihinler için ileri seviye mantık."
  }
};

export default function LevelsScreen() {
  const router = useRouter();
  const { locale, theme } = useSettings();
  const { levels, selectedLevelId, progress, selectLevel, dailyLevelId, dailyStats } = useBoxiqGame();
  const groups = Array.from(new Set(levels.map((level) => level.chapter[locale])));
  const dailyLevel = levels.find((level) => level.id === dailyLevelId) ?? levels[0];

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "chooseLevel")}</Text>
      </View>

      <DailyCard
        level={dailyLevel}
        locale={locale}
        stats={dailyStats}
        selected={selectedLevelId === dailyLevelId}
        featured
        onPress={() => {
          void selectLevel(dailyLevelId).then(() => router.replace("/"));
        }}
      />

      {groups.map((group) => {
        const groupLevels = levels.filter((level) => level.chapter[locale] === group);
        const completedCount = groupLevels.filter((level) => progress[level.id]?.completed).length;

        return (
        <View key={group} style={[styles.group, { borderTopColor: theme.colors.border }]}>
          <View style={styles.groupHeader}>
            <Text style={[styles.groupTitle, { color: theme.colors.accent }]}>{group}</Text>
            <Text style={[styles.groupMeta, { color: theme.colors.muted }]}>
              {completedCount}/{groupLevels.length}
            </Text>
          </View>
          <Text style={[styles.groupBody, { color: theme.colors.muted }]}>
            {chapterDescriptions[group]?.[locale] ?? chapterDescriptions[group]?.en ?? ""}
          </Text>
          {levels
            .map((level, index) => ({ level, index }))
            .filter(({ level }) => level.chapter[locale] === group)
            .map(({ level, index }) => (
              <LevelCard
                key={level.id}
                level={level}
                index={index}
                locale={locale}
                selected={level.id === selectedLevelId}
                isDaily={level.id === dailyLevelId}
                progress={progress[level.id]}
                onPress={() => {
                  void selectLevel(level.id).then(() => router.replace("/"));
                }}
              />
            ))}
        </View>
      )})}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10
  },
  title: {
    ...Typography.screenTitle
  },
  group: {
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 16
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  groupTitle: {
    ...Typography.brandLabel,
    marginTop: 4
  },
  groupMeta: {
    ...Typography.muted,
    fontSize: 14
  },
  groupBody: {
    ...Typography.muted,
    fontSize: 15,
    marginTop: -2
  }
});
