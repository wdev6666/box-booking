import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function ProviderDashboard() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

    return (
      <Tabs>
        <Tabs.Screen
          name="box"
          options={{
            title: 'My Boxes',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="inventory" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    );
}
