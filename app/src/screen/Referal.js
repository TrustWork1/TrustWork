import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Share from 'react-native-share';
import NextBtn from '../components/NextBtn';
import NavigationService from '../navigators/NavigationService';
import Images from '../themes/Images';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import files from '../assets/filesBase64';

const listData = [
  {
    id: 1,
    title: 'Invite your friends to register on TrustWork App',
    image: Icons.Referal3,
  },
  {
    id: 2,
    title: 'When a user registers using your referral code and subscribes',
    image: Icons.Referal1,
  },
  {
    id: 3,
    title: '5% discount will be applied on your next subscription',
    image: Icons.Referal2,
  },
];

const Referal = props => {
  const {code} = props?.route?.params;

  const referralCode = code;
  const appLink =
    Platform.OS == 'android'
      ? 'https://play.google.com/store/apps/details?id='
      : 'https://apps.apple.com/us/app/';

  const shareContent = async () => {
    const message = `🚀 Join TrustWork now! Use my referral code *${referralCode}* to get discount. Download the app here: ${appLink}`;

    const shareOptions = {
      title: 'Join TrustWork!',
      message,
      url: files.image1,
      // urls: [files.image1, files.image2]
      subject: 'TrustWork Invitation',
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error ->', error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconWrapper}>
        <Image source={item.image} resizeMode="contain" style={styles.icon} />
      </View>
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View
        style={{
          height: StatusBar.currentHeight,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            height: normalize(33),
            width: normalize(33),
            marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(15),
            marginLeft: normalize(15),
          }}
          onPress={() => NavigationService.goBack()}>
          <Image
            source={Icons.BackIcon}
            resizeMode="contain"
            style={{
              height: normalize(33),
              width: normalize(33),
            }}
          />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Image
            source={Images.Referal}
            resizeMode="contain"
            style={styles.referalImage}
          />
          <Text style={styles.title}>Refer Your Friend, Earn 5% Discount</Text>
          <Text style={styles.subtitle}>
            Invite your friends to join TrustWork and enjoy a 5% discount on
            your next subscription when they sign up using your referral code!
          </Text>
        </View>

        <View style={styles.codeWrapper}>
          <Text style={styles.label}>Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.referralCode}>{code}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => Clipboard.setString(code)}>
              <Text style={styles.copyText}>COPY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.heading}>How does it work?</Text>
        <FlatList
          data={listData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <View style={styles.btnMainContainer}>
          <NextBtn
            height={normalize(50)}
            title={'Refer Friends'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => shareContent()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Referal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  scrollContainer: {
    paddingHorizontal: normalize(15),
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  referalImage: {
    width: normalize(200),
    height: normalize(200),
  },
  title: {
    fontSize: normalize(14),
    fontFamily: Fonts.FustatBold,
    marginTop: normalize(10),
    textAlign: 'center',
    color: Colors.themeBlack,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: normalize(10),
    fontSize: normalize(11),
    color: Colors.themeBlack,
  },
  codeWrapper: {
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  label: {
    fontSize: normalize(14),
    fontFamily: Fonts.FustatBold,
    color: Colors.themeBlack,
    marginBottom: normalize(5),
  },
  codeContainer: {
    width: normalize(200),
    flexDirection: 'row',
    backgroundColor: Colors.themeGreen,
    borderRadius: normalize(20),
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: normalize(5),
  },
  referralCode: {
    flex: 1,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    color: Colors.themeWhite,
    fontSize: normalize(12),
    fontFamily: Fonts.FustatBold,
  },
  copyButton: {
    backgroundColor: Colors.themeWhite,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    borderTopRightRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
  },
  copyText: {
    color: Colors.themeGreen,
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(12),
  },
  heading: {
    fontSize: normalize(14),
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatBold,
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(5),
  },
  iconWrapper: {
    height: normalize(45),
    width: normalize(45),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(25),
    backgroundColor: Colors.themeGreen,
    marginRight: normalize(10),
  },
  icon: {
    width: normalize(25),
    height: normalize(25),
    tintColor: Colors.themeWhite,
  },
  itemText: {
    flex: 1,
    fontSize: normalize(12),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
  },
  btnMainContainer: {
    paddingVertical: normalize(20),
  },
});
