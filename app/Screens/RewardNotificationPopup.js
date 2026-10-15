
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../supabase';

export default function RewardNotificationPopup() {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRewardNotification = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setNotification(null);
        setVisible(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('customer_id', user.id)
        .eq('type', 'reward')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.log('Reward notification fetch error:', error.message);
        return;
      }

      setNotification(data || null);
      setVisible(Boolean(data));
    } catch (error) {
      console.log('Reward popup error:', error?.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRewardNotification();
    }, [loadRewardNotification])
  );

  const closePopup = async () => {
    if (!notification || saving) return;

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.log('Customer session nahi mili.');
        return;
      }

      // Unique row identify karne ke liye primary key behtar hai.
      // Agar table mein notification_id ya id hai to usay use karo.
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('customer_id', user.id)
        .eq('is_read', false)
        .eq('created_at', notification.created_at);

      if (notification.notification_id) {
        query = supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('notification_id', notification.notification_id)
          .eq('customer_id', user.id);
      } else if (notification.id) {
        query = supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id)
          .eq('customer_id', user.id);
      } else {
        query = query.eq('title', notification.title);
      }

      const { error } = await query;

      if (error) {
        console.log('Mark as read error:', error.message);
        return;
      }

      setVisible(false);
      setNotification(null);
    } catch (error) {
      console.log('Popup close error:', error?.message);
    } finally {
      setSaving(false);
    }
  };

  if (!notification) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closePopup}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.65)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: 26,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 64, marginBottom: 12 }}>
            🎁
          </Text>

          <Text
            style={{
              color: '#3E1041',
              fontSize: 23,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {notification.title}
          </Text>

          <Text
            style={{
              color: '#555',
              fontSize: 15,
              lineHeight: 23,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {notification.message}
          </Text>

          <TouchableOpacity
            onPress={closePopup}
            disabled={saving}
            style={{
              backgroundColor: '#3E1041',
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 30,
              width: '100%',
              alignItems: 'center',
            }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Let's Celebrate!
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
