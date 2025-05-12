import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import WithTitle from './WithTitle';

const StatusCard = ({
  title,
  location,
  category,
  InitDate,
  status,
  timeLine,
  timeLineUnit,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onPress}>
      <View style={styles.lightContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.projectTitle}>{title}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: normalize(5),
            }}>
            <Image source={Icons.LocationPin} style={styles.locationIcon} />
            <Text style={styles.greyTxt}>{location}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTxt}>{status}</Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.themeWhite,
          paddingVertical: normalize(12),
          paddingHorizontal: normalize(10),
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.48}}>
            <WithTitle darkTxt={'Project Category'} lightTxt={category} />
          </View>
          <View style={{flex: 0.48}}>
            <WithTitle darkTxt={'Initiation Date:'} lightTxt={InitDate} />
          </View>
        </View>
        <View style={styles.timelineConatiner}>
          <Image source={Icons.clock} style={styles.locationIcon} />
          <Text style={styles.greyTxt}>
            {timeLine} {timeLineUnit} Timeline
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StatusCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: normalize(14),
    overflow: 'hidden',
    marginTop: normalize(10),
    flex: 1,
  },
  greyTxt: {
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    marginLeft: normalize(4),
  },
  locationIcon: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: 'contain',
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
    textTransform: 'capitalize',
  },
  statusTxt: {
    color: Colors.themeWhite,
    fontFamily: Fonts.FustatMedium,
    letterSpacing: normalize(0.5),
    textTransform: 'capitalize',
    fontSize: normalize(10),
  },
  statusContainer: {
    paddingHorizontal: normalize(10),
    height: normalize(20),
    backgroundColor: Colors.themeGreen,
    justifyContent: 'center',
    borderRadius: normalize(10),
  },
  lightContainer: {
    flex: 1,
    backgroundColor: Colors.themeProjectBackground,
    padding: normalize(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: normalize(15),
  },
  timelineConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(4),
    marginTop: normalize(12),
    marginHorizontal: normalize(8),
    backgroundColor: Colors.themeLightYellow,
    borderRadius: normalize(10),
  },
});
