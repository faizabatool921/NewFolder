import { View, Text , Dimensions, TextInput,TouchableOpacity} from 'react-native'
import React from 'react'
import { LinearGradient} from 'expo-linear-gradient';
import { ScrollView } from 'react-native-web';
const {width , height}= Dimensions.get('window');
import Fontisto from '@expo/vector-icons/Fontisto';
const FPassword = () => {
  return (
    <ScrollView style={{ flex: 1}}>
        {/* gradient background */}
            <LinearGradient
             colors={['#2e163a', '#3e1041', '#6e4292']}
                style={{ height: height, justifyContent: "center", alignItems: "center" }}
              >
                 {/* Soft Background Circles */}
                <View style={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  backgroundColor: "#6e4292",
                  borderRadius: 100,
                  top: -50,
                  left: -50,
                  opacity: 0.2
                }} />
                 <View style={{
                  position: "absolute",
                  width: 250,
                  height: 250,
                  backgroundColor: "#6e4292",
                  borderRadius: 125,
                  bottom: -80,
                  right: -80,
                  opacity: 0.2
                }} />
                <View style={{
                          width: "90%",
                          backgroundColor: "rgba(255,255,255,0.15)",
                          borderRadius: 25,
                          padding: 20,
                        }}>
                <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            paddingHorizontal: 10,
                            marginBottom: 15
                          }}>
                             <Fontisto name="email" size={24} color="black" />
                <TextInput placeholder= "Enter Your Email" 
                style={{
                      flex: 1, height: 50, marginLeft: 10 
                }}
                /> 
                </View>
                <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={{
                              backgroundColor: "#3e1041",
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
                              Send Reset Link
                            </Text>
                          </TouchableOpacity>
                </View>
                </LinearGradient>
    
    </ScrollView>
  )
}

export default FPassword