import { View, Text, ScrollView,Dimensions,TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient} from 'expo-linear-gradient';
import { Ionicons} from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

const {width , height}= Dimensions.get('window');
const Signup = ( {navigation}) => {
  return (
   <ScrollView style={{ flex: 1}}>

    {/* gradient background */}
    <LinearGradient
     colors={['#6D9773', '#0C3B2E']}
        style={{ height: height, justifyContent: "center", alignItems: "center" }}
      >
         {/* Soft Background Circles */}
        <View style={{
          position: "absolute",
          width: 200,
          height: 200,
          backgroundColor: "#34D399",
          borderRadius: 100,
          top: -50,
          left: -50,
          opacity: 0.2
        }} />
         <View style={{
          position: "absolute",
          width: 250,
          height: 250,
          backgroundColor: "#047857",
          borderRadius: 125,
          bottom: -80,
          right: -80,
          opacity: 0.2
        }} />
         {/* Signup Card */}
        <View style={{
          width: "90%",
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 25,
          padding: 20,
        }}>
           {/* Title */}
          <Text style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center"
          }}>
            SmartVisit
          </Text>

          <Text style={{
            fontSize: 18,
            color: "#FFBA00",
            textAlign: "center",
            marginBottom: 15
          }}>
            Reward
          </Text>

          <Text style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: 20
          }}>
            Welcome  👋
          </Text>
          {/* Name Input */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 10,
            marginBottom: 15
          }}>
            {/* <Ionicons name="mail-outline" size={20} color="#6D9773" /> */}
            <FontAwesome5 name="user" size={24} color="black" />
            <TextInput
              placeholder="Name"
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>
           {/* Email Input */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 10,
            marginBottom: 15
          }}>
            {/* <Ionicons name="mail-outline" size={20} color="#6D9773" /> */}
              <Fontisto name="email" size={24} color="black" />
            <TextInput
              placeholder="Email"
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
          </View>
           {/* Password Input */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 10
          }}>
            {/* <Ionicons name="lock-closed-outline" size={20} color="#6D9773" /> */}
            
          <MaterialIcons name="password" size={24} color="black" />
            <TextInput
              placeholder="Password"
              // secureTextEntry={!showPassword}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
        </View>
    
         {/* Confirm Password Input */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 10,
            marginTop: 15
          }}>
            {/* <Ionicons name="lock-closed-outline" size={20} color="#6D9773" /> */}
            <MaterialIcons name="wifi-password" size={24} color="black" />
            <TextInput
              placeholder="Confirm Password"
              // secureTextEntry={!showPassword}
              style={{ flex: 1, height: 50, marginLeft: 10 }}
            />
        </View>
        
           {/* Signup Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{
              backgroundColor: "#0C3B2E",
              marginTop: 20,
              padding: 15,
              borderRadius: 15,
              alignItems: "center",
              shadowColor: "#000",
              elevation: 5
            }}
          >
            <Text style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16
            }}>
              Signup
            </Text>
          </TouchableOpacity>
           {/* Signup */}
          <Text style={{
            textAlign: "center",
            color: "#fff",
            marginTop: 15
          }}>
            Already have an account? 
            <Text 
              onPress={() => navigation.navigate('Login')}
              style={{ color: "#FFBA00", fontWeight: "bold" }}
            >
              {" "}Login
            </Text>
          </Text>

        </View>
      </LinearGradient>

   </ScrollView>
  )
}

export default Signup