import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View, } from 'react-native';
import Profile from './Profile';
// import Setting from './Setting';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import CHome from './CHome';
import Chatbot from './Chatbot';
// import Nearby from './Nearby';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from "../supabase";
import Reward from './Reward';
const Tab = createBottomTabNavigator();


const BottomTab = () => {
  // QR Popup status 
  const [showQR, setShowQR] = useState(false);
  const [customerId, setCustomerId] = useState(null);
const [customerName, setCustomerName] = useState("");
const [loadingQR, setLoadingQR] = useState(false);

useEffect(() => {
  getCustomerData();
}, []);

const getCustomerData = async () => {
  try {
    setLoadingQR(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user) {
  setCustomerId(user.id);
}

    if (error) {
      console.log("Customer error:", error.message);
      return;
    }

    if (user) {
      setCustomerId(user.id);

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Customer";

      setCustomerName(name);

      console.log("Logged-in Customer ID:", user.id);
    }
  } catch (error) {
    console.log("Error:", error);
  } finally {
    setLoadingQR(false);
  }
};

  return (
    <View style={{flex:1}}>
     <Modal
  visible={showQR}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowQR(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 28,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: "#ddd",
          borderRadius: 2,
          marginBottom: 18,
        }}
      />

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#2e163a",
        }}
      >
        Your Reward QR Code
      </Text>

      <Text
        style={{
          color: "#888",
          marginTop: 5,
          marginBottom: 22,
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Show this to the cashier to earn points
      </Text>

      <View
        style={{
          backgroundColor: "#f8f5ff",
          padding: 20,
          borderRadius: 20,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(110,66,146,0.15)",
        }}
      >
        {loadingQR ? (
          <View
            style={{
              width: 190,
              height: 190,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color="#6e4292"
            />

            <Text style={{ marginTop: 10 }}>
              Loading QR...
            </Text>
          </View>
        ) : customerId ? (
          <>
            <QRCode
              value={JSON.stringify({
                type: "customer",
                customer_id:  customerId,
              })}
              size={190}
              color="#2e163a"
              backgroundColor="#f8f5ff"
            />

            <Text
              style={{
                fontWeight: "bold",
                color: "#2e163a",
                marginTop: 12,
                fontSize: 14,
              }}
            >
              {customerName}
            </Text>

            <Text
              style={{
                color: "#777",
                fontSize: 10,
                marginTop: 5,
                textAlign: "center",
                maxWidth: 220,
              }}
              numberOfLines={2}
            >
              Customer ID: {customerId}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgba(110,66,146,0.1)",
                  color: "#4a2870",
                  fontSize: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                120 pts
              </Text>

              <Text
                style={{
                  backgroundColor: "rgba(180,130,0,0.1)",
                  color: "#7a5500",
                  fontSize: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                Gold Tier
              </Text>
            </View>
          </>
        ) : (
          <Text
            style={{
              width: 190,
              height: 190,
              textAlign: "center",
              textAlignVertical: "center",
              color: "#6e4292",
            }}
          >
            Customer ID not found.
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setShowQR(false)}
        style={{
          marginTop: 22,
          backgroundColor: "#6e4292",
          borderRadius: 14,
          paddingVertical: 13,
          paddingHorizontal: 70,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <Tab.Navigator initialRouteName='CustomerHome'>
        {/* ✅ HOME SCREEN */}
     <Tab.Screen 
       name="CustomerHome" 
       component={CHome}
       options={{
       headerShown: false,
        title: 'Home',
       tabBarIcon: ({ color }) => (
        <Feather name="home" size={24} color="black" />
      )
    }}
  />
   <Tab.Screen 
       name="Reward" 
       component={Reward}
       options={{
       headerShown: false,
       tabBarIcon: ({ color }) => (
        <Feather name="gift" size={24} color="black" />
      )
    }}
  />
   {/* ✅ QR TAB — middle button, opens modal in CHome */}
        <Tab.Screen
          name="QRScan"
          component={CHome}       // stays on home, just opens the popup
          options={{
            headerShown: false,
            title: 'My QR',
            tabBarIcon: () => (
                <View style={{
                width: 42,
                height: 42,
                borderRadius: 16,
                backgroundColor: '#6e4292',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,   // lifts it above the bar
                elevation: 6,
                shadowColor: '#6e4292',
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}>
                <Feather name="grid" size={24} color="#fff" />
              </View>
            ),
            // ✅ When this tab is pressed, open QR modal instead of navigating
            tabBarButton: (props) => (
              <TouchableOpacity
              style={props.style}
                onPress={() => setShowQR(true)}  // OUR press — opens modal instead of navigating
              >
                {/* show the icon + label that was already there */}
                {props.children}             
              </TouchableOpacity>  
            
            ),
          }}
        />
        <Tab.Screen name="Chatbot" component={Chatbot}
       options={{
           headerShown: false,
          //  headerTintColor: "#fff",
          //  headerStyle: { backgroundColor: "#B46617" },
           tabBarIcon:({ color, focused}) => (
          <Feather name="message-circle" size={24} color="black" /> )
            }}/>
            
            
        {/* <Tab.Screen name="Nearby" component={Nearby}
         options={{
           headerShown: false,
           headerTintColor: "#fff",
           headerStyle: { backgroundColor: "#36543a" },
           tabBarIcon: ({ color, focused}) => (
            <Feather name="map-pin" size={24} color="black" />
           )
           }}/> */}
         
        <Tab.Screen name="Profile" component={Profile}
         options={{
           headerShown: false,
           headerTintColor: "#fff",
           headerStyle: { backgroundColor: "#36543a" },
           tabBarIcon: ({ color, focused}) => (
            <EvilIcons name="user" size={24} color="black" />
           )
           }}/> 
            
       
      </Tab.Navigator>
    
    
    </View>
  )
}

export default BottomTab