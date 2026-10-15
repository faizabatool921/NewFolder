import FontAwesome from '@expo/vector-icons/FontAwesome'
import Fontisto from '@expo/vector-icons/Fontisto'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { supabase } from '../supabase'

const BProfile = ({ navigation }) => {
  const { businessId } = useSelector((state) => state.home);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) {
        console.log('Fetch profile error:', error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F6F7FB' }}>

      {/* HEADER */}
      <View style={{ padding: 20, paddingTop: 55 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>
          My Profile
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 40 }}>

        {/* PROFILE CARD */}
        <LinearGradient
          colors={['#ffffff', '#f4f0ff']}
          style={{
            padding: 20,
            borderRadius: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
            marginBottom: 16
          }}
        >
          {/* Avatar */}
          <LinearGradient
            colors={['#6C5CE7', '#A29BFE']}
            style={{
              width: 85,
              height: 85,
              borderRadius: 42.5,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff' }}>
              {profile?.business_name?.substring(0, 3).toUpperCase() || '...'}
            </Text>
          </LinearGradient>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>
            {profile?.business_name || 'Loading...'}
          </Text>

          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {profile?.location || ''}
          </Text>
        </LinearGradient>

        {/* INFO CARD */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 18,
          padding: 14,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3
        }}>

          <InfoRow icon="phone" lib="FontAwesome" text={profile?.phone || '-'} />
          <InfoRow icon="person" lib="MaterialIcons" text={profile?.owner_name || '-'} />
          <InfoRow icon="category" lib="MaterialIcons" text={profile?.category || '-'} />
          <InfoRow icon="location-on" lib="MaterialIcons" text={profile?.location || '-'} />
        </View>

        {/* SETTINGS TITLE */}
        <Text style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#333',
          marginBottom: 12
        }}>
          Settings
        </Text>

        {/* SETTINGS ITEMS */}
        <SettingItem icon="notifications" label="Notifications" />
        <SettingItem icon="edit" label="Edit Business Info" />

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff1f1',
            padding: 14,
            borderRadius: 14,
            marginTop: 10,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            elevation: 2
          }}
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={{ marginLeft: 10, color: '#ef4444', fontWeight: '700' }}>
            Logout
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const InfoRow = ({ icon, text, lib }) => {
  const Icon =
    lib === 'Fontisto'
      ? Fontisto
      : lib === 'FontAwesome'
      ? FontAwesome
      : MaterialIcons

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee'
    }}>
      <Icon name={icon} size={18} color="#6C5CE7" />
      <Text style={{ marginLeft: 10, color: '#333', fontSize: 13 }}>
        {text}
      </Text>
    </View>
  )
}

const SettingItem = ({ icon, label }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 3
      }}
    >
      <MaterialIcons name={icon} size={20} color="#555" />
      <Text style={{ flex: 1, marginLeft: 10, color: '#222', fontSize: 14 }}>
        {label}
      </Text>
      <MaterialIcons name="chevron-right" size={20} color="#bbb" />
    </TouchableOpacity>
  )
}

export default BProfile