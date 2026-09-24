import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking, Room } from '../types';
import { TIME_SLOTS } from '../utils/dateUtils';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static isInitialized = false;

  /**
   * Request user permission and initialize notification channels
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        console.log('Web environment: Notifications use browser/in-app alert fallback.');
        return true;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission was not granted.');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('room-bookings', {
          name: 'Nhắc nhở đặt phòng học',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4F46E5',
          sound: 'default',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Send an immediate confirmation notification upon successful booking
   */
  static async sendInstantBookingNotification(booking: Booking, roomName: string): Promise<string | null> {
    try {
      await this.requestPermissions();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Đặt phòng thành công!',
          body: `Mã [${booking.id}]: Đã xác nhận giữ chỗ tại ${roomName} (${booking.slotLabel}) ngày ${booking.date}.`,
          data: { bookingId: booking.id, roomId: booking.roomId },
          sound: true,
        },
        trigger: null, // trigger immediately
      });

      return notificationId;
    } catch (error) {
      console.warn('Failed to send instant booking notification:', error);
      return null;
    }
  }

  /**
   * Schedule a reminder notification 15 minutes before the booking slot starts
   */
  static async schedule15MinReminder(booking: Booking, roomName: string): Promise<string | null> {
    try {
      await this.requestPermissions();

      const slot = TIME_SLOTS.find(s => s.id === booking.slotId);
      if (!slot) return null;

      // Parse booking date and slot start time
      const [yearStr, monthStr, dayStr] = booking.date.split('-');
      const [hourStr, minStr] = slot.startTime.split(':');

      const bookingStartTime = new Date(
        parseInt(yearStr, 10),
        parseInt(monthStr, 10) - 1,
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minStr, 10),
        0
      );

      // 15 minutes before slot start
      const reminderTimeMs = bookingStartTime.getTime() - 15 * 60 * 1000;
      const nowMs = Date.now();
      const diffSeconds = Math.floor((reminderTimeMs - nowMs) / 1000);

      let trigger: Notifications.NotificationTriggerInput;

      if (diffSeconds > 10) {
        // Future booking: schedule for the exact 15-min prior moment
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(reminderTimeMs),
        };
      } else {
        // Immediate/Imminent booking: schedule a demo test reminder in 15 seconds
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 15,
          repeats: false,
        };
      }

      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Nhắc nhở ca học sắp bắt đầu (còn 15 phút)',
          body: `Ca học tại ${roomName} (${slot.label}) sẽ bắt đầu sớm. Hãy mở mã QR để check-in tại cửa phòng!`,
          data: { bookingId: booking.id, type: 'REMINDER_15_MIN' },
          sound: true,
        },
        trigger,
      });

      return reminderId;
    } catch (error) {
      console.warn('Failed to schedule reminder notification:', error);
      return null;
    }
  }

  /**
   * Cancel an existing scheduled notification
   */
  static async cancelNotification(notificationId?: string): Promise<void> {
    if (!notificationId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn('Failed to cancel notification:', error);
    }
  }
}
