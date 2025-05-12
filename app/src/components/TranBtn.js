import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const TranBtn = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: Colors.themeBlack,
        borderWidth: 1,
        borderRadius: normalize(8),
        justifyContent: 'center',
        alignItems: 'center',
        // height: normalize(20),
        paddingVertical: normalize(2),
        flex: 1,
      }}>
      <Text
        style={{
          fontFamily: Fonts.FustatSemiBold,
          fontSize: normalize(11),
          color: Colors.themeBlack,
          lineHeight: normalize(22),
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TranBtn;

const styles = StyleSheet.create({});
