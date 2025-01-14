import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProviderLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="box"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="business" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
