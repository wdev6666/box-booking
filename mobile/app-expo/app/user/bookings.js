import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function AppScreen() {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchBookingData = async () => {
          try {
              const response = await fetch('/bookings');
              const data = await response.json();
              setBookingData(data);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      };

      fetchBookingData();
  }, []);

  if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
      <View>
        {bookingData && 
          <FlatList
              data={bookingData}
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