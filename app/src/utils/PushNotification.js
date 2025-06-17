import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging?.AuthorizationStatus?.AUTHORIZED ||
    authStatus === messaging?.AuthorizationStatus?.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status::::::::::::::', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken =
        // Platform.OS === 'ios'
        //   ? await messaging().getAPNSToken()
        //   :
        await messaging().getToken();
      if (fcmToken) {
        console.log('new generated fcm token=============>', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('Error', error);
    }
  }
};

export const NotificationServices = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log(
    //   'Notification caused app to open from background state:',
    //   remoteMessage.notification,
    // );
  });
  //foreground notification handeling
  messaging().onMessage(async remoteMessage => {
    // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    if (remoteMessage?.data) {
      // navigation.navigate(remoteMessage?.data?.screen_name);
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.log(
        //   'Notification caused app to open from quit state:',
        //   remoteMessage.notification,
        // );
      }
    });
};
