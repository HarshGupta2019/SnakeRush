import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'snake-rush-reminders';
const NOTIFICATION_ID_START = 7100;
const REMINDER_COUNT = 180;
const HOUR_MS = 60 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'snake_rush_last_activity';

const REMINDER_MESSAGES = [
  '🐍 We miss you! Come back!',
  '🎮 Ready for another rescue?',
  '🐾 Animals need your help! ❤️',
  '⭐ Your next adventure awaits!',
  '🐍 The snakes are waiting! 😈',
  '🎯 Can you beat your high score?',
  '🏆 Your leaderboard spot awaits!',
  '❤️ Come back and rescue more!',
  '🐾 More animals need saving!',
  '🔥 Think you can beat your score?',
  '🎁 Your next reward is waiting!',
  '⭐ Time to earn more stars!',
  '🐍 The rescue mission continues!',
  '🎮 One more game? 😎',
  '🏆 Your crown is waiting! 👑',
  '⚡ Ready for a quick challenge?',
  "🐾 Don't leave them trapped! 😭",
  '🎯 Your next challenge awaits!',
  '🔥 Come back, champion! 🏆',
  '❤️ Snake Rush misses you! 🐍',
];

let notificationQueue: Promise<void> = Promise.resolve();

const runSerially = <T,>(operation: () => Promise<T>): Promise<T> => {
  const result = notificationQueue.then(operation, operation);
  notificationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
};

const notificationIds = Array.from(
  { length: REMINDER_COUNT },
  (_, index) => NOTIFICATION_ID_START + index,
);

const shuffledMessages = (): string[] => {
  const messages: string[] = [];
  while (messages.length < REMINDER_COUNT) {
    const shuffled = [...REMINDER_MESSAGES];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    messages.push(...shuffled);
  }
  return messages.slice(0, REMINDER_COUNT);
};

const ensureNotificationChannel = async (): Promise<void> => {
  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: 'Snake Rush reminders',
    description: 'Occasional reminders about your rescue missions',
    importance: 3,
  });
};

const requestNotificationPermission = async (): Promise<boolean> => {
  const permission = await LocalNotifications.checkPermissions();
  const result = permission.display === 'granted'
    ? permission
    : await LocalNotifications.requestPermissions();

  if (result.display !== 'granted') return false;

  await ensureNotificationChannel();
  return true;
};

const hasNotificationPermission = async (): Promise<boolean> => {
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') return false;

  await ensureNotificationChannel();
  return true;
};

export const initializeInactivityReminders = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;
  return runSerially(hasNotificationPermission);
};

export const enableInactivityReminders = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;
  return runSerially(requestNotificationPermission);
};

export const cancelInactivityReminders = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  await runSerially(() => LocalNotifications.cancel({
    notifications: notificationIds.map(id => ({ id })),
  }));
};

export const scheduleInactivityReminders = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  await runSerially(async () => {
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') return;

    const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || Date.now();
    const now = Date.now();
    const overdue = now >= lastActivity + 24 * HOUR_MS;
    const messages = shuffledMessages();
    const notifications = messages.map((body, index) => {
      const delay = overdue
        ? index === 0
          ? 1000
          : (1 + (index - 1) * 4) * HOUR_MS
        : index === 0
          ? 24 * HOUR_MS
          : (25 + (index - 1) * 4) * HOUR_MS;
      return {
        id: NOTIFICATION_ID_START + index,
        title: 'Snake Rush',
        body,
        channelId: CHANNEL_ID,
        schedule: {
          at: new Date((overdue ? now : lastActivity) + delay),
          allowWhileIdle: true,
        },
        isExactNotification: false,
      };
    });

    await LocalNotifications.cancel({
      notifications: notificationIds.map(id => ({ id })),
    });
    await LocalNotifications.schedule({ notifications });
  });
};
