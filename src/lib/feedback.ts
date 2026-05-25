import * as Haptics from "expo-haptics";

export async function triggerSelectionFeedback(enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  await Haptics.selectionAsync();
}

export async function triggerHintFeedback(enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function triggerErrorFeedback(enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function triggerSuccessFeedback(enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
