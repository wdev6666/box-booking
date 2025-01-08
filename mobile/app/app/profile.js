import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../src/store/slices/authSlice';
import { useRouter } from 'expo-router';

export default function AppScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
      
  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    router.replace('/auth/login'); // Redirect to login page
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
