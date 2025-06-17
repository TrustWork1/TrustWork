import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const CustomErrorComponent = props => {
  return (
    <View
      style={[styles.errorStyle, {marginHorizontal: props.noMargin ? 0 : 13}]}>
      <View style={styles.iconParent}>
        <Image
          source={Icons.Warning}
          resizeMode="contain"
          style={{width: normalize(15), height: normalize(15)}}
        />
      </View>
      <Text numberOfLines={3} style={styles.errorFont}>
        {props.label}
      </Text>
    </View>
  );
};

export default CustomErrorComponent;

const styles = StyleSheet.create({
  errorStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(5),
    marginTop: normalize(5),
    marginLeft: normalize(23),
  },
  errorFont: {
    color: Colors.themeRed,
    fontFamily: Fonts.FustatMedium,
    marginHorizontal: normalize(6),
  },
  iconParent: {height: '100%'},
});
