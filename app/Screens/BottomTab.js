import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Profile from './Profile'
// import Setting from './Setting';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Home from './Home';
import Chatbot from './Chatbot';
import Nearby from './Nearby';
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <View style={{flex:1}}>
    
           
      <Tab.Navigator initialRouteName='Home'>
        {/* ✅ HOME SCREEN */}
     <Tab.Screen 
       name="Home" 
       component={Home}
       options={{
       headerShown: false,
       tabBarIcon: ({ color }) => (
        <Feather name="home" size={24} color="black" />
      )
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
            
        <Tab.Screen name="Nearby" component={Nearby}
         options={{
           headerShown: false,
           headerTintColor: "#fff",
           headerStyle: { backgroundColor: "#36543a" },
           tabBarIcon: ({ color, focused}) => (
            <Feather name="map-pin" size={24} color="black" />
           )
           }}/>
         
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