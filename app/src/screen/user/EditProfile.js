import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {UpdateProfileRequest} from '../../redux/reducer/AuthReducer';
import css from '../../themes/css';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import {isValidPhone} from '../../utils/helpers/Validation';
import Dropdown from '../../components/Dropdown';
import CountryCode from '../../components/General/CountryCode';

let status = '';

const EditProfile = props => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [imgPicker, setImgPicker] = useState(false);
  const [selectedImg, setSelectedImage] = useState('');
  const [selectedImgObj, setSelectedImgObj] = useState([]);
  const [userType, setUserType] = useState('');

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    setFullName(AuthReducer?.ProfileResponse?.data?.full_name);
    setEmail(AuthReducer?.ProfileResponse?.data?.email);
    setPhone(AuthReducer?.ProfileResponse?.data?.phone);
    setCompanyName(AuthReducer?.ProfileResponse?.data?.associated_organization);
    setSelectedImage(
      AuthReducer?.ProfileResponse?.data?.profile_picture
        ? `${constants.IMAGE_URL}${AuthReducer?.ProfileResponse?.data?.profile_picture}`
        : '',
    );
    setUserType(AuthReducer?.ProfileResponse?.data?.user_type);
    setCode(
      AuthReducer?.ProfileResponse?.data?.phone_extension
        ? AuthReducer?.ProfileResponse?.data?.phone_extension
        : '',
    );
  }, [isFocused]);

  const withCamera = async type => {
    ImagePicker?.openCamera({
      width: 300,
      height: 400,
      mediaType: 'photo',
    })
      .then(response => {
        let imageObj = {};
        let fileName = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');

        if (fileName.toLowerCase().endsWith('.heic')) {
          fileName = fileName.replace(/\.heic$/i, '.jpg');
        }

        imageObj.name = fileName;
        imageObj.type =
          response.mime === 'image/heic' ? 'image/jpeg' : response.mime;
        imageObj.uri = response.path;
        setImgPicker(false);
        setSelectedImage(imageObj.uri);
        setSelectedImgObj(imageObj);
      })
      .catch(err => console.log(err));
  };

  function FromGalary(type) {
    ImagePicker?.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
    })
      .then(response => {
        let imageObj = {};
        let fileName = response.filename
          ? response.filename
          : response.path.replace(/^.*[\\\/]/, '');

        if (fileName.toLowerCase().endsWith('.heic')) {
          fileName = fileName.replace(/\.heic$/i, '.jpg');
        }

        imageObj.name = fileName;
        imageObj.type =
          response.mime === 'image/heic' ? 'image/jpeg' : response.mime;
        imageObj.uri = response.path;
        setImgPicker(false);
        setSelectedImage(imageObj.uri);
        setSelectedImgObj(imageObj);
      })
      .catch(err => console.log(err));
  }
  const validPhone = isValidPhone(phone);

  const profileUpdate = () => {
    if (fullName?.trim() === '') {
      return showErrorAlert('Please enter your full name');
    }

    if (phone?.trim() === '') {
      return showErrorAlert('Please enter your phone number');
    }

    if (!validPhone) {
      return showErrorAlert('Please enter a valid phone number');
    }

    const obj = new FormData();

    if (!_.isEmpty(selectedImgObj)) {
      obj.append('profile_picture', selectedImgObj);
    }
    obj.append('phone', phone.replace(/-/g, ''));
    obj.append('full_name', fullName);
    obj.append('email', email);
    if (userType === 'Service Provider') {
      obj.append('associated_organization', companyName);
    }

    connectionrequest()
      .then(() => {
        dispatch(UpdateProfileRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/UpdateProfileRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/UpdateProfileSuccess':
        status = AuthReducer.status;
        NavigationService.goBack();
        break;
      case 'Auth/UpdateProfileFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          AuthReducer?.status == 'Auth/UpdateProfileRequest' ||
          AuthReducer?.status == 'Auth/ProfileRequest'
        }
      /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'Edit Profile'} />
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
                marginTop: normalize(30),
              }}>
              <ImageBackground
                source={selectedImg ? {uri: selectedImg} : Icons.UserPro}
                // source={Images.User_2}
                resizeMode="stretch"
                imageStyle={{
                  borderRadius: normalize(49),
                }}
                style={{
                  height: normalize(98),
                  width: normalize(98),
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setImgPicker(true);
                  }}
                  style={{
                    position: 'absolute',
                    height: normalize(98),
                    width: normalize(98),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Icons.UploadProfile}
                    style={{height: normalize(15), width: normalize(15)}}
                  />
                </TouchableOpacity>
              </ImageBackground>

              <TextIn
                show={fullName?.length > 0 ? true : false}
                value={fullName}
                isVisible={false}
                onChangeText={val => setFullName(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(25)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Full Name'}
                placeholder={'Enter Full Name'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                // arrowshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <TextIn
                show={email?.length > 0 ? true : false}
                value={email}
                isVisible={false}
                onChangeText={val => setEmail(val?.trimStart())}
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
                label={'Email Address'}
                placeholder={'Enter Email Address'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
                editable={
                  AuthReducer?.ProfileResponse?.data?.email ? false : true
                }
              />
              <View style={[css.rowBetween, css.asc, {width: normalize(280)}]}>
                {/* <Dropdown
                  show={code?.length > 0 ? true : false}
                  isPhone={true}
                  data={CountryCode}
                  height={normalize(50)}
                  width={normalize(75)}
                  borderColor={Colors.themeBoxBorder}
                  borderWidth={1}
                  fonts={Fonts.VerdanaProMedium}
                  borderRadius={normalize(6)}
                  fontSize={14}
                  marginTop={normalize(25)}
                  paddingLeft={normalize(12)}
                  valueColor={Colors.themeBlack}
                  paddingHorizontal={normalize(5)}
                  // label={'Project Category'}
                  // placeholder={'Select Category'}
                  value={code}
                  // disabled={item?.bid_count > 0 || false}
                  // modalHeight
                  marginBottom={normalize(10)}
                  marginLeft={normalize(10)}
                  outlineTxtwidth={normalize(50)}
                  placeholderTextColor={Colors.themePlaceholder}
                  onChange={(selecetedItem, index) => {
                    setCode(selecetedItem?.dial_code);
                  }}
                /> */}

                <TextIn
                  show={phone?.length > 0 ? true : false}
                  value={`${code}${phone}`}
                  isVisible={false}
                  onChangeText={val => setPhone(val?.trimStart())}
                  height={normalize(50)}
                  width={normalize(280)}
                  fonts={Fonts.FustatMedium}
                  borderColor={Colors.themeBoxBorder}
                  borderWidth={1}
                  maxLength={60}
                  marginTop={normalize(15)}
                  marginBottom={normalize(10)}
                  outlineTxtwidth={normalize(50)}
                  label={'Phone Number'}
                  placeholder={'Enter Phone Number'}
                  placeholderTextColor={Colors.themePlaceholder}
                  borderRadius={normalize(6)}
                  fontSize={14}
                  //Eyeshow={true}
                  paddingLeft={normalize(10)}
                  paddingRight={normalize(10)}
                  keyboardType={'numeric'}
                  editable={
                    AuthReducer?.ProfileResponse?.data?.phone ? false : true
                  }
                />
              </View>
              {userType === 'Service Provider' && (
                <TextIn
                  show={companyName?.length > 0 ? true : false}
                  value={companyName}
                  isVisible={false}
                  onChangeText={val => setCompanyName(val?.trimStart())}
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
                  label={'Company/Organization Name'}
                  placeholder={'Enter Company/Organization Name'}
                  //placeholderIcon={Icons.Email}
                  placeholderTextColor={Colors.themePlaceholder}
                  borderRadius={normalize(6)}
                  fontSize={14}
                  //Eyeshow={true}
                  paddingLeft={normalize(10)}
                  paddingRight={normalize(10)}
                />
              )}
            </View>
            <View style={styles.btnMainContainer}>
              <NextBtn
                //   loading={AuthReducer?.status == 'Auth/signinRequest'}
                height={normalize(50)}
                title={'save'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  profileUpdate();
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={imgPicker}
        onBackdropPress={() => setImgPicker(false)}
        style={[css.m0, css.jcfe]}>
        <View
          style={[css.px2, {backgroundColor: Colors.themeProjectBackground}]}>
          <View style={[css.px3, css.py3]}>
            <NextBtn
              title="Camera"
              onPress={withCamera}
              color={Colors.themeWhite}
              borderColor={Colors.themeGreen}
              backgroundColor={Colors.themeGreen}
            />
          </View>
          <View style={[css.px3, css.pb5]}>
            <NextBtn
              title="Gallery"
              onPress={FromGalary}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfile;

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
