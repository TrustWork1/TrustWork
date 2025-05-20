import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
import css from '../../themes/css';

const ProjectCard = ({img, title, desc, location, type, status, onPress}) => {
  function truncateText(text) {
    return text.length > 50 ? text.slice(0, 150) + '...' : text;
  }
  return (
    <TouchableOpacity style={styles.liatConatiner} onPress={onPress}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={[styles.imgConatiner, {backgroundColor: Colors.themeGray}]}>
          <Image
            source={img ? {uri: `${constants.IMAGE_URL}${img}`} : Icons.UserPro}
            style={styles.imgConatiner}
            resizeMode="stretch"
          />
        </View>
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            marginHorizontal: normalize(10),
            width: '86%',
          }}>
          <Text style={styles.featuredNameTxt}>{title}</Text>
          <View style={styles.mainConatiner}>
            <View style={styles.commonConatiner}>
              <Image
                source={Icons.LocationPin}
                style={styles.featuredLocationImg}
                resizeMode="contain"
              />
              <Text style={styles.featuredSubTxt}>
                {location?.slice(0, 12)}
              </Text>
            </View>

            <View
              style={[
                styles.commonConatiner,
                {
                  paddingLeft: normalize(10),
                },
              ]}>
              <Image
                source={Icons.WorkType}
                style={styles.recentStarRating}
                resizeMode="contain"
              />
              <Text style={styles.featuredSubTxt}>{type}</Text>
            </View>

            <View
              style={[
                styles.commonConatiner,
                // css.bgblack,
                {
                  paddingLeft: normalize(10),
                },
              ]}>
              <Image
                source={Icons.status}
                style={styles.recentStarRating}
                resizeMode="contain"
              />
              <Text style={styles.featuredSubTxt}>{status}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.descTxt}>{truncateText(desc)}</Text>
    </TouchableOpacity>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  liatConatiner: {
    flex: 1,
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
  },
  imgConatiner: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(8),
  },
  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
    textTransform: 'capitalize',
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    textTransform: 'capitalize',
    // lineHeight: normalize(22),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  mainConatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: normalize(3),
    flexWrap: 'wrap',
  },
  commonConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    marginTop: normalize(5),
  },
});
