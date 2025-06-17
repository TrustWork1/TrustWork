import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {contactUsRequest} from '../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons} from '../themes/Themes';
import connectionrequest from '../utils/helpers/NetInfo';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';

let status = '';

const HelpSupport = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onSendQuery = () => {
    if (!title || !description) {
      showErrorAlert(
        !title ? 'Enter Query Subject' : 'Enter Query Description',
      );
      return;
    }

    let obj = {
      query: title,
      answer: description,
    };

    connectionrequest()
      .then(() => {
        dispatch(contactUsRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/contactUsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/contactUsSuccess':
        status = ProfileReducer.status;
        NavigationService?.goBack();
        break;
      case 'Profile/contactUsFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={ProfileReducer.status == 'Profile/contactUsRequest'} /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'Help & Support'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            // style={{marginBottom: 150}}
            enableOnAndroid={true}
            scrollEnabled={true}
            // extraScrollHeight={100}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps={'handled'}
            scrollToOverflowEnabled={true}
            enableAutomaticScroll={true}
            contentContainerStyle={{
              //paddingBottom: windowHeight / 4,
              paddingBottom:
                Platform.OS === 'ios' ? normalize(20) : normalize(75),
            }}>
            <View
              style={{
                paddingHorizontal: normalize(10),
                marginTop: normalize(20),
              }}>
              <View style={{paddingHorizontal: normalize(10)}}>
                <Text
                  style={{
                    fontFamily: Fonts.FustatSemiBold,
                    fontSize: normalize(16),
                    color: Colors.themeBlack,
                    lineHeight: normalize(22),
                  }}>
                  {'Do You Have A Query?'}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.FustatMedium,
                    fontSize: normalize(12),
                    color: Colors.themeInactiveTxt,
                    lineHeight: normalize(18),
                    paddingTop: normalize(4),
                  }}>
                  Lorem ipsum dolor sit amet consectetur. Tristique praes ent
                  viverra volutpat in. Sed ante ac quis.
                </Text>
              </View>
              <TextIn
                show={title?.length > 0 ? true : false}
                value={title}
                isVisible={false}
                onChangeText={val => setTitle(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Subject'}
                placeholder={'Enter Your Subject'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <TextIn
                show={description?.length > 0 ? true : false}
                value={description}
                isVisible={false}
                onChangeText={val => setDescription(val?.trimStart())}
                height={normalize(100)}
                textAreaHeight={normalize(80)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={300}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Query'}
                placeholder={'Enter Your Query'}
                textAlignVertical={'top'}
                multiline={true}
                numberOfLines={20}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />
            </View>
            <View style={styles.btnMainContainer}>
              <NextBtn
                loading={ProfileReducer?.status == 'Profil/contactUsRequest'}
                height={normalize(50)}
                title={'SUBMIT'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => onSendQuery()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  searchMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: normalize(7),
    flexDirection: 'row',
  },
  searchContainer: {
    width: '100%',
    height: normalize(50),
    backgroundColor: Colors.themeSearchBackground,
    borderColor: Colors.themeSearchBorder,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
  },
  searchInputContainer: {
    width: '80%',
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
    paddingHorizontal: normalize(10),
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    borderLeftWidth: 1,
    borderColor: Colors.themeSearchBorder,
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    lineHeight: normalize(22),
    fontSize: normalize(16),
    color: Colors.themeWhite,
    paddingTop: normalize(10),
    paddingBottom: normalize(5),
  },
  featuredContainer: {
    width: normalize(110),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },

  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    paddingLeft: normalize(3),
    // lineHeight: normalize(22),
  },
  featuredImg: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(56 / 2),
  },

  featuredImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  featuredStarImg: {
    width: normalize(13),
    height: normalize(13),
    marginRight: normalize(3),
    tintColor: Colors.themeStarColor,
  },
  featuredStarRatingTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredStarRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(24),
    width: normalize(60),
    backgroundColor: Colors.themeStarRatingBackground,
    borderRadius: normalize(30),
    marginTop: normalize(10),
  },

  recentContainer: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(18),
  },
});
