import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import constants from '../utils/helpers/constants';
import css from '../themes/css';

const DocView = props => {
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{
          uri: constants.IMAGE_URL + `${props?.route?.params?.link}`,
        }}
        // source={{
        //   uri: `https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf`,
        // }}
        // startInLoadingState
        // scalesPageToFit
        // onNavigationStateChange={val => handleNavigationStateChange(val)}
        // javaScriptEnabledAndroid={true}
        // onMessage={event => {
        //   alert('MESSAGE >>>>' + event.nativeEvent.data);
        // }}
        onNavigationStateChange={navState => {
          console.log('jhgjhgjgjgjg', navState);
          setTimeout(() => {
            if (navState.canGoBack) {
              props.navigation.navigate('ProjectDetailsProvider');
            }
          }, 10000);
        }}
        // style={{flex: 1, width: deviceWidth, height: deviceHeight}}
      />
    </View>
  );
};

export default DocView;

const styles = StyleSheet.create({});
