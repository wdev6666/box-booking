import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function AppLayout() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

  if (role === 'User') {
    return <Stack screenOptions={{ headerShown: false }} initialRouteName="/user/home" />;
  }

  if (role === 'Provider') {
    return <Stack screenOptions={{ headerShown: false }} initialRouteName="/provider/box" />;
  }

  return null; // Fallback in case role is undefined
}
