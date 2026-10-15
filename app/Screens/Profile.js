import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  return (
    <LinearGradient
      colors={["#2e163a", "#3e1041", "#6e4292"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontSize: 20 }}>
        Profile Screen
      </Text>
    </LinearGradient>
  );
};

export default Profile;