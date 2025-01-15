import React, { useRef, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;

const facilities = [
  {
    id: '1',
    name: 'Green Box Cricket',
    location: 'Ahmedabad, Gujarat',
    images: [
      'https://picsum.photos/seed/picsum/300/200',
      'https://picsum.photos/seed/picsum/300/200',
      'https://picsum.photos/seed/picsum/300/200',
    ], // Replace with actual image URLs
    rate: '₹1500/hr',
  },
  {
    id: '2',
    name: 'Blue Sky Cricket',
    location: 'Gandhinagar, Gujarat',
    images: [
      'https://picsum.photos/seed/picsum/300/200',
      'https://picsum.photos/seed/picsum/300/200',
    ],
    rate: '₹1200/hr',
  },
  // Add more facilities
];

const FacilityCard = ({ facility, onPress }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
  
    const handleScroll = (event) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
      setActiveIndex(newIndex);
    };
  
    const handleDotPress = (index) => {
      setActiveIndex(index);
      flatListRef.current.scrollToIndex({ index, animated: true });
    };
  
    return (
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <Card containerStyle={styles.cardContainer}>
          {/* Horizontal Image Scroll */}
          <FlatList
            ref={flatListRef}
            data={facility.images}
            keyExtractor={(item, index) => `${facility.id}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          {/* Pagination Dots */}
          <View style={styles.dotContainer}>
            {facility.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}
                style={[
                  styles.dot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{facility.name}</Text>
            <Text style={styles.location}>{facility.location}</Text>
            <Text style={styles.rate}>{facility.rate}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

const BoxScreen = () => {
  const handlePress = (facility) => {
    console.log(`Selected: ${facility.name}`);
    // Navigate or perform any action
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FacilityCard facility={item} onPress={() => handlePress(item)} />
        )}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    card: {
      marginVertical: 10,
    },
    cardContainer: {
      padding: 0,
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: screenWidth - 20, // Adjust for single column with padding
      height: 200,
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#007BFF',
    },
    inactiveDot: {
      backgroundColor: '#ccc',
    },
    textContainer: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 5,
    },
    location: {
      fontSize: 14,
      color: '#777',
    },
    rate: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 5,
    },
  });

export default BoxScreen;
