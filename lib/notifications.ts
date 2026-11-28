import { getItem, setItem } from "@/lib/storage";
import * as Notifications from "expo-notifications";
import i18n from "i18next";
import { Platform } from "react-native";

const REMINDER_CHANNEL_ID = "daily-reminder";
const REMINDER_HOUR = 20;
const REMINDER_MINUTE = 0;

const DAYS_AHEAD = 14;

const ENABLED_STORAGE_KEY = "dailyReminderEnabled";

// Android only for now.
export const areRemindersSupported = Platform.OS === "android";
const isSupported = areRemindersSupported;

/** Device-level user preference. Defaults to enabled. */
export async function getRemindersEnabled(): Promise<boolean> {
  if (!isSupported) return false;
  return (await getItem(ENABLED_STORAGE_KEY)) !== "false";
}

async function saveRemindersEnabled(enabled: boolean) {
  await setItem(ENABLED_STORAGE_KEY, String(enabled));
}

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: i18n.t("notifications.channelName"),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function reminderId(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `daily-reminder-${y}-${m}-${d}`;
}

export async function cancelDailyReminders() {
  if (!isSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function refreshDailyReminders() {
  if (!isSupported) return;
  if (!(await getRemindersEnabled())) {
    await cancelDailyReminders();
    return;
  }
  if (!(await ensurePermission())) {
    // Keep the settings toggle in sync with reality.
    await saveRemindersEnabled(false);
    return;
  }

  await ensureAndroidChannel();
  await cancelDailyReminders();

  const now = new Date();
  const title = i18n.t("notifications.reminderTitle");
  const body = i18n.t("notifications.reminderBody");

  for (let day = 1; day <= DAYS_AHEAD; day++) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + day,
      REMINDER_HOUR,
      REMINDER_MINUTE,
    );
    await Notifications.scheduleNotificationAsync({
      identifier: reminderId(date),
      content: { title, body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: REMINDER_CHANNEL_ID,
      },
    });
  }
}

/**
 * Called from the settings toggle. Returns the resulting state, which is
 * false if the user asked to enable but notification permission is denied.
 */
export async function setRemindersEnabled(enabled: boolean): Promise<boolean> {
  if (!isSupported) return false;
  if (!enabled) {
    await saveRemindersEnabled(false);
    await cancelDailyReminders();
    return false;
  }
  if (!(await ensurePermission())) return false;
  await saveRemindersEnabled(true);
  await refreshDailyReminders();
  return true;
}
