import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import css from '../../themes/css';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import NextBtn from '../NextBtn';
import TranBtn from '../TranBtn';
import DataWithIcon from './DataWithIcon';

const OfferCard = ({
  title,
  location,
  category,
  budget,
  client,
  clientLoc,
  timeline,
  accept_press,
  reject_Press,
  loading,
}) => {
  return (
    <View style={[styles.mainContainer]}>
      <View style={[styles.lightContainer]}>
        <View>
          <Text style={[styles.projectTitle]}>{title}</Text>
          <View style={[css.row, css.aic, css.mt1]}>
            <Image source={Icons.LocationPin} style={[styles.locationIcon]} />
            <Text style={[styles.greyTxt]}>{location}</Text>
          </View>
        </View>
      </View>
      <View style={[css.p1, css.px2, {backgroundColor: Colors.themeWhite}]}>
        <View style={[css.row, css.jcsb, css.my1]}>
          <View style={[css.w48]}>
            <DataWithIcon
              padding={normalize(6)}
              img={Icons.dollar}
              darkTxt={'Project Budget'}
              lightTxt={budget}
            />
          </View>
          <View style={[css.w48]}>
            <DataWithIcon
              padding={normalize(6)}
              img={Icons.status}
              darkTxt={'Project Category'}
              lightTxt={category}
            />
          </View>
        </View>
        <View style={[css.row, css.jcsb]}>
          <View style={[css.w48]}>
            <DataWithIcon
              padding={normalize(6)}
              img={Icons.profileCircle}
              darkTxt={'Client Name'}
              lightTxt={client}
            />
          </View>
          <View style={[css.w48]}>
            <DataWithIcon
              padding={normalize(6)}
              img={Icons.LocationPin}
              darkTxt={'Client Location'}
              lightTxt={clientLoc}
            />
          </View>
        </View>
        <View style={[css.w48]}>
          <DataWithIcon
            padding={normalize(6)}
            img={Icons.cal}
            darkTxt={'Timeline'}
            lightTxt={timeline}
          />
        </View>
        <View style={[css.row, css.jcsb, css.p2]}>
          <View style={[css.w48]}>
            <TranBtn title={'Reject Bid'} onPress={reject_Press} />
          </View>
          <View style={[css.w48]}>
            <NextBtn
              height={normalize(23)}
              loading={loading}
              title={'accept bid'}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
              onPress={accept_press}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default OfferCard;

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
    marginLeft: normalize(2),
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
  statusTxt: {
    color: Colors.themeWhite,
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
    backgroundColor: '#D2DDCC',
    padding: normalize(12),
    paddingBottom: normalize(10),
  },
});
