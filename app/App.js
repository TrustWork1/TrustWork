import 'react-native-gesture-handler';
import React, {useEffect, useRef} from 'react';
import StackNav from './src/navigators/StackNav';
import {Alert, AppState, Platform, StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import {NotificationServices} from './src/utils/PushNotification';
import {withIAPContext} from 'react-native-iap';
import {MembershipStatusRequest} from './src/redux/reducer/AuthReducer';
import NavigationService from './src/navigators/NavigationService';

const App = () => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const appState = useRef(AppState.currentState);

  // Track the previous value of isPaymentVerified so we only react to
  // a true → false transition (not the initial false on mount).
  const prevPaymentVerified = useRef(AuthReducer?.isPaymentVerified);

  // ─── Subscription expiry check on foreground resume ──────────────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Only check when the user is logged in
        if (AuthReducer?.getTokenResponse) {
          dispatch(MembershipStatusRequest());
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [AuthReducer?.getTokenResponse]);

  // ─── Navigate to membership screen when subscription expires ─────────────────
  useEffect(() => {
    const wasVerified = prevPaymentVerified.current;
    const isNowExpired = !AuthReducer?.isPaymentVerified;
    const isLoggedIn = !!AuthReducer?.getTokenResponse;

    // Only act when: user is logged in AND payment just flipped from true → false
    if (isLoggedIn && wasVerified === true && isNowExpired) {
      NavigationService.navigate('UserMembershipPlan');
    }

    // Keep the ref in sync for the next render
    prevPaymentVerified.current = AuthReducer?.isPaymentVerified;
  }, [AuthReducer?.isPaymentVerified, AuthReducer?.getTokenResponse]);

  useEffect(() => {
    requestUserPermission();
    // NotificationServices();
    // removeUserType();
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // Alert.alert('A new FCM notification arrived!', remoteMessage);
        // console.log('A new FCM notification arrived!', remoteMessage);

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
    }
  }, []);

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    if (!fcmToken) {
      await messaging().registerDeviceForRemoteMessages();
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
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
