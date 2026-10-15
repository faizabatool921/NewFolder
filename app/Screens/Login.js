import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setBusinessId, setUser } from '../redux/Slices/HomeDataSlice.js';
import { supabase } from '../supabase';

import { registerPushToken } from '../utils/registerPushToken';


const { height } = Dimensions.get('window');

const Login = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    route?.params?.message || ''
  );

  useEffect(() => {
    if (route?.params?.email) setEmail(route.params.email);
    if (route?.params?.message) setError(route.params.message);
  }, [route?.params?.email, route?.params?.message]);

const handleLogin = async () => {
  try {
    if (!email.trim() || !password) {
      setError('Please fill all the input fields');
      return;
    }

    setError('');

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

    if (loginError) {
      console.log('Login error:', loginError.message);
      setError(loginError.message);
      return;
    }

    if (!data.user) {
      setError('Unable to log in. Please try again.');
      return;
    }

    const meta = data.user.user_metadata || {};
    const role = meta.role || 'customer';

    // Customer ke phone ka push token register karo.
    // Business login ko is process se exclude rakho.
    if (role !== 'Business') {
      await registerPushToken(data.user.id);
    }


    // BUSINESS LOGIN
    if (role === 'Business') {
      const {
        data: existingBusiness,
        error: businessFetchError,
      } = await supabase
        .from('business')
        .select('business_id, is_active, approval_status')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (businessFetchError) {
        console.log(
          'Business fetch error:',
          businessFetchError.message
        );

        await supabase.auth.signOut();
        setError(
          'Unable to check business status: ' +
          businessFetchError.message
        );
        return;
      }

      // Create business record if it does not exist
      if (!existingBusiness) {
        const {
          data: newBusiness,
          error: businessError,
        } = await supabase
          .from('business')
          .insert({
            user_id: data.user.id,
            business_name: meta.business_name || '',
            owner_name: meta.owner_name || '',
            phone: meta.phone || '',
            location: meta.location || '',
            latitude: meta.latitude ?? null,
            longitude: meta.longitude ?? null,
            category: meta.category || '',
            approval_status: 'pending',
            is_active: false,
          })
          .select(
            'business_id, is_active, approval_status'
          )
          .single();

        if (businessError) {
          console.log(
            'Business creation error:',
            businessError.message
          );

          await supabase.auth.signOut();
          setError(businessError.message);
          return;
        }

        dispatch(setBusinessId(newBusiness.business_id));

        await supabase.auth.signOut();

        setError(
          'Your business account is waiting for admin approval.'
        );
        return;
      }

      // Check admin approval
      if (existingBusiness.approval_status !== 'approved') {
        await supabase.auth.signOut();

        setError(
          'Your business account is waiting for admin approval.'
        );
        return;
      }

      // Check active status
      if (existingBusiness.is_active !== true) {
        await supabase.auth.signOut();

        setError(
          'Your business account is approved but inactive. Please contact the administrator.'
        );
        return;
      }

      dispatch(setBusinessId(existingBusiness.business_id));
    }

    // SAVE LOGGED-IN USER
    dispatch(
      setUser({
        _id: data.user.id,
        email: data.user.email,
        full_name:
          role === 'Business'
            ? meta.owner_name || ''
            : meta.full_name || '',
        role: role,
      })
    );

 
  } catch (err) {
    console.log('Login error message:', err?.message);
    console.log('Login error details:', JSON.stringify(err));

    setError(
      err?.message ||
      'Something went wrong during login. Please try again.'
    );
  }
};

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2e163a', '#3e1041', '#6e4292']}
        style={{
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
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
            Reward
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginBottom: 20,
            }}
          >
            Welcome Back 👋
          </Text>

          {error !== '' && (
            <Text
              style={{
                color: '#FFD6D6',
                textAlign: 'center',
                marginBottom: 10,
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
            <Fontisto name="email" size={24} color="black" />

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

          <TouchableOpacity
            onPress={() => navigation.navigate('FPassword')}
          >
            <Text
              style={{
                textAlign: 'right',
                marginRight: '4%',
                marginTop: '3%',
                color: '#fff',
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: '#3e1041',
              marginTop: 10,
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
              Login
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: 15,
            }}
          >
            Don't have an account?

            <Text
              onPress={() => navigation.navigate('SplashScreen')}
              style={{
                color: '#FF9A44',
                fontWeight: 'bold',
              }}
            >
              {' '}
              Sign Up
            </Text>
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default Login;