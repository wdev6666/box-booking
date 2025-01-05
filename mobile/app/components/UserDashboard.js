import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function UserDashboard() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

    return (
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'My Bookings',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="event" size={24} color={color} />
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
