import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { supabase } from '../supabase';

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOffers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          business:business_id (
            business_name,
            location,
            category
          )
        `)
        .eq('approval_status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('ALL CUSTOMER OFFERS:', data);
      console.log('ALL OFFERS ERROR:', error);

      if (error) {
        setOffers([]);
      } else {
        setOffers(data || []);
      }

      setLoading(false);
    };

    fetchAllOffers();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#EEE9F7',
      }}
    >

      {/* HEADER */}

      <View
        style={{
          paddingTop: 55,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: '#3e1041',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          All Offers
        </Text>

        <Text
          style={{
            color: '#ddd',
            fontSize: 13,
            marginTop: 5,
          }}
        >
          Explore offers from all businesses
        </Text>
      </View>

      {/* LOADING */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6e4292"
          style={{ marginTop: 30 }}
        />

      ) : offers.length === 0 ? (

        /* NO OFFERS */

        <View
          style={{
            margin: 20,
            padding: 30,
            backgroundColor: '#fff',
            borderRadius: 20,
            alignItems: 'center',
          }}
        >
          <Feather
            name="gift"
            size={30}
            color="#6e4292"
          />

          <Text
            style={{
              marginTop: 10,
              fontWeight: 'bold',
              color: '#3e1041',
            }}
          >
            No offers available
          </Text>
        </View>

      ) : (

        /* ALL OFFERS */

        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
        >
          {offers.map((item) => (

            <View
              key={item.offer_id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                overflow: 'hidden',
                marginBottom: 15,
                elevation: 4,
              }}
            >

              {/* IMAGE */}

              {item.image_url ? (

                <Image
                  source={{ uri: item.image_url }}
                  style={{
                    width: '100%',
                    height: 150,
                  }}
                  resizeMode="cover"
                />

              ) : (

                <LinearGradient
                  colors={['#6e4292', '#3e1041']}
                  style={{
                    height: 120,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather
                    name="gift"
                    size={35}
                    color="rgba(255,255,255,0.8)"
                  />
                </LinearGradient>

              )}

              {/* OFFER INFORMATION */}

              <View style={{ padding: 15 }}>

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 'bold',
                    color: '#1a0a22',
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    color: '#666',
                    fontSize: 13,
                    marginTop: 6,
                  }}
                >
                  {item.description}
                </Text>

                <Text
                  style={{
                    color: '#6e4292',
                    fontWeight: 'bold',
                    fontSize: 13,
                    marginTop: 10,
                  }}
                >
                  {item.business?.business_name || 'Business'}
                </Text>

                <Text
                  style={{
                    color: '#777',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {item.business?.category || 'Business'}
                </Text>

                <Text
                  style={{
                    color: '#777',
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  {item.business?.location || 'Location not available'}
                </Text>

                {item.expiry_date && (
                  <Text
                    style={{
                      color: '#999',
                      fontSize: 11,
                      marginTop: 7,
                    }}
                  >
                    Till {item.expiry_date}
                  </Text>
                )}

              </View>

            </View>

          ))}
        </ScrollView>

      )}

    </View>
  );
};

export default AllOffers;