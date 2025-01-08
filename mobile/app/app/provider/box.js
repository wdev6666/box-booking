import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../../config/api';
// import axiosInstance from '../../src/config/axiosInstance';
import api from '../../services/api';

export default function AppScreen() {
  const [boxData, setBoxData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchBoxData = async () => {
          try {
              const response = await api.get(`${API_BASE_URL}/properties/my-properties`);
            //   const data = await response.json();
              setBoxData(response.data.properties);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      };

      fetchBoxData();
  }, []);

  if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
      <View>
        {boxData && 
          <FlatList
              data={boxData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                  <View>
                      <Text>{item.name}</Text>
                      <Text>{item.location}</Text>
                  </View>
              )}
          /> }
      </View>
  );
}