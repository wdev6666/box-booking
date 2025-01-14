import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { firstName } = useSelector((state) => state.auth);

  const popularGrounds = [
    { id: '1', name: 'Hover Ground', location: 'Fairfield', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Sport Ground', location: 'Bangalore', image: 'https://via.placeholder.com/150' },
  ];

  const renderGroundItem = ({ item }) => (
    <View style={styles.groundCard}>
      <Image source={{ uri: item.image }} style={styles.groundImage} />
      <Text style={styles.groundName}>{item.name}</Text>
      <Text style={styles.groundLocation}>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {firstName}</Text>
      <Text style={styles.subtitle}>Good morning 🌞</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Grounds</Text>
        <FlatList
          data={popularGrounds}
          renderItem={renderGroundItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  groundCard: {
    marginRight: 15,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  groundImage: {
    width: 150,
    height: 100,
  },
  groundName: {
    fontSize: 16,
    color: '#fff',
    padding: 5,
  },
  groundLocation: {
    fontSize: 14,
    color: '#aaa',
    padding: 5,
  },
});

export default HomeScreen;
