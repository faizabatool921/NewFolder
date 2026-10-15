import { EvilIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import BHome from './BHome';
import BProfile from './BProfile';
import BRewards from './CardSetup';
import Scanner from './Scanner';
import Visits from './Visits';

const Tab = createBottomTabNavigator();
const BBottomTab = () => {
  return (
    <View
      style={{ flex: 1 }}>

      {/* Bottom Navigation */}
      {/* <View style={{ 
        position:'absolute', 
        bottom:0, 
        left:0, 
        right:0, 
        backgroundColor:'rgba(18,8,48,0.97)', 
        flexDirection:'row', 
        justifyContent:'space-around', 
        paddingVertical:10, 
        paddingBottom:18, 
        borderTopWidth:0.5, 
        borderTopColor:'rgba(255,255,255,0.1)' }}> */}
      <Tab.Navigator initialRouteName='Business Home'>
        <Tab.Screen
          name="Business Home"
          component={BHome}
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={28} color="#432001" />
            )
          }}
        />
        <Tab.Screen
          name="Business Card"
          component={BRewards}
          options={{
            headerShown: false,
            title: 'Card',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="card-giftcard" size={26} color="#432001" />
            )
          }}
        />
        <Tab.Screen
          name="Scanner"
          component={Scanner}
          options={{
            headerShown: false,
            title: 'Scan',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="qr-code-scanner" size={32} color="#3e1041" />
            )
          }}
        />
        <Tab.Screen
          name="Customer Visits"
          component={Visits}
          options={{
            headerShown: false,
            title: 'Visits',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={22} color="#432001" />
            )
          }}
        />
        <Tab.Screen
          name="Business Profile"
          component={BProfile}
          options={{
            headerShown: false,
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <EvilIcons name="user" size={32} color="#432001" />
            )
          }}
        />
      </Tab.Navigator>

    </View>

  )
}

export default BBottomTab