import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
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

const { width, height } = Dimensions.get('window');

const BSignup = ({ navigation }) => {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (
      ownerName === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      setError('Please fill all the input fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    navigation.navigate('BusinessDetails', {
      ownerName: ownerName.trim(),
      email: email.trim(),
      password: password,
    });
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
        <View style={{
          position: 'absolute', width: 200, height: 200,
          backgroundColor: '#ad92c4', borderRadius: 100,
          top: -50, left: -50, opacity: 0.2,
        }} />
        <View style={{
          position: 'absolute', width: 250, height: 250,
          backgroundColor: '#ad92c4', borderRadius: 125,
          bottom: -80, right: -80, opacity: 0.2,
        }} />

        <View style={{
          width: '90%',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 25,
          padding: 20,
        }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
            SmartVisit
          </Text>
          <Text style={{ fontSize: 18, color: '#FF9A44', textAlign: 'center', marginBottom: 15 }}>
            Business
          </Text>
          <Text style={{ textAlign: 'center', color: '#fff', marginBottom: 5 }}>
            Step 1 of 3 — Account Info
          </Text>
          <Text style={{ textAlign: 'center', color: '#fff', marginBottom: 20 }}>
            Create Business Account ✨
          </Text>

          {error !== '' && (
            <Text style={{ color: '#FFD6D6', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' }}>
              {error}
            </Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, marginBottom: 15 }}>
            <FontAwesome name="user" size={22} color="black" />
            <TextInput
              placeholder="Owner Name"
              value={ownerName}
              onChangeText={setOwnerName}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, marginBottom: 15 }}>
            <Fontisto name="email" size={24} color="black" />
            <TextInput
              placeholder="Business Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, marginBottom: 15 }}>
            <MaterialIcons name="password" size={24} color="black" />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10 }}>
            <MaterialIcons name="password" size={24} color="black" />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: '#3e1041', marginTop: 20,
              padding: 15, borderRadius: 15,
              alignItems: 'center', shadowColor: '#000', elevation: 5,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Next</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', color: '#fff', marginTop: 15 }}>
            Already have an account?
            <Text onPress={() => navigation.navigate('Login')} style={{ color: '#FF9A44', fontWeight: 'bold' }}>
              {' '}Login
            </Text>
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default BSignup;