import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View } from 'react-native'
import BottomTab from './app/Screens/BottomTab'
import Chatbot from './app/Screens/Chatbot'
import FPassword from './app/Screens/FPassword'
import Login from './app/Screens/Login.js'
import Profile from './app/Screens/Profile'
import Reward from './app/Screens/Reward'
import Signup from './app/Screens/Signup'
// import Nearby from './app/Screens/Nearby'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './app/redux/store/index.js'
import AllBusinesses from './app/Screens/AllBusinesses'
import AllOffers from './app/Screens/AllOffers'
import BBottomTab from './app/Screens/BBottomTab'
import BProfile from './app/Screens/BProfile'
import BSignup from './app/Screens/BSignup'
import BusinessDetails from './app/Screens/BusinessDetails.js'
import CardSetup from './app/Screens/CardSetup.js'
import CreateOffers from './app/Screens/CreateOffers'
import CustomerDetails from './app/Screens/CustomerDetails'
import Scanner from './app/Screens/Scanner'
import SplashScreen from './app/Screens/SplashScreen'
import Visits from './app/Screens/Visits'

const Stack = createNativeStackNavigator()

const Customer = () => (
  <Stack.Navigator initialRouteName='BottomTab'>
    <Stack.Screen
      options={{
        headerShown: false,
        // headerTitle: "",
        headerStyle: { backgroundColor: "#2e163a" },
        headerTitleStyle: { color: "#fff" }
      }}
      name="BottomTab" component={BottomTab} />
    <Stack.Screen
      name="AllOffers"
      component={AllOffers}
    />

    <Stack.Screen
      name="AllBusinesses"
      component={AllBusinesses}
    />

    <Stack.Screen name='Profile' component={Profile} />

    <Stack.Screen name='Chatbot' component={Chatbot} />
    <Stack.Screen name='Reward' component={Reward} />
  </Stack.Navigator>

)


const Business = () => (

  <Stack.Navigator initialRouteName='BBottomTab'>
    <Stack.Screen
      options={{
        headerShown: false,
        // headerTitle: "",
        headerStyle: { backgroundColor: "#2e163a" },
        headerTitleStyle: { color: "#fff" }
      }}
      name="BBottomTab" component={BBottomTab} />

    <Stack.Screen name="CreateOffers" component={CreateOffers} options={{ headerShown: false }} />
    <Stack.Screen options={{ headerTitle: " Business Profile" }} name='BusinessProfile' component={BProfile} />
    <Stack.Screen name='CardSetup' component={CardSetup} />
    <Stack.Screen name='CustomerVisits' component={Visits} />
    <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
    <Stack.Screen name='Scanner' component={Scanner} />

  </Stack.Navigator>

)

const Auth = () => (
  <Stack.Navigator initialRouteName='Login'>
    <Stack.Screen
      options={{ headerShown: false }}
      name="Login" component={Login} />

    <Stack.Screen
      options={{ headerShown: false }}
      name="SplashScreen" component={SplashScreen} />

    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: "CustomerSignup",
        headerStyle: { backgroundColor: "#2e163a" },
        headerTitleStyle: { color: "#fff" }
      }}
      name="Signup" component={Signup} />

    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: "ForgotPassword",
        headerStyle: { backgroundColor: "#2e163a" },
        headerTitleStyle: { color: "#fff" }
      }}
      name="FPassword" component={FPassword} />

    <Stack.Screen
      name="BusinessSignup"
      component={BSignup}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BusinessDetails"
      component={BusinessDetails}
      options={{ headerShown: false }}
    />

  </Stack.Navigator>
)



const AppContent = () => {

  const { user, role } = useSelector((state) => state.home);
  return (
    <NavigationContainer>

      {user?._id ? (
        user.role === "Business" ? <Business /> : <Customer />
      ) : (
        <Auth />)}
    </NavigationContainer>
  )
}
const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </View>
  )
}

export default App