import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserNavigator from './UserNavigator';
import ProviderNavigator from './ProviderNavigator';
import { Icon } from 'react-native-vector-icons/Icon';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const role = useSelector((state) => state.auth.user.user_metadata.role);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Box') {
            iconName = focused ? 'box' : 'box-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      {role === 'User' && (
        <>
          <Tab.Screen
            name="Home"
            component={UserNavigator}
          />
          <Tab.Screen
            name="Bookings"
            component={UserBookingsScreen}
          />
        </>
      )}
      {role === 'Provider' && (
        <>
          <Tab.Screen
            name="Box"
            component={ProviderNavigator}
            options={{
              tabBarIcon: ({ color }) => <MaterialIcons name="business" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProviderProfileScreen}
            options={{
              tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
