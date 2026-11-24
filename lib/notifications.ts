import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL = 'tasks-hub-saved';

export function enableForegroundNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function notifyTaskSaved(taskName: string) {
  let channelId: string | undefined;

  if (Platform.OS === 'android') {
    try {
      const channel = await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: 'Task confirmations',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
      if (channel) channelId = CHANNEL;
    } catch {
      channelId = undefined;
    }
  }

  const granted = (permission: Notifications.NotificationPermissionsStatus) =>
    permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  let permission = await Notifications.getPermissionsAsync();
  if (!granted(permission) && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  if (!granted(permission)) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Saved Successfully!',
      body: `Don't forget to complete: ${taskName}.`,
      sound: 'default',
    },
    trigger: channelId ? { channelId } : null,
  });

  return true;
}
