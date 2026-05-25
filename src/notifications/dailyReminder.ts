import * as Notifications from "expo-notifications";

import { t } from "../i18n/translations";

const DAILY_REMINDER_IDENTIFIER = "boxiq-daily-reminder";

function isGranted(settings: Notifications.NotificationPermissionsStatus): boolean {
  if (!settings.ios) {
    return true;
  }

  return [
    Notifications.IosAuthorizationStatus.AUTHORIZED,
    Notifications.IosAuthorizationStatus.PROVISIONAL,
    Notifications.IosAuthorizationStatus.EPHEMERAL
  ].includes(settings.ios.status);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

async function hasNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();

  if (isGranted(settings)) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return isGranted(requested);
}

export async function syncDailyReminder(enabled: boolean, locale: "tr" | "en"): Promise<boolean> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_IDENTIFIER).catch(() => undefined);

  if (!enabled) {
    return false;
  }

  const granted = await hasNotificationPermission();
  if (!granted) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_IDENTIFIER,
    content: {
      title: t(locale, "dailyReminderTitle"),
      body: t(locale, "dailyReminderBody")
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0
    }
  });

  return true;
}
