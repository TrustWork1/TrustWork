import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteGalleryItemRequest} from '../../redux/reducer/ProfileReducer';
import {Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';

const Gallery = props => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [previewData, setPreviewData] = useState({});

  let data = AuthReducer?.ProfileResponse?.data?.previous_work || [];
  let numColumns = 2;
  const rows = data.reduce((acc, _, i) => {
    if (i % numColumns === 0) {
      acc.push(data.slice(i, i + numColumns));
    }
    return acc;
  }, []);

  return (
    <>
      <FlatList
        style={{marginTop: normalize(5), marginLeft: normalize(10)}}
        data={rows}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.row}>
            {item.map((subItem, subIndex) => {
              return (
                <TouchableOpacity
                  key={subIndex}
                  style={{
                    marginRight: normalize(8),
                    marginBottom: subIndex < item.length - 1 ? normalize(8) : 0,
                    borderRadius: normalize(6),
                    overflow: 'hidden',
                  }}
                  onPress={() => setPreviewData(subItem)}
                  onLongPress={() => {
                    Alert.alert(
                      'Delete Image',
                      'Are you sure you want to delete this image?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () =>
                            dispatch(
                              deleteGalleryItemRequest({id: subItem?.id}),
                            ),
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <Image
                    style={styles.galleryImg}
                    source={
                      subItem?.image
                        ? {
                            uri: `${constants?.IMAGE_URL}${subItem?.image}`,
                          }
                        : Icons.dummyImage
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      <Modal transparent={true} visible={Object.keys(previewData).length > 0}>
        <Pressable
          style={styles.previewOverlay}
          onPress={() => setPreviewData({})}>
          <Pressable onPress={() => {}}>
            <Image
              style={{height: normalize(300), width: normalize(300)}}
              source={{uri: `${constants?.IMAGE_URL}${previewData?.image}`}}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  galleryImg: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'cover',
  },
  previewOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
