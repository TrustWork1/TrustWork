import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  {
    id: '1',
    title: 'Restaurants',
    count: 56,
    image: 'https://via.placeholder.com/300x200.png?text=Restaurants',
  },
  {
    id: '2',
    title: 'Photographer',
    count: 68,
    image: 'https://via.placeholder.com/300x200.png?text=Photographer',
  },
  {
    id: '3',
    title: 'Event Halls',
    count: 70,
    image: 'https://via.placeholder.com/300x200.png?text=Event+Halls',
  },
  {
    id: '4',
    title: 'Beauty & Care',
    count: 22,
    image: 'https://via.placeholder.com/300x200.png?text=Beauty+Care',
  },
  {
    id: '5',
    title: 'Flower Coordinators',
    count: 168,
    image: 'https://via.placeholder.com/300x200.png?text=Flowers',
  },
  {
    id: '6',
    title: 'Beauty Centers',
    count: 59,
    image: 'https://via.placeholder.com/300x200.png?text=Beauty+Centers',
  },
  {
    id: '7',
    title: 'Music & Bands',
    count: 56,
    image: 'https://via.placeholder.com/300x200.png?text=Music+Bands',
  },
  {
    id: '8',
    title: 'Designer',
    count: 79,
    image: 'https://via.placeholder.com/300x200.png?text=Designer',
  },
  {
    id: '9',
    title: 'Hospitality',
    count: 56,
    image: 'https://via.placeholder.com/300x200.png?text=Hospitality',
  },
  {
    id: '10',
    title: 'Event Planners',
    count: 68,
    image: 'https://via.placeholder.com/300x200.png?text=Event+Planners',
  },
];

const App = () => {
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.count}>({item.count})</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10, // For rounded corners
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  image: {
    width: '100%',
    height: 150, // Ensures uniform height for all cards
    resizeMode: 'cover', // Ensures image scales proportionally
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  count: {
    color: '#fff',
    fontSize: 14,
  },
});

export default App;
