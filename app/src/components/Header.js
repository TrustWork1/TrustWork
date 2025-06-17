import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationService from '../navigators/NavigationService';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Header = props => {
  function onPress() {
    if (props.onPress) {
      props.onPress();
    } else {
      NavigationService.goBack();
    }
  }

  function onHeaderPress() {
    if (props.onHeaderPress) {
      props.onHeaderPress();
    }
  }

  return (
    <View style={styles.mainContianer}>
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'} />
        <View
          style={{
            height: StatusBar.currentHeight,
          }}
        />
        <View style={styles.container}>
          <SafeAreaView style={styles.btnContainer}>
            {props.logo && (
              <View style={styles.logoContainer}>
                <Image
                  source={props.logo}
                  resizeMode="contain"
                  style={{
                    width: normalize(100),
                    height: normalize(25),
                  }}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => onHeaderPress()}>
                    <Image
                      source={Icons.user}
                      resizeMode="contain"
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginLeft: normalize(15)}}
                    onPress={() => NavigationService.navigate('Notification')}>
                    <Image
                      source={Icons.Notification}
                      resizeMode="contain"
                      style={{
                        width: normalize(40),
                        height: normalize(40),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {props.menuTxt && (
              <View style={styles.logoContainer}>
                <Text
                  style={{
                    fontFamily: Fonts.FustatSemiBold,
                    fontSize: normalize(16),
                    color: Colors.themeWhite,
                  }}>
                  {props?.menuTxt}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => onHeaderPress()}>
                    <Image
                      source={Icons.user}
                      resizeMode="contain"
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginLeft: normalize(15)}}
                    onPress={() => NavigationService.navigate('Notification')}>
                    <Image
                      source={Icons.Notification}
                      resizeMode="contain"
                      style={{
                        width: normalize(40),
                        height: normalize(40),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {props.backIcon && (
              <View
                style={[styles.logoContainer, {justifyContent: 'flex-start'}]}>
                <TouchableOpacity
                  onPress={() => {
                    onPress();
                  }}>
                  <Image
                    source={props.backIcon}
                    style={{
                      width: normalize(33),
                      height: normalize(33),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.titleTxt}>{props.headerTitle}</Text>
              </View>
            )}

            {props.onlyTxt && (
              <View style={styles.onlyTxtConatiner}>
                <Text style={styles.titleTxt}>{props.headerTitle}</Text>
                <View style={{width: normalize(25)}} />
              </View>
            )}

            {props.messageProfile && (
              <View style={styles.messageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    onPress();
                  }}>
                  <Image
                    source={Icons.BackIcon}
                    style={{
                      width: normalize(33),
                      height: normalize(33),
                    }}
                  />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <Image
                    source={props.messageProfile}
                    style={{
                      width: normalize(39),
                      height: normalize(39),
                      borderRadius: normalize(39 / 2),
                    }}
                  />
                  <View style={styles.titleTxtConatiner}>
                    <Text style={styles.titleTxtt}>{props.title}</Text>
                    <Text style={styles.subTitleTxt}>{props.subTitle}</Text>
                    {props?.isTyping ? (
                      <Text style={styles.typingTxt}>
                        {props?.isTyping && 'Typing...'}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: Fonts.VerdanaProBold,
                          fontSize: 10,
                          lineHeight: normalize(14),
                          color: props.isOnline
                            ? Colors.themeGreen
                            : Colors.gray2,
                          textTransform: 'capitalize',
                        }}>
                        {props.isOnline ? 'Online' : 'Offline'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {props.vedorheader && (
              <View style={styles.logoContainer}>
                <Image
                  source={props.vedorheader}
                  resizeMode="contain"
                  style={{
                    width: normalize(50),
                    height: normalize(50),
                  }}
                />
                <View style={[]}>
                  <TouchableOpacity
                    style={{marginLeft: normalize(15)}}
                    onPress={() => NavigationService.navigate('Notification')}>
                    <Image
                      source={Icons.Notification}
                      resizeMode="contain"
                      style={{
                        width: normalize(21),
                        height: normalize(21),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {props.headerTxt && (
              <View style={styles.messageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    onPress();
                  }}>
                  <Image
                    source={Icons.BackIcon}
                    style={{
                      width: normalize(33),
                      height: normalize(33),
                    }}
                  />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <View style={styles.titleTxtConatiner}>
                    <Text
                      style={[
                        styles.titleTxtt,
                        {
                          fontSize: 14,
                          lineHeight: normalize(16),
                        },
                      ]}>
                      {props.headerTxt}
                    </Text>
                    {/* <Text
                      style={{
                        fontFamily: Fonts.VerdanaProMedium,
                        fontSize: 12,
                        lineHeight: normalize(14),
                        color: Colors.gray,
                      }}>
                      {props.subTitle}
                    </Text> */}
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    // marginTop: Platform.OS === 'ios' ? null : normalize(15),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: Platform.OS === 'ios' ? null : normalize(4),
  },
  mainContianer: {
    backgroundColor: Colors.themeGreen,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  container: {
    backgroundColor: Colors.themeGreen,
    paddingHorizontal: normalize(15),
    height: Platform.OS === 'ios' ? normalize(55) : normalize(55),
    paddingBottom: normalize(10),
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(15),
    lineHeight: normalize(22),
    color: Colors.themeWhite,
    textTransform: 'capitalize',
    paddingLeft: normalize(10),
  },
  onlyTxtConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: normalize(15),
  },
  titleTxtConatiner: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: normalize(7),
  },
  titleTxtt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: 16,
    // lineHeight: normalize(17),
    color: Colors.themeWhite,
    textTransform: 'capitalize',
  },
  subTitleTxt: {
    fontFamily: Fonts.VerdanaProMedium,
    fontSize: 12,
    // lineHeight: normalize(14),
    color: Colors.themeWhite,
    textTransform: 'capitalize',
  },
  typingTxt: {
    fontFamily: Fonts.VerdanaProBold,
    fontSize: 10,
    lineHeight: normalize(14),
    color: Colors.themeGreen,
    textTransform: 'capitalize',
  },
});
