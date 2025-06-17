import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Colors} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import WithTitle from './WithTitle';

const DataWithIcon = ({img, darkTxt, lightTxt, padding}) => {
  return (
    <View
      style={[styles.conatainer, {padding: padding ? padding : normalize(2)}]}>
      <Image source={img} style={styles.iconStyle} />
      <WithTitle darkTxt={darkTxt} lightTxt={lightTxt} />
    </View>
  );
};

export default DataWithIcon;

const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: Colors.themeWhite,
    flexDirection: 'row',
    borderRadius: normalize(10),
  },
  iconStyle: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
    marginRight: normalize(8),
    marginTop: normalize(5),
    tintColor: '#54AF1F',
  },
});
