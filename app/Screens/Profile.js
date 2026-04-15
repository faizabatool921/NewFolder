import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  return (
    <LinearGradient
      colors={['#6D9773', '#0C3B2E']}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontSize: 20 }}>
        Profile Screen
      </Text>
    </LinearGradient>
  );
};

export default Profile;