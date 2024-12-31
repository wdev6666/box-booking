import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store, persistor } from './store';
import theme from './theme';
import AppRoutes from './routes';
import Notification from './components/common/Notification';
import MainLayout from './components/layout/MainLayout';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <BrowserRouter>
                        <Notification />
                        <MainLayout>
                            <AppRoutes />
                        </MainLayout>
                    </BrowserRouter>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
