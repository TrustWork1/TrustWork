import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import StackNav from './src/navigators/StackNav';
import {Alert, Platform, StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import {NotificationServices} from './src/utils/PushNotification';
import {withIAPContext} from 'react-native-iap';

const App = () => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    requestUserPermission();
    // NotificationServices();
    // removeUserType();
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // Alert.alert('A new FCM notification arrived!', remoteMessage);
        console.log('A new FCM notification arrived!', remoteMessage);

        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        // await notifee.cancelAllNotifications();

        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          android: Platform.OS == 'android' && {
            channelId,
          },
          data: remoteMessage,
          asForegroundService: true,
        });
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log('notificationListner.....', error);
    }
  }, []);

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    console.log('FCM Async', fcmToken);
    if (!fcmToken) {
      await messaging().registerDeviceForRemoteMessages();
      fcmToken = await messaging().getToken();
      console.log('FCM Token--->', fcmToken);
      if (fcmToken) {
        console.log('FCM', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        // setDeviceToken(fcmToken);
      }
    }
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('Enabled', enabled);
    if (enabled) {
      getToken();
    }
  }

  // const removeUserType = async () => {
  //   try {
  //     await AsyncStorage.removeItem('userType');
  //     console.log('User type removed');
  //   } catch (error) {
  //     console.error('Error removing user type:', error);
  //   }
  // };

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
      />
      <StackNav />
    </>
  );
};

export default withIAPContext(App);
