import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts} from '../../themes/Themes';
import css from '../../themes/css';
import normalize from '../../utils/helpers/normalize';

const MsgListCard = ({Img, name, msg, time, count, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      <Image source={Img} resizeMode="stretch" style={styles.profileImg} />
      <View style={[css.ml2, css.f1]}>
        <View style={[css.aic, css.row, css.jcsb, css.f1]}>
          <Text style={[styles.nameStyle]}>{name}</Text>
          <Text style={[styles.timeStyle, css.fs10]}>{time}</Text>
        </View>
        <View style={[css.aic, css.row, css.jcsb, css.f1]}>
          <Text style={[styles.timeStyle, css.fs11]}>{msg}</Text>
          {count && (
            <View style={[styles.countContainer]}>
              <Text style={[styles.countTxt]}>{count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MsgListCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.themeWhite,
    marginTop: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
    flexDirection: 'row',
  },
  profileImg: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(40 / 2),
  },
  nameStyle: {
    fontSize: normalize(12),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
  },
  timeStyle: {
    fontFamily: Fonts.FustatRegular,
    color: Colors.themeInactiveTxt,
  },
  countContainer: {
    backgroundColor: Colors.themeYellow,
    paddingHorizontal: normalize(4),
    borderRadius: normalize(10),
  },
  countTxt: {
    fontSize: normalize(10),
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatSemiBold,
  },
});
