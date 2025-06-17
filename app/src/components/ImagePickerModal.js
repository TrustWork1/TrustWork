import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';

const ImagePickerModal = ({
  visible,
  onClose,
  onImageNamePicked,
  onImagePicked,
  maxImages,
  multiple,
  currentImages,
}) => {
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 2048,
      height: 2048,
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 2048,
      avoidEmptySpaceAroundImage: true,
      cropping: false,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
    }).then(cameraImage => {
      let imageObject = {
        size: cameraImage.size,
        name: cameraImage.filename
          ? cameraImage.filename
          : cameraImage.path.replace(/^.*[\\\/]/, ''),
        uri: cameraImage.path,
        type: cameraImage.mime,
      };

      onImageNamePicked([
        ...(Array.isArray(currentImages)
          ? currentImages?.map(img => img.name)
          : []),
        imageObject.name,
      ]);
      onImagePicked([
        ...(Array.isArray(currentImages) ? currentImages : []),
        imageObject,
      ]);
      onClose();
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 2048,
      height: 2048,
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 2048,
      avoidEmptySpaceAroundImage: true,
      cropping: false,
      mediaType: 'photo',
      multiple: multiple,
      compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
    }).then(galleryImages => {
      if (
        galleryImages?.length +
          (Array.isArray(currentImages) ? currentImages?.length : 0) >
        maxImages
      ) {
        showErrorAlert(`You can only select up to ${maxImages} images.`);
        return;
      }

      if (!multiple) {
        galleryImages = [galleryImages];
      }

      const videoExtensions = [
        'mp4',
        'mkv',
        'avi',
        'mov',
        'wmv',
        'flv',
        'webm',
        'm4v',
        '3gp',
        '3g2',
        'ts',
      ];

      galleryImages = galleryImages?.filter(image => {
        const fileExtension = image?.path?.split('.')?.pop()?.toLowerCase();
        if (videoExtensions.includes(fileExtension)) {
          showErrorAlert('Please select a photo, not a video.');
          return false;
        }
        return true;
      });

      let images = galleryImages.map(galleryImage => ({
        size: galleryImage.size,
        name: galleryImage.filename
          ? galleryImage.filename
          : galleryImage.path.replace(/^.*[\\\/]/, ''),
        uri: galleryImage.path,
        type: galleryImage.mime,
      }));

      onImageNamePicked([
        ...(Array.isArray(currentImages)
          ? currentImages?.map(img => img.name)
          : []),
        ...images?.map(img => img.name),
      ]);
      onImagePicked([
        ...(Array.isArray(currentImages) ? currentImages : []),
        ...images,
      ]);
      onClose();
    });
  };

  return (
    <Modal
      propagateSwipe
      transparent={true}
      visible={visible}
      backdropOpacity={0}
      useNativeDriverForBackdrop={true}
      animationIn={'slideInDown'}
      animationOut={'slideOutDown'}
      useNativeDriver={true}
      animationType="slide"
      swipeDirection={['down']}
      avoidKeyboard={true}
      style={{justifyContent: 'flex-end', margin: 0}}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}>
      <View style={styles.modalCenteredContainer}>
        <View style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}></Text>
          </View>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => takePhotoFromCamera()}>
            <View style={styles.btnCameraContainer}>
              <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => choosePhotoFromLibrary()}>
            <View style={styles.btnCameraContainer}>
              <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => onClose()}>
            <View style={styles.btnCameraContainer}>
              <Text style={styles.panelButtonTitle}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: Colors.themeBackground,
    paddingTop: 20,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalCenteredContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panelTitle: {
    fontSize: 24,
    height: 35,
    fontFamily: Fonts.VerdanaProSemiBold,
    textAlign: 'center',
    color: Colors.themeGreen,
    textTransform: 'capitalize',
  },
  panelSubtitle: {
    fontSize: 14,
    height: 30,
    fontFamily: Fonts.VerdanaProMedium,
    textAlign: 'center',
    color: Colors.gray,
    textTransform: 'capitalize',
  },
  panelButton: {
    padding: 6,
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white,
  },
  btnCameraContainer: {
    width: '100%',
    height: normalize(45),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.themeGreen,
    borderColor: Colors.themeGreen,
    borderWidth: 2,
    borderRadius: 20,
  },
});
