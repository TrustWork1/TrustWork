import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const NextBtn = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.btnMainContainer,
        {
          borderColor: props.borderColor,
          backgroundColor:
            props.disabled || props?.loading
              ? Colors.themeSearchBorder
              : props.backgroundColor,
        },
      ]}
      disabled={props.disabled || props?.loading}
      onPress={props.onPress}>
      {/* onPress={() => navigation.navigate(props.navigateTo)}> */}
      <View
        style={[
          styles.btnContainer,
          {height: props.height ? props.height : normalize(50)},
        ]}>
        {props?.loading ? (
          <ActivityIndicator color={Colors.themeWhite} size="small" />
        ) : (
          <Text style={[styles.text, {color: props.color}]}>{props.title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NextBtn;

const styles = StyleSheet.create({
  btnMainContainer: {
    width: '100%',
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  btnContainer: {
    width: '100%',
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.FustatMedium,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: normalize(20),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
