
import { AntDesign } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Slices/HomeDataSlice.js';
import { supabase } from '../supabase';

const { width, height } = Dimensions.get('window');

const BLogin = ({ navigation }) => {
  const dispatch = useDispatch();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const handleLogin = async () => {
  if (email === '' || password === '') {
    setError('Please fill all the input fields');
    return;
  }

  setError('');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password,
  });

  if (error) {
    console.log('Login error:', error.message);
    setError(error.message);
    return;
  }
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!existingProfile) {
    const meta = data.user.user_metadata || {};
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        role: 'Business',
        full_name: meta.full_name || '',
        owner_name: meta.owner_name || '',
        email: data.user.email,
        business_name: meta.business_name || '',
        phone: meta.phone || '',
        category: meta.category || '',
      });

    if (profileError) {
      console.log('Profile creation error:', profileError.message);
    }
  }
  dispatch(
    setUser({
      _id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || '',
      role: 'Business',
    })
  );
};
  return (
    <ScrollView style={{ flex: 1 }}>

      {/* gradient background */}
      <LinearGradient
        colors={['#2e163a', '#3e1041', '#6e4292']}
        style={{ height: height, justifyContent: "center", alignItems: "center" }}
      >
        {/* Soft Background Circles */}
        <View style={{
          position: "absolute",
          width: 200, height: 200,
          backgroundColor: "#ad92c4",
          borderRadius: 100,
          top: -50, left: -50,
          opacity: 0.2
        }} />
        <View style={{
          position: "absolute",
          width: 250, height: 250,
          backgroundColor: "#ad92c4",
          borderRadius: 125,
          bottom: -80, right: -80,
          opacity: 0.2
        }} />

        {/* Login Card */}
        <View style={{
          width: "90%",
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 25,
          padding: 20,
        }}>

          {/* Title */}
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#fff", textAlign: "center" }}>
            SmartVisit
          </Text>
          <Text style={{ fontSize: 18, color: "#FF9A44", textAlign: "center", marginBottom: 15 }}>
            Business
          </Text>
          <Text style={{ textAlign: "center", color: "#fff", marginBottom: 20 }}>
            Welcome Back 👋
          </Text>
{error !== '' && (
  <Text style={{ color: '#FFD6D6', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>
    {error}
  </Text>
)}
          {/* Email Input */}
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: "#fff", borderRadius: 12,
            paddingHorizontal: 10, marginBottom: 15
          }}>
            <Fontisto name="email" size={24} color="black" />
            <TextInput
              placeholder="Business Email"
              keyboardType="email-address"
              
  value={email}
  onChangeText={setEmail}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          {/* Password Input */}
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: "#fff", borderRadius: 12,
            paddingHorizontal: 10
          }}>
            <MaterialIcons name="password" size={24} color="black" />
            <TextInput
              placeholder="Password"
  secureTextEntry={true}
  value={password}
  onChangeText={setPassword}
            
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => navigation.navigate('FPassword')}>
            <Text style={{ textAlign: 'right', marginRight: "4%", marginTop: "3%", color: "#fff" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: "#3e1041", marginTop: 10,
              padding: 15, borderRadius: 15,
              alignItems: "center", shadowColor: "#000", elevation: 5
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Login</Text>
          </TouchableOpacity>

          {/* Signup */}
          <Text style={{ textAlign: "center", color: "#fff", marginTop: 15 }}>
            Don't have an account?
            <Text
              onPress={() => navigation.navigate('BusinessSignup')}
              style={{ color: "#FF9A44", fontWeight: "bold" }}
            > Sign Up</Text>
          </Text>

          {/* ── Divider ── */}
          <View style={{
            flexDirection: "row", alignItems: "center",
            marginTop: 20, marginBottom: 15
          }}>
            <View style={{ flex: 1, height: 0.5, backgroundColor: "rgba(255,255,255,0.4)" }} />
            <Text style={{ color: "rgba(255,255,255,0.7)", marginHorizontal: 10, fontSize: 12 }}>
              or continue with
            </Text>
            <View style={{ flex: 1, height: 0.5, backgroundColor: "rgba(255,255,255,0.4)" }} />
          </View>

          {/* Social Buttons */}
          <View style={{ flexDirection: "row", gap: 10 }}>

            {/* Google */}
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flex: 1,
                 flexDirection: "row", 
                 alignItems: "center", 
                 justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12,
                paddingVertical: 10, gap: 6,
                borderWidth: 0.5, borderColor: "rgba(255,255,255,0.3)"
              }}
            >
              <AntDesign name="google" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>Google</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flex: 1,
                 flexDirection: "row",
                 alignItems: "center", 
                 justifyContent: "center",
                backgroundColor: "$",
                 borderRadius: 12,
                paddingVertical: 10, 
                gap: 6,
                borderWidth: 0.5, 
                borderColor: "rgba(255,255,255,0.3)"
              }}
            >
              <AntDesign name="apple1" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>Apple</Text>
            </TouchableOpacity>

          </View>

        </View>
      </LinearGradient>

    </ScrollView>
  )
}

export default BLogin