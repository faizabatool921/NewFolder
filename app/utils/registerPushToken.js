
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../supabase';

export async function registerPushToken(userId) {
  try {
    if (!userId) return null;

    if (!Device.isDevice) {
      console.log('Push notification test ke liye physical phone use karein.');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Rewards',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
      });
    }

    const currentPermission =
      await Notifications.getPermissionsAsync();

    let status = currentPermission.status;

    if (status !== 'granted') {
      const requested =
        await Notifications.requestPermissionsAsync();

      status = requested.status;
    }

    if (status !== 'granted') {
      console.log('Notification permission nahi mili.');
      return null;
    }

    const projectId =
      Constants.easConfig?.projectId ||
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.log('Expo projectId missing hai.');
      return null;
    }

    const result =
      await Notifications.getExpoPushTokenAsync({ projectId });

    const expoPushToken = result.data;

    const { error } = await supabase
      .from('customer_push_tokens')
      .upsert(
        {
          user_id: userId,
          expo_push_token: expoPushToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'expo_push_token' }
      );

    if (error) {
      console.log('Token save error:', error.message);
      return null;
    }

    console.log('Expo push token database mein save ho gaya.');
    return expoPushToken;
  } catch (error) {
    console.log('Push registration error:', error?.message);
    return null;
  }
}
