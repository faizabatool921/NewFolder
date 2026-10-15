import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
//store data golbally
import { useDispatch } from 'react-redux';
// Supabase client
import { supabase } from '../supabase';
const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }) => {
  // user ki value update or store krny ky liy
 const dispatch = useDispatch();
 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullname, setFullname] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


    const handleSignUp = async () => {
    if (
      email === '' ||
      phone === '' ||
      password === '' ||
      fullname === '' ||
      confirmpassword === ''
    ) {
      setError('Please fill all the input fields');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    if (password !== confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullname.trim(),
          phone: phone.trim(),
          role: 'customer',
        },
      },
    });

    if (error) {
      console.log('Signup error:', error.message);
      setError(error.message);
      return;
    }

    if (!data.user) {
      setError('User could not be created.');
      return;
    }

    // Email pehle se registered ho to Supabase error nahi deta, identities khali aati hain
    if (data.user.identities && data.user.identities.length === 0) {
      setError('This email is already registered. Please log in.');
      return;
    }

    // customers row database trigger khud bana deta hai (Step 1)
    navigation.navigate('Login', {
      email: email.trim(),
      message: 'Account created! Confirm the email we sent you, then log in.',
    });
  };
  return (
    <ScrollView style={{ flex: 1 }}>

      {/* Gradient Background */}
      <LinearGradient
        colors={['#2e163a', '#3e1041', '#6e4292']}
        style={{
          minHeight: height,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 30,
        }}
      >

        {/* Soft Background Circle */}
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            backgroundColor: '#6e4292',
            borderRadius: 100,
            top: -50,
            left: -50,
            opacity: 0.2,
          }}
        />

        {/* Soft Background Circle */}
        <View
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            backgroundColor: '#6e4292',
            borderRadius: 125,
            bottom: -80,
            right: -80,
            opacity: 0.2,
          }}
        />

        {/* Signup Card */}
        <View
          style={{
            width: '90%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 25,
            padding: 20,
          }}
        >

          {/* Title */}
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
            Reward
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginBottom: 20,
            }}
          >
            Welcome 👋
          </Text>

          {/* Error Message */}
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

          {/* Full Name Input */}
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
            <FontAwesome5
              name="user"
              size={24}
              color="black"
            />

            <TextInput
              placeholder="Full Name"
              value={fullname}
              onChangeText={setFullname}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          {/* Email Input */}
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
            <Fontisto
              name="email"
              size={24}
              color="black"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>
          
{/* Phone Number Input */}
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
  <Fontisto
    name="phone"
    size={24}
    color="black"
  />

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


          {/* Password Input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
            }}
          >
            <MaterialIcons
              name="password"
              size={24}
              color="black"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          {/* Confirm Password Input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginTop: 15,
            }}
          >
            <MaterialIcons
              name="wifi-password"
              size={24}
              color="black"
            />

            <TextInput
              placeholder="Confirm Password"
              value={confirmpassword}
              onChangeText={setConfirmpassword}
              secureTextEntry={true}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 10,
              }}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={{
              backgroundColor: '#3e1041',
              marginTop: 20,
              padding: 15,
              borderRadius: 15,
              alignItems: 'center',
              shadowColor: '#000',
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Signup
            </Text>
          </TouchableOpacity>

          {/* Login */}
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: 15,
            }}
          >
            Already have an account?{' '}

            <Text
              onPress={() => navigation.navigate('Login')}
              style={{
                color: '#FF9A44',
                fontWeight: 'bold',
              }}
            >
              Login
            </Text>
          </Text>

        </View>
      </LinearGradient>

    </ScrollView>
  );
};

export default Signup;