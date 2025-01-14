import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux'; // Combine multiple reducers
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'], // Only persist the 'auth' slice
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializableCheck for Redux Persist
        }),
});

// Persistor
export const persistor = persistStore(store);
