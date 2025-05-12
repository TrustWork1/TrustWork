import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';

const WithTitle = ({darkTxt, lightTxt}) => {
  const isEmail = text => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const lightStyle = isEmail(lightTxt)
    ? [styles.lightStyle, styles.noCapitalize]
    : styles.lightStyle;

  return (
    <View style={{flex: 1}}>
      <Text style={styles.darkStyle}>{darkTxt}</Text>
      <Text style={lightStyle}>{lightTxt}</Text>
    </View>
  );
};

export default WithTitle;

const styles = StyleSheet.create({
  darkStyle: {
    fontSize: normalize(11),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
  },
  lightStyle: {
    fontSize: normalize(11),
    fontFamily: Fonts.FustatRegular,
    color: Colors.themeInactiveTxt,
    marginTop: normalize(2),
    textTransform: 'capitalize',
  },
  noCapitalize: {
    textTransform: 'none',
  },
});
