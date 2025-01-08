import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                navigation.replace('MainApp');
            } else {
                navigation.replace('Auth');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isAuthenticated, navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/BoxWelcome.png')}
                style={styles.logo}
                resizeMode="center"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.6,
        height: width * 0.6,
    },
});

export default SplashScreen; 