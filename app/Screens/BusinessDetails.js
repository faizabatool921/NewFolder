import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../supabase';

const { height } = Dimensions.get('window');

const businessCategories = [
  'Cafe',
  'Restaurant',
  'Salon',
  'Gym',
  'Retail Store',
  'Pharmacy',
  'Bakery',
  'Hotel',
  'Spa',
  'Other',
];

const BusinessDetails = ({ navigation, route }) => {
  const { ownerName, email, password } = route.params;

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinishSignup = async () => {
  if (
    businessName.trim() === '' ||
    phone.trim() === '' ||
    location.trim() === '' ||
    selectedCategory === ''
  ) {
    setError('Please fill all the input fields');
    return;
  }

  setError('');
  setLoading(true);

  try {
    // =========================================
    // STEP 1: Convert business location to
    // latitude and longitude
    // =========================================

    const query = `${location.trim()}, Pakistan`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=pk&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'SmartVisitRewards/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Location service is not available');
    }

    const results = await response.json();

    console.log('Business Location:', location);
    console.log('Location Search Result:', results);

    if (!results || results.length === 0) {
      setError(
        'Location could not be found. Please enter a valid area or address.'
      );
      setLoading(false);
      return;
    }

    const latitude = parseFloat(results[0].lat);
    const longitude = parseFloat(results[0].lon);

    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Could not get valid coordinates for this location.');
      setLoading(false);
      return;
    }

    // =========================================
    // STEP 2: Create Auth user
    // Coordinates are stored in metadata
    // =========================================
const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password: password,

  options: {
    data: {
      owner_name: ownerName.trim(),
      role: 'Business',

      business_name: businessName.trim(),
      phone: phone.trim(),
      location: location.trim(),

      latitude: latitude,
      longitude: longitude,

      category: selectedCategory,
    },
  },
});

    console.log(
      'Signup Response:',
      JSON.stringify({ data, error })
    );

    if (error) {
      console.log('Signup Error:', error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
  setError('User could not be created.');
  setLoading(false);
  return;
}

// =========================================
// STEP 3: Save business data in business table
// =========================================

const { data: businessData, error: businessError } = await supabase
  .from('business')
  .insert([
    {
      business_name: businessName.trim(),
      owner_name: ownerName.trim(),
      phone: phone.trim(),
      location: location.trim(),

      latitude: latitude,
      longitude: longitude,

      category: selectedCategory,

      approval_status: 'pending',
      is_active: false,
    },
  ])
  .select()
  .single();

console.log('BUSINESS TABLE DATA:', businessData);
console.log('BUSINESS TABLE ERROR:', businessError);

if (businessError) {
  console.log(
    'Business table insert error:',
    businessError.message
  );

  setError(
    'Account created but business information could not be saved.'
  );

  setLoading(false);
  return;
}

console.log('Business saved successfully:', {
  businessName: businessName.trim(),
  location: location.trim(),
  latitude,
  longitude,
});

setLoading(false);

navigation.navigate('Login', {
  message:
    'Account created! Please check your email to verify your account, then login.',
});
      

  } catch (err) {
    console.log('Location/Signup Error:', err);

    setError(
      'Could not process the business location. Please try again.'
    );

    setLoading(false);
  }
};

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2e163a', '#3e1041', '#6e4292']}
        style={{
          minHeight: height,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 40,
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            backgroundColor: '#ad92c4',
            borderRadius: 100,
            top: -50,
            left: -50,
            opacity: 0.2,
          }}
        />

        <View
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            backgroundColor: '#ad92c4',
            borderRadius: 125,
            bottom: -80,
            right: -80,
            opacity: 0.2,
          }}
        />

        <View
          style={{
            width: '90%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 25,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            SmartVisit
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: '#FF9A44',
              textAlign: 'center',
              marginBottom: 15,
            }}
          >
            Business
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginBottom: 5,
            }}
          >
            Step 2 of 2 — Business Info
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginBottom: 20,
            }}
          >
            Tell us about your business 🏢
          </Text>

          {error !== '' && (
            <Text
              style={{
                color: '#FFD6D6',
                textAlign: 'center',
                marginBottom: 15,
                fontWeight: 'bold',
              }}
            >
              {error}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginBottom: 15,
            }}
          >
            <FontAwesome name="building" size={22} color="black" />

            <TextInput
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginBottom: 15,
            }}
          >
            <FontAwesome name="phone" size={22} color="black" />

            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginBottom: 15,
            }}
          >
            <MaterialIcons
              name="location-on"
              size={24}
              color="black"
            />

            <TextInput
              placeholder="Business Location"
              value={location}
              onChangeText={setLocation}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowCategories(!showCategories)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginBottom: 5,
              height: 50,
            }}
          >
            <MaterialIcons
              name="category"
              size={24}
              color="black"
            />

            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                color: selectedCategory ? '#000' : '#aaa',
                fontSize: 15,
              }}
            >
              {selectedCategory || 'Select Business Category'}
            </Text>

            <MaterialIcons
              name={
                showCategories
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>

          {showCategories && (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                marginBottom: 15,
                overflow: 'hidden',
              }}
            >
              {businessCategories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategories(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth:
                      index === businessCategories.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: '#e0e0e0',
                    backgroundColor:
                      selectedCategory === item
                        ? '#f0ecff'
                        : '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        selectedCategory === item
                          ? '#3e1041'
                          : '#333',
                      fontWeight:
                        selectedCategory === item
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!showCategories && (
            <View style={{ marginBottom: 10 }} />
          )}

          <TouchableOpacity
            onPress={handleFinishSignup}
            disabled={loading}
            style={{
              backgroundColor: '#3e1041',
              marginTop: 10,
              padding: 15,
              borderRadius: 15,
              alignItems: 'center',
              shadowColor: '#000',
              elevation: 5,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {loading ? 'Creating Account...' : 'Finish Signup'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default BusinessDetails;