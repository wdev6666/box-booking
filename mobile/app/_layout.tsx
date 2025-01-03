import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="auth" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="app" 
            options={{ 
              headerShown: false 
            }} 
          />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
