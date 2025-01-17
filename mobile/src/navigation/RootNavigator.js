import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import BoxesScreen from '../screens/user/BoxesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import BookingsScreen from '../screens/user/BookingsScreen';
import BoxScreen from '../screens/provider/BoxScreen';
import ProviderProfileScreen from '../screens/provider/ProfileScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Stack Navigators
const AuthStack = createStackNavigator();
const UserTab = createBottomTabNavigator();
const ProviderTab = createBottomTabNavigator();

const RootStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const UserNavigator = () => (
  <UserTab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Bookings') {
        iconName = focused ? 'list' : 'list-outline';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />
    },
  })}>
    <UserTab.Screen name="Home" component={BoxesScreen} />
    <UserTab.Screen name="Bookings" component={BookingsScreen} />
    <UserTab.Screen name="Profile" component={ProfileScreen} />
  </UserTab.Navigator>
);

const ProviderNavigator = () => (
  <ProviderTab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Box') {
        iconName = focused ? 'cube' : 'cube-outline';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />
    },
  })}>
    <ProviderTab.Screen name="Box" component={BoxScreen} />
    <ProviderTab.Screen name="Profile" component={ProviderProfileScreen} />
  </ProviderTab.Navigator>
);

export default function RootNavigator() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {auth?.isAuthenticated ? (
        role === 'User' ? (
          <RootStack.Screen name="User" component={UserNavigator} />
        ) : (
          <RootStack.Screen name="Provider" component={ProviderNavigator} />
        )
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
