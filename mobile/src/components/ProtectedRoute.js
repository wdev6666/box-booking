import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Text>You need to log in to access this page.</Text>;
  }

  return children;
};

export default ProtectedRoute;
