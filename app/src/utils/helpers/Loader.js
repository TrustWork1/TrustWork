import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Dimensions,
  View,
  Text,
} from 'react-native';
import {Colors} from '../../themes/Themes';
//import PropTypes from 'prop-types';
import normalize from '../helpers/normalize';

export default function Loader(props) {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    // Check if the removeEventListener method exists before calling it
    if (AppState.removeEventListener) {
      AppState.removeEventListener('change', handleAppStateChange);
    }

    // Cleanup function
    return () => {
      if (AppState.removeEventListener) {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, []);

  const isAppActive = appState === 'active';

  return props.visible && isAppActive ? (
    <View
      style={[
        {
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          top: 0,
          left: 0,
          height: Dimensions.get('screen').height,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          // margin:0,bottom:-30
        },
        props.modal
          ? {height: '133%', width: '116.5%', borderRadius: normalize(15)}
          : null,
      ]}>
      <View
        style={{
          height: normalize(140),
          width: normalize(140),
          borderRadius: normalize(10),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator
          size={'large'}
          color={Colors.themeGreen}></ActivityIndicator>
      </View>
    </View>
  ) : null;
}
