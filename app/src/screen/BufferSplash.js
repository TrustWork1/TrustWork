import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors} from '../themes/Themes';

const BufferSplash = () => {
  return (
    <View style={styles.conatiner}>
      <ActivityIndicator size={'large'} color={Colors.themeGreen} />
    </View>
  );
};

export default BufferSplash;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
