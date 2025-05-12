import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import normalize from '../utils/helpers/normalize';

const ImageGrid = ({images, baseUrl}) => {
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => {
                  setImageIndex(index);
                  setIsVisible(true);
                }}>
                <Image
                  source={{uri: `${baseUrl}/${item}`}}
                  resizeMode="stretch"
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <ImageView
        images={images?.map(image => ({
          uri: `${baseUrl}/${image}`,
        }))}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(5),
  },
  image: {
    height: normalize(63),
    width: normalize(68),
    borderRadius: normalize(10),
  },
});

export default ImageGrid;
