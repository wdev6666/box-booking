import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import UserDashboard from "../components/UserDashboard";
import ProviderDashboard from "../components/ProviderDashboard";

export default function AppLayout() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

    if(role === "User")
      return <UserDashboard />
    if(role === "Provider")
      return <ProviderDashboard />
}
