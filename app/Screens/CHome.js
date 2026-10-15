
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';
import { supabase } from '../supabase';

import RewardNotificationPopup from './RewardNotificationPopup';


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null
  ) {
    return null;
  }

  const R = 6371; // Earth radius in KM

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const categories = [
  { name: "Offers", icon: "gift" },
  { name: "Food", icon: "coffee" },
  { name: "Fashion", icon: "shopping-bag" },
  { name: "Electronics", icon: "monitor" },
];

// const discounts = [
//   {
//     id: 1,
//     title: "50% OFF",
//     category: "Food",
//   },
//   {
//     id: 2,
//     title: "40% OFF",
//     category: "Fashion",
//   },
//   {
//     id: 3,
//     title: "30% OFF",
//     category: "Electronics",
//   },
// ];
// ✅ Nearby data (moved from old Nearby tab)

const recommended = [
  {
    id: 1,
    name: "Cafe Deal",
    desc: "Get free coffee",
    points: 100,
  },
  {
    id: 2,
    name: "Burger Offer",
    desc: "Buy 1 Get 1 Free",
    points: 150,
  },
];

const CHome = ({navigation}) => {
  
const { businessId } = useSelector((state) => state.home); // agar customer side businessId nahi, use hata dein
const [offers, setOffers] = useState([]);
const [loadingOffers, setLoadingOffers] = useState(true);

const [businesses, setBusinesses] = useState([]);
const [loadingBusinesses, setLoadingBusinesses] = useState(true);
const [userLocation, setUserLocation] = useState(null);

 useEffect(() => {
  const fetchOffers = async () => {
    setLoadingOffers(true);

    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        business:business_id (
          business_name
        )
      `)
            .eq('approval_status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('CUSTOMER APPROVED OFFERS:', data);
    console.log('CUSTOMER OFFERS ERROR:', error);

    if (error) {
      setOffers([]);
    } else {
      setOffers(data || []);
    }

    setLoadingOffers(false);
  };

  fetchOffers();
}, []);

useEffect(() => {
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      console.log('CUSTOMER LATITUDE:', latitude);
      console.log('CUSTOMER LONGITUDE:', longitude);

      setUserLocation({
        latitude,
        longitude,
      });
    } catch (error) {
      console.log('CUSTOMER LOCATION ERROR:', error);
    }
  };

  getUserLocation();
}, []);
useEffect(() => {
  const fetchBusinesses = async () => {
    setLoadingBusinesses(true);

    const { data, error } = await supabase
      .from('business')
      .select(`
        business_id,
        business_name,
        location,
        latitude,
        longitude,
        category,
        approval_status,
        is_active
      `)
      .eq('approval_status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    console.log('CUSTOMER BUSINESSES:', data);
    console.log('BUSINESS FETCH ERROR:', error);

    if (error) {
      setBusinesses([]);
    } else {
      setBusinesses(data || []);
    }

    setLoadingBusinesses(false);
  };

  fetchBusinesses();
}, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#EEE9F7" }}>
        {/* Reward gift-box notification */}
    <RewardNotificationPopup />

     {/* CUSTOMER QR POPUP */}

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          overflow: "hidden"
        }}>
          <LinearGradient
            colors={["#2e163a", "#3e1041", "#6e4292"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: 60,
              paddingHorizontal: 20,
              paddingBottom: 40,
              shadowColor: "#6e4292",
              shadowOpacity: 0.4,
              shadowRadius: 25,
              elevation: 15,
              // borderBottomLeftRadius: 35,
              // borderBottomRightRadius: 35,
            }}>
            {/* Glow */}
            <BlurView intensity={10} tint="light" style={{
              position: "absolute",
              top: -60,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: 200,
              backgroundColor: "rgba(140, 80, 255, 0.25)"

            }} />
            <BlurView intensity={10} tint="light" style={{
              position: "absolute",
              bottom: -100,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: 200,
              backgroundColor: "rgba(161, 112, 253, 0.25)"
            }} />
            {/* <BlurView intensity={50} tint="light" style={{
              position: "absolute",
              top: 70,
              left: 150,
              width: 150,
              height: 150,
              borderRadius: 150,
              backgroundColor: "rgba(180,120,255,0.25)"
            }} /> */}
            {/* ✨ SHINE OVERLAY */}
            <LinearGradient
              colors={["rgba(160, 114, 114, 0.35)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // borderBottomLeftRadius: 35,
                // borderBottomRightRadius: 35,
              }}
            />
            {/* Header Row */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 20 }}>
                  Hi Faiza 👋
                </Text>
                <Text style={{
                  color: "#fff",
                  fontSize: 26,
                  fontWeight: "bold"
                }}>
                  Smart Visit{"\n"}Rewards
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>

                
                <Feather name="bell" size={22} color="#c40707" />
                <Feather name="user" size={22} color="#fff" />
              </View>
            </View>

            {/* 💳 POINT CARD */}
            <BlurView intensity={50} tint="light" style={{
              marginTop: 25,
              borderRadius: 20,
              padding: 20,
              backgroundColor: "#ffffff1f",
              // backgroundColor: "#404040",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.25)",
              shadowColor: "#000",
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 10,
            }}>
              <Text style={{ color: "#fff" }}>Total Points</Text>
              <Text style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: "bold"
              }}>
                120
              </Text>
            </BlurView>
            {/* 🔶 VISIT STORE BUTTON */}
            <LinearGradient
              colors={["#230323", "#601643", "#140811"]}
              style={{
                marginTop: 20,
                borderRadius: 20,
                padding: 18,
                shadowColor: "#B06CFF",
                shadowOpacity: 0.10,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <TouchableOpacity>
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  Explore Offers
                </Text>

              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
        {/* 📂 CATEGORIES */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10
          }}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((item, index) => (
              <View 
              key={item.name}
              style={{
                width: 85,
                height: 95,
                backgroundColor: "rgba(255,255,255,0.6)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.4)",
                borderRadius: 20,
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5
              }}>
                <Feather name={item.icon} size={24} color="#6e4292" />
                <Text style={{ marginTop: 5, fontSize: 12 }}>
                  {item.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Top Discounts
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}>
            {discounts.map((item) => (
              <View
              key={item.id} 
              style={{
                width: 200,
                height: 120,
                borderRadius: 20,
                marginRight: 12,
                padding: 15,
                backgroundColor: "rgba(255,255,255,0.85)",
                shadowColor: "#6e4292",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 6
              }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.title}
                </Text>
                <Text>
                  On {item.category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View> */}

      
 <View style={{ paddingHorizontal: 20 }}>

  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
      }}
    >
      Top Discounts
    </Text>

    <TouchableOpacity
      onPress={() => navigation.navigate('AllOffers')}
    >
      <Text
        style={{
          color: '#6e4292',
          fontSize: 13,
        }}
      >
        See all
      </Text>
    </TouchableOpacity>
  </View>

  {loadingOffers ? (
    <ActivityIndicator size="small" color="#6e4292" style={{ marginTop: 20 }} />
  ) : offers.length === 0 ? (
  <View style={{
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(110,66,146,0.15)',
    borderStyle: 'dashed', borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 12,
  }}>
    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(110,66,146,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
      <Feather name="gift" size={22} color="#6e4292" />
    </View>
    <Text style={{ fontWeight: 'bold', color: '#3e1041', fontSize: 14 }}>No offers yet</Text>
    <Text style={{ color: '#8a7a99', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
      Check back soon for exciting deals from nearby businesses
    </Text>
  </View>
) : (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
      {offers.map((item) => (
        <OfferCard key={item.offer_id} item={item} />
      ))}
    </ScrollView>
  )}
</View>
      
       {/* ── NEARBY BUSINESSES ── */}
<View style={{ padding: 20 }}>

  {/* HEADER */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Feather
        name="map-pin"
        size={18}
        color="#6e4292"
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#1a0a22",
        }}
      >
        Nearby Businesses
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => navigation.navigate('AllBusinesses')}
    >
      <Text
        style={{
          color: "#6e4292",
          fontSize: 13,
        }}
      >
        See all
      </Text>
    </TouchableOpacity>
  </View>

  {/* BUSINESS LIST */}
  {loadingBusinesses ? (

    <ActivityIndicator
      size="small"
      color="#6e4292"
      style={{ marginTop: 15 }}
    />

  ) : businesses.length === 0 ? (

    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(110,66,146,0.15)',
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
      }}
    >

      <Feather
        name="map-pin"
        size={22}
        color="#6e4292"
      />

      <Text
        style={{
          fontWeight: 'bold',
          color: '#3e1041',
          fontSize: 14,
          marginTop: 8,
        }}
      >
        No businesses available
      </Text>

      <Text
        style={{
          color: '#8a7a99',
          fontSize: 12,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        Approved businesses will appear here.
      </Text>

    </View>

  ) : (

    businesses.slice(0, 4).map((item) => {

      const distance = userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            Number(item.latitude),
            Number(item.longitude)
          )
        : null;

      return (
        <View
          key={item.business_id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.75)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
            borderRadius: 18,
            padding: 14,
            marginBottom: 10,
            elevation: 3,
          }}
        >

          {/* BUSINESS ICON */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: 'rgba(110,66,146,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              borderWidth: 1,
              borderColor: 'rgba(110,66,146,0.2)',
            }}
          >
            <Feather
              name="briefcase"
              size={20}
              color="#6e4292"
            />
          </View>

          {/* BUSINESS INFO */}
          <View style={{ flex: 1 }}>

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                color: '#1a0a22',
              }}
              numberOfLines={1}
            >
              {item.business_name}
            </Text>

            <Text
              style={{
                color: '#6e4292',
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {item.category || 'Business'}
            </Text>

            <Text
              style={{
                color: '#777',
                fontSize: 11,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.location || 'Location not available'}
            </Text>

          </View>

          {/* LOCATION / GOOGLE MAP */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {

              const latitude = Number(item.latitude);
              const longitude = Number(item.longitude);

              if (
                isNaN(latitude) ||
                isNaN(longitude)
              ) {
                alert(
                  'Location is not available for this business.'
                );
                return;
              }

              const url =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

              Linking.openURL(url).catch((error) => {
                console.log(
                  'Google Maps Error:',
                  error
                );

                alert(
                  'Unable to open Google Maps.'
                );
              });

            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
              minWidth: 55,
            }}
          >

            <Feather
              name="map-pin"
              size={18}
              color="#6e4292"
            />

            <Text
              style={{
                color: '#6e4292',
                fontSize: 10,
                marginTop: 2,
                fontWeight: 'bold',
              }}
            >
              {distance !== null
                ? `${distance.toFixed(1)} km`
                : 'Location'}
            </Text>

          </TouchableOpacity>

        </View>
      );

    })

  )}

</View>

        
        {/* ⭐ RECOMMENDED */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Recommended
          </Text>
          {recommended.map((item) => (
            <View key={item.id} style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",

              borderRadius: 20,
              padding: 15,
              marginTop: 12,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5
            }}>

              <View>
                <Text style={{ fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#555" }}>
                  {item.desc}
                </Text>
              </View>

              <Text style={{
                backgroundColor: "rgba(110, 66, 146, 0.15)",
                color: "#6e4292",
                padding: 8,
                borderRadius: 10,
                borderWidth: 1,        // thickness of border
                borderColor: "rgba(110,66,146,0.3)",
              }}>
                {item.points} pts
              </Text>

            </View>
          ))}
        </View>

      </ScrollView>

    </View>
  )
}

const OfferCard = ({ item }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], marginRight: 14 }}>
      <TouchableOpacity activeOpacity={0.9} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={{
          width: 220, borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff',
          shadowColor: '#6e4292', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
        }}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 100 }} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={['#6e4292', '#3e1041']}
              style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}
            >
              <Feather name="gift" size={30} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          )}

          <View style={{ padding: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1a0a22' }} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontSize: 11, color: '#6e4292', fontWeight: 'bold' }}>
                {item.business?.business_name || ''}
              </Text>
              {item.expiry_date ? (
                <Text style={{ fontSize: 10, color: '#999' }}>Till {item.expiry_date}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default CHome