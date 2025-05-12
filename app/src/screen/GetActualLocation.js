import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Modal from 'react-native-modal';
import NextBtn from '../components/NextBtn';
import NavigationService from '../navigators/NavigationService';
import Images from '../themes/Images';
import {Colors, Fonts, Icons, Sizes} from '../themes/Themes';
import constants from '../utils/helpers/constants';
import normalize from '../utils/helpers/normalize';

const GetActualLocation = props => {
  const isFocused = useIsFocused();
  const [showSeen, setShowSeen] = useState(true);

  const getLocation = async () => {
    const handleError = message => {
      Alert.alert('Error', message);
    };

    const saveLocation = async (latitude, longitude) => {
      console.log('Location::::', latitude, longitude);

      try {
        await AsyncStorage.setItem(
          constants.TRUSTWORKTKNADDRESS,
          JSON.stringify({
            latitude,
            longitude,
          }),
        );
        setShowSeen(false);
        NavigationService?.navigate('SignIn');
      } catch (error) {
        handleError('Unable to save location data');
      }
    };

    if (Platform.OS === 'ios') {
      try {
        const permission = await Geolocation.requestAuthorization('whenInUse');
        if (permission === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              saveLocation(latitude, longitude);
            },
            () => handleError('Unable to get the current location'),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          Alert.alert(
            'Permission Access Required',
            'Please enable location permission to continue',
            [
              {
                text: 'OK',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
        }
      } catch {
        handleError('Unable to process location request');
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              saveLocation(latitude, longitude);
            },
            () => handleError('Unable to get the current location'),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          Alert.alert(
            'Permission Access Required',
            'Please enable location permission to continue',
            [
              {
                text: 'OK',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
        }
      } catch {
        handleError('Unable to process location request');
      }
    }
  };

  const locationModalComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: normalize(20),
            }}>
            <Image source={Icons.LocationAccess} style={styles.locationIcon} />
            <View>
              <Text
                style={{
                  color: Colors.themeBlack,
                  fontSize: 16,
                  lineHeight: normalize(22),
                  fontFamily: Fonts.FustatSemiBold,
                  textAlign: 'center',
                  paddingVertical: normalize(15),
                }}>
                <Text style={[{fontFamily: Fonts.FustatBold}]}>
                  {'Allow “TRUST WORK” '}
                </Text>
                {'to access your location while you use the app?'}
              </Text>
            </View>

            <View style={styles.mainBtnConatiner}>
              <View style={[styles.btnMainContainer, {width: '55%'}]}>
                <NextBtn
                  height={normalize(40)}
                  title={'DON’T ALLOW'}
                  borderColor={Colors.themeBlack}
                  color={Colors.themeBlack}
                  onPress={() => {
                    setShowSeen(false);
                    NavigationService?.navigate('SignIn');
                  }}
                />
              </View>
              <View style={[styles.btnMainContainer, {width: '55%'}]}>
                <NextBtn
                  height={normalize(40)}
                  title={'ALLOW'}
                  borderColor={Colors.themeGreen}
                  color={Colors.themeWhite}
                  backgroundColor={Colors.themeGreen}
                  onPress={() => getLocation()}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.GetStarted} style={styles.splashBg} />
      <Modal
        propagateSwipe
        transparent={true}
        visible={showSeen}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn={'slideInDown'}
        animationOut={'slideOutDown'}
        useNativeDriver={true}
        animationType="slide"
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={{justifyContent: 'flex-end', margin: 0}}>
        {locationModalComponent()}
      </Modal>
    </View>
  );
};

export default GetActualLocation;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  splashBg: {
    width: Sizes.width,
    height: Sizes.height,
    resizeMode: 'cover',
  },
  modalMainContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubContainer: {
    backgroundColor: Colors.themeWhite,
    width: '85%',
    borderRadius: 20,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  locationIcon: {
    height: normalize(46),
    width: normalize(51),
    resizeMode: 'contain',
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(15),
    paddingBottom: normalize(10),
  },
  mainBtnConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
