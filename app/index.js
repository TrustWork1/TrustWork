/**
 * @format
 */

import {AppRegistry, LogBox, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs();
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {persistor, Store} from './src/redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Override Text scaling in input fields
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const TrustWork = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => TrustWork);
