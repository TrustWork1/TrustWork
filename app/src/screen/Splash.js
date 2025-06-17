import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from '../navigators/NavigationService';
import {getTokenRequest, userCheckRequest} from '../redux/reducer/AuthReducer';
import Images from '../themes/Images';
import {Sizes} from '../themes/Themes';
import constants from '../utils/helpers/constants';
import connectionrequest from '../utils/helpers/NetInfo';
import showErrorAlert from '../utils/helpers/Toast';

const Splash = props => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    // getLocation();
    // requestUserPermission();
    // NotificationServices();
  }, []);

  useEffect(() => {
    dispatch(getTokenRequest());
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/getTokenRequest':
          break;
        case 'Auth/getTokenSuccess':
          dispatch(userCheckRequest());
          break;
        case 'Auth/getTokenFailure':
          checkLocAvl();
          break;
        case 'Auth/userCheckRequest':
          break;
        case 'Auth/userCheckSuccess':
          break;
        case 'Auth/userCheckFailure':
          checkLocAvl();
          break;
      }
    }, [AuthReducer.status]),
  );

  const checkLocAvl = async () => {
    const loc = await AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS);
    setTimeout(() => {
      if (loc) {
        NavigationService.replace('SignIn');
      } else {
        NavigationService.replace('GetActualLocation');
      }
    }, 2000);
  };

  // FETCHING LATITUDE AND LONGITUDE
  const getLocation = async () => {
    // IOS
    if (Platform.OS === 'ios') {
      if ((await Geolocation.requestAuthorization('whenInUse')) === 'granted') {
        Geolocation.getCurrentPosition(
          position =>
            reverseGeocode(
              position?.coords?.latitude,
              position?.coords?.longitude,
            ),
          error => console.log('error::::', error),
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
    }

    // Android
    if (Platform.OS === 'android') {
      if (
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        )) === PermissionsAndroid.RESULTS.GRANTED
      ) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location =>
            reverseGeocode(location?.latitude, location?.longitude),
          )
          .catch(error => console.log('error::::', error));
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
    }
  };

  // FETCH ADDRESS FROM LATITUDE AND LONGITUDE AND SAVE IN ASYNC STORAGE
  const reverseGeocode = (latitude, longitude) => {
    connectionrequest()
      .then(async res => {
        await axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          .then(async res => {
            if (Object?.keys(res?.data?.address)?.length > 0) {
              const formattedAddress = Object?.entries(res?.data?.address)
                .map(([key, value]) => value)
                .join(', ');
              await AsyncStorage.setItem(
                constants.TRUSTWORKTKNADDRESS,
                JSON.stringify({
                  address: formattedAddress,
                }),
              );
            }
          })
          .catch(err => {});
      })
      .catch(err => {
        showErrorAlert(
          'No Internet Connection',
          'Please check your internet connection',
        );
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.Splash} style={styles.splashBg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  splashBg: {
    width: Sizes.width,
    height: Sizes.height,
    resizeMode: 'cover',
  },
});

export default Splash;
