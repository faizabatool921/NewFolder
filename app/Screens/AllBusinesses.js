import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { supabase } from '../supabase';

const AllBusinesses = () => {

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBusinesses = async () => {

      setLoading(true);

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

      console.log('ALL BUSINESSES:', data);
      console.log('ALL BUSINESSES ERROR:', error);

      if (error) {
        setBusinesses([]);
      } else {
        setBusinesses(data || []);
      }

      setLoading(false);
    };

    fetchBusinesses();

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
          All Businesses
        </Text>

        <Text
          style={{
            color: '#ddd',
            fontSize: 13,
            marginTop: 5,
          }}
        >
          Explore registered businesses
        </Text>

      </View>

      {/* CONTENT */}

      {loading ? (

        <ActivityIndicator
          size="large"
          color="#6e4292"
          style={{ marginTop: 30 }}
        />

      ) : businesses.length === 0 ? (

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
            name="map-pin"
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
            No businesses available
          </Text>

        </View>

      ) : (

        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
        >

          {businesses.map((item) => (

            <View
              key={item.business_id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 18,
                padding: 16,
                marginBottom: 12,
                elevation: 3,
              }}
            >

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >

                {/* ICON */}

                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 15,
                    backgroundColor:
                      'rgba(110,66,146,0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >

                  <Feather
                    name="briefcase"
                    size={23}
                    color="#6e4292"
                  />

                </View>

                {/* BUSINESS DETAILS */}

                <View style={{ flex: 1 }}>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#1a0a22',
                    }}
                  >
                    {item.business_name}
                  </Text>

                  <Text
                    style={{
                      color: '#6e4292',
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    {item.category || 'Business'}
                  </Text>

                  <Text
                    style={{
                      color: '#777',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {item.location ||
                      'Location not available'}
                  </Text>

                </View>

              </View>

            </View>

          ))}

        </ScrollView>

      )}

    </View>
  );
};

export default AllBusinesses;