import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Rating = ({
  rating,
  maxRating,
  starImage,
  size,
  starDistance,
  isBlack,
  onStarPress,
}) => {
  // Create an array to store the images
  const stars = [];

  // Loop to push star images to the array
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <TouchableOpacity key={i} onPress={() => onStarPress?.(i)}>
        <Image
          resizeMode="contain"
          source={starImage || (i <= rating ? Icons.Star : Icons.UnfillStar)}
          style={{
            width: size ? size : normalize(11),
            height: size ? size : normalize(11),
            marginRight: starDistance ? starDistance : normalize(2),
            tintColor: isBlack ? Colors.themeBlack : Colors.themeGreen,
          }}
        />
      </TouchableOpacity>,
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
    tintColor: Colors.themeGreen,
  },
});

export default Rating;
