import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
// import splashImg from "../assets/images/Splash.png"
// import '../assets/images/Splash.jpg'
const SplashScreen = ({ navigation }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/Splash.png')} // 👈 your image path
        style={{ width:'100%' , flex:1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(46,22,58,0.5)",
            "rgba(62,16,65,0.5)",
            "rgba(110,66,146,0.5)"]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{
            width: "70%",
            backgroundColor: 'rgba(228, 155, 237, 0.15)',
            borderRadius: 25,
            padding: 20,
            justifyContent: 'space-evenly'
          }}>
            <Text style={{ color: "#fff", fontSize: 30 }}>
              Smart Visit Rewards
            </Text>
            {showButtons && (
              <View style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text style={{ color: "#fff", margin: 10 }}>
                    Continue as Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("BusinessSignup")}>
                  <Text style={{ color: "#fff", margin: 10 }}>
                    Continue as Business
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

export default SplashScreen