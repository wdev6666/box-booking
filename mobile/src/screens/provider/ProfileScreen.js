import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useNavigation();
      
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
