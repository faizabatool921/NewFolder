import { View, Text } from 'react-native'
import React from 'react'
import Login from './app/Screens/Login'
import Home from './app/Screens/Home'
import Signup from './app/Screens/Signup'
import FPassword from './app/Screens/FPassword'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import BottomTab from './app/Screens/BottomTab'
import Profile from  './app/Screens/Profile'
// import Setting from './app/Screens/Setting'
// import HomePage from './app/Screens/HomePage'
import Chatbot from './app/Screens/Chatbot'
import Nearby from './app/Screens/Nearby'
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Customer Login",
          headerStyle: { backgroundColor: "#0C3B2E"},
          headerTitleStyle: {color: "#fff"}
          
        }}
         name="Login" component={Login} />
         <Stack.Screen 
         options={{
          headerShown: true,
          headerTitle: "Home",
          headerStyle: { backgroundColor: "#8B6A4E"},
          headerTitleStyle: {color: "#fff"}
        }}
         name="Home" component={BottomTab} />
           <Stack.Screen 
           options={{
          headerShown: true,
          headerTitle: "Customer Signup",
          headerStyle: { backgroundColor: "#8B6A4E"},
          headerTitleStyle: {color: "#fff"}
        }}
           name="Signup" component={Signup} />
            <Stack.Screen 
           options={{
          headerShown: true,
          headerTitle: "Forgot Password",
          headerStyle: { backgroundColor: "#0C3B2E"},
          headerTitleStyle: {color: "#fff"}
        }}
           name="FPassword" component={FPassword} />
           {/* <Stack.Screen name='Setting' component={ Setting} /> */}
            <Stack.Screen name='Profile' component={ Profile} />
            <Stack.Screen name='Chatbot' component={ Chatbot} />
             <Stack.Screen name='Nearby' component={ Nearby} />
         </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App