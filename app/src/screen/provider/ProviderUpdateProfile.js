import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import GooglePlaces from '../../components/GooglePlaces';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {
  ProfileRequest,
  ResendOtpRequest,
  UpdateProfileRequest,
  verificationOtpRequest,
} from '../../redux/reducer/AuthReducer';
import css from '../../themes/css';
import Images from '../../themes/Images';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const ProviderUpdateProfile = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [name, setName] = useState('');
  const [bioGraphy, setBioGraphy] = useState('');
  const [certificate, setCertificate] = useState();
  const [govtId, setGovtId] = useState('');
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [state, setState] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [imgPicker, setImgPicker] = useState(false);
  const [selectedImg, setSelectedImage] = useState('');
  const [selectedImgObj, setSelectedImgObj] = useState([]);
  const [yearOfExperience, setYearOfExperience] = useState('');
  const [openVerify, setOpenVerify] = useState(false);

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');
  const [four, setFour] = useState('');
  const [timerCount, setTimerCount] = useState(300);

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [isFocused]);

  const getProfile = () => {
    connectionrequest()
      .then(() => {
        dispatch(ProfileRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const profileUpdate = () => {
    if (selectedImg == '') {
      showErrorAlert('Please upload your profile image');
    } else if (name?.trim() == '') {
      showErrorAlert('Please enter your full name');
    } else if (address?.trim() == '') {
      showErrorAlert('Please enter your address');
    } else if (govtId == '') {
      showErrorAlert('Please enter your govt. id proof');
    } else if (bioGraphy == '') {
      showErrorAlert('Please enter biography');
    } else if (yearOfExperience == '') {
      showErrorAlert('Please enter your year of experience');
    } else {
      const obj = new FormData();
      !_.isEmpty(selectedImgObj) &&
        obj.append('profile_picture', selectedImgObj);
      obj.append('full_name', name);
      obj.append('address', address);
      obj.append('street', street);
      obj.append('state', state);
      obj.append('state_code', stateCode);
      obj.append('city', city);
      obj.append('country', country);
      obj.append('zip_code', zipcode);
      obj.append('lat', lat);
      obj.append('lng', lng);
      obj.append('profile_bio', bioGraphy);
      obj.append('user_documents', certificate);
      obj.append('year_of_experiance', yearOfExperience);

      connectionrequest()
        .then(() => {
          dispatch(UpdateProfileRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

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
  const handlecertificateUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        // presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.pdf],
      });

      let docObject = {
        size: response.size,
        name: response.name,
        uri: response.uri,
        type: response.type,
      };

      setCertificate(docObject);
      setGovtId(docObject?.name);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  function convertTime(sec) {
    var hours = Math.floor(sec / 3600);
    hours >= 1 ? (sec = sec - hours * 3600) : (hours = '00');
    var min = Math.floor(sec / 60);
    min >= 1 ? (sec = sec - min * 60) : (min = '00');
    sec < 1 ? (sec = '00') : void 0;

    min.toString().length == 1 ? (min = '0' + min) : void 0;
    sec.toString().length == 1 ? (sec = '0' + sec) : void 0;

    return min + ':' + sec;
  }

  function sendtime(sec) {
    var hours = Math.floor(sec / 3600);
    hours >= 1 ? (sec = sec - hours * 3600) : (hours = '00');
    var min = Math.floor(sec / 60);
    min >= 1 ? (sec = sec - min * 60) : (min = '00');
    sec < 1 ? (sec = '00') : void 0;

    min?.toString().length == 1 ? (min = '0' + min) : void 0;
    sec?.toString().length == 1 ? (sec = '0' + sec) : void 0;

    return min + ':' + sec;
  }

  function resendOTP() {
    setOne('');
    setTwo('');
    setThree('');
    setFour('');
    let obj = {
      email: AuthReducer?.ProfileResponse?.data?.email,
    };
    connectionrequest()
      .then(() => {
        dispatch(ResendOtpRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to internet');
      });
  }

  useEffect(() => {
    inputRef1?.current?.focus();
  }, []);

  useEffect(() => {
    if (openVerify) {
      let interval = setInterval(() => {
        setTimerCount(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [openVerify]);

  const enterOTPComponent = () => {
    return (
      <View style={styles.modalSubContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: normalize(10),
          }}>
          <View style={styles.modalHeaderTxtContainer}>
            <Text style={styles.modalHeaderTxt}>Enter OTP</Text>
            <Text style={styles.modalHeaderSubTxt}>
              We’ve sent an OTP to your registered email/phone number. Please
              enter the OTP below to proceed with resetting your password.
            </Text>
          </View>

          <View
            style={{
              marginTop: normalize(20),
            }}>
            <View
              style={{
                paddingHorizontal: normalize(20),
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {/* {/ ///////////first number/////////// /} */}
              <View
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:
                    one?.length > 0
                      ? Colors.themeGreen
                      : Colors.themePlaceholder,
                  flexDirection: 'row',
                  // backgroundColor:
                  //   one.length > 0 ? 'transparent' : Colors.themeBoxBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  value={one}
                  ref={inputRef1}
                  blurOnSubmit={false}
                  onChangeText={value => {
                    setOne(value);
                    if (value?.length > 0) {
                      inputRef2.current.focus();
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={{
                    fontSize: 22,
                    color: one?.length > 0 ? Colors.themeGreen : 'transparent',
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: Fonts.FustatMedium,
                  }}
                  // onLayout={() => inputRef1.current.focus()}
                />
              </View>
              {/* //////////second number///////////*/}
              <View
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:
                    two?.length > 0
                      ? Colors.themeGreen
                      : Colors.themePlaceholder,
                  flexDirection: 'row',
                  // backgroundColor:
                  //   two.length > 0 ? 'transparent' : Colors.themeBoxBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: normalize(15),
                }}>
                <TextInput
                  value={two}
                  ref={inputRef2}
                  blurOnSubmit={false}
                  onChangeText={value => {
                    setTwo(value);
                    if (value?.length > 0) {
                      inputRef3?.current?.focus();
                    } else {
                      inputRef1?.current?.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef1?.current?.focus();
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    fontSize: 22,
                    color: two?.length > 0 ? Colors.themeGreen : 'transparent',
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: Fonts.FustatMedium,
                  }}
                />
              </View>
              {/* {/ ////////////third number////////// /} */}
              <View
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:
                    three?.length > 0
                      ? Colors.themeGreen
                      : Colors.themePlaceholder,
                  flexDirection: 'row',
                  // backgroundColor:
                  //   three.length > 0 ? 'transparent' : Colors.themeBoxBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: normalize(15),
                }}>
                <TextInput
                  value={three}
                  ref={inputRef3}
                  blurOnSubmit={false}
                  onChangeText={value => {
                    setThree(value);
                    if (value?.length > 0) {
                      inputRef4?.current?.focus();
                    } else {
                      inputRef2?.current?.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef2?.current?.focus();
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    fontSize: 22,
                    color:
                      three?.length > 0 ? Colors.themeGreen : 'transparent',
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: Fonts.FustatMedium,
                  }}
                />
              </View>

              {/* // {/ /////////fourth number/////////////// /} */}
              <View
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:
                    four?.length > 0
                      ? Colors.themeGreen
                      : Colors.themePlaceholder,
                  flexDirection: 'row',
                  // backgroundColor:
                  //   four.length > 0 ? 'transparent' : Colors.themeBoxBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: normalize(15),
                }}>
                <TextInput
                  value={four}
                  ref={inputRef4}
                  blurOnSubmit={false}
                  onChangeText={value => {
                    setFour(value);
                    if (!value) {
                      inputRef3.current?.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef3.current?.focus();
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    fontSize: 22,
                    color: four?.length > 0 ? Colors.themeGreen : 'transparent',
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: Fonts.FustatMedium,
                  }}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.btnMainContainer,
              {
                paddingHorizontal: normalize(10),
                marginTop: normalize(10),
              },
            ]}>
            <NextBtn
              loading={AuthReducer?.status == 'Auth/verificationOtpRequest'}
              height={normalize(50)}
              title={'SUBMIT'}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
              onPress={() => verifyOTP()}
            />
          </View>

          {convertTime(timerCount) !== '00:00' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: normalize(20),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.FustatMedium,
                  fontSize: normalize(11),
                  alignSelf: 'center',
                  color: Colors.themeBlack,
                }}>
                Code expires in :
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.FustatMedium,
                  fontSize: normalize(11),
                  alignSelf: 'center',
                  marginLeft: normalize(3),
                  color: Colors.themeGreen,
                }}>
                {convertTime(timerCount)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            disabled={convertTime(timerCount) !== '00:00' ? true : false}
            onPress={() => {
              resendOTP();
              sendtime(setTimerCount(300));
              otp();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.footerORTxt,
                {
                  color:
                    convertTime(timerCount) == '00:00'
                      ? Colors.themeGreen
                      : Colors.themeInactiveTxt,
                },
              ]}>
              Did not receive OTP?{' '}
              <Text style={{fontWeight: 'bold', fontSize: 17}}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const verifyOTP = () => {
    if (!one) {
      showErrorAlert('Please fillup your first OTP');
    } else if (!two) {
      showErrorAlert('Please fillup your second OTP');
    } else if (!three) {
      showErrorAlert('Please fillup your third OTP');
    } else if (!four) {
      showErrorAlert('Please fillup your fourth OTP');
    } else {
      let obj = {
        email: AuthReducer?.ProfileResponse?.data?.email,
        otp: String(one + two + three + four),
        // otp: parseInt(value),
      };
      connectionrequest()
        .then(() => {
          dispatch(verificationOtpRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to internet');
        });
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/ProfileRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/ProfileSuccess':
        status = AuthReducer.status;
        setName(AuthReducer?.ProfileResponse?.data?.full_name);
        setSelectedImage(
          AuthReducer?.ProfileResponse?.data?.profile_picture
            ? `${constants.IMAGE_URL}${AuthReducer?.ProfileResponse?.data?.profile_picture}`
            : '',
        );

        if (!AuthReducer?.ProfileResponse?.data?.is_user_active) {
          let obj = {
            email: AuthReducer?.ProfileResponse?.data?.email,
          };
          connectionrequest()
            .then(() => {
              dispatch(ResendOtpRequest(obj));
            })
            .catch(err => {
              showErrorAlert('Please connect to internet');
            });

          setOpenVerify(true);
        }
        break;
      case 'Auth/ProfileFailure':
        status = AuthReducer.status;
        break;

      ////////////////// Update Profile //////////////////
      case 'Auth/UpdateProfileRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/UpdateProfileSuccess':
        status = AuthReducer.status;
        NavigationService.navigate('UserMembershipPlan');
        break;
      case 'Auth/UpdateProfileFailure':
        status = AuthReducer.status;
        break;

      //////////////////// otp verify //////////////////
      case 'Auth/verificationOtpRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/verificationOtpSuccess':
        status = AuthReducer.status;
        getProfile();
        setOpenVerify(false);

        break;
      case 'Auth/verificationOtpFailure':
        status = AuthReducer.status;
        setOne('');
        setTwo('');
        setThree('');
        setFour('');
        break;
    }
  }

  return (
    <View style={{flex: 1}}>
      {/* <Loader visible={AuthReducer?.status == 'Auth/UpdateProfileRequest'} /> */}
      <ImageBackground source={Images.Background} style={styles.splashBg}>
        <View
          style={{
            height: StatusBar.currentHeight,
          }}
        />

        <View
          style={{
            flex: 1,
            // paddingHorizontal: normalize(10),
          }}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTxtContainer}>
                <Text style={styles.headerTxt}>Update Profile</Text>
                <Text style={styles.headerSubTxt}>
                  {/* {'Create an account to get in to our platform'} */}
                  {
                    'Lorem ipsum dolor sit amet consectetur. Non blandit augue massa nisl leo sagittis amet.'
                  }
                </Text>
              </View>
            </View>
          </SafeAreaView>

          <View style={{flex: 4}}>
            <SafeAreaView style={styles.bottomContiner}>
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
                    marginTop: normalize(30),
                  }}>
                  <ImageBackground
                    source={
                      selectedImg
                        ? {uri: selectedImg}
                        : Icons.Profile_Placeholder
                    }
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
                      {selectedImg && (
                        <Image
                          source={Icons.UploadProfile}
                          style={{height: normalize(15), width: normalize(15)}}
                        />
                      )}
                    </TouchableOpacity>
                  </ImageBackground>

                  <TextIn
                    show={name?.length > 0 ? true : false}
                    value={name}
                    isVisible={false}
                    onChangeText={val => setName(val?.trimStart())}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={60}
                    marginTop={normalize(15)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    label={'Full Name'}
                    placeholder={'Enter full name'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(12)}
                  />

                  <GooglePlaces
                    value={address}
                    setValue={setAddress}
                    setStreet={setStreet}
                    setLat={setLat}
                    setLng={setLng}
                    setCity={setCity}
                    setState={setState}
                    setStateCode={setStateCode}
                    setCountry={setCountry}
                    setZipcode={setZipcode}
                    flx={1}
                    width={normalize(280)}
                  />

                  <TextIn
                    show={govtId?.length > 0 ? true : false}
                    value={govtId}
                    isVisible={false}
                    onChangeText={val => setGovtId(val?.trimStart())}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={30}
                    marginTop={normalize(10)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    label={'Government ID Proof'}
                    placeholder={'Upload Government Proof ID'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    editable={false}
                    documentShown={true}
                    paddingLeft={normalize(12)}
                    onPress={() => {
                      handlecertificateUpload();
                    }}
                  />

                  <TextIn
                    show={yearOfExperience?.length > 0 ? true : false}
                    value={yearOfExperience}
                    isVisible={false}
                    onChangeText={val => setYearOfExperience(val?.trimStart())}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={60}
                    marginTop={normalize(15)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    keyboardType={'number-pad'}
                    label={'Year of Experience'}
                    placeholder={'Enter Year of Experience'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(12)}
                  />

                  <TextIn
                    show={bioGraphy?.length > 0 ? true : false}
                    value={bioGraphy}
                    isVisible={false}
                    onChangeText={val => setBioGraphy(val?.trimStart())}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={30}
                    marginTop={normalize(10)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    label={'Biography'}
                    placeholder={'Enter Biography'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(12)}
                  />
                </View>

                <View style={styles.btnMainContainer}>
                  <NextBtn
                    loading={AuthReducer?.status == 'Auth/UpdateProfileRequest'}
                    height={normalize(50)}
                    title={'NEXT'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => profileUpdate()}
                  />
                </View>
              </KeyboardAwareScrollView>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
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
      <Modal
        propagateSwipe
        visible={openVerify}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setOpenVerify(false)}>
        {enterOTPComponent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  splashBg: {
    width: Sizes.width,
    height: Sizes.height,
    resizeMode: 'cover',
  },
  logoStyle: {
    height: normalize(120),
    width: normalize(120),
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(20),
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTxtContainer: {
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeWhite,
    fontSize: 26,
    lineHeight: normalize(36),
  },
  headerSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 13,
    color: Colors.themeWhite,
    lineHeight: normalize(17),
    textAlign: 'center',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
  },

  bottomContiner: {
    flex: 1,
    backgroundColor: Colors.themeWhite,
    borderTopLeftRadius: normalize(25),
    borderTopRightRadius: normalize(25),
  },
  bottomTxtContainer: {
    paddingVertical: normalize(10),
    marginBottom: Platform.OS === 'ios' ? 0 : normalize(20),
    paddingTop: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTxt: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    lineHeight: normalize(18),
  },
  checkBox: {
    height: normalize(17),
    width: normalize(17),
    marginRight: normalize(10),
  },
  commonText: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatMedium,
    fontSize: 13,
    lineHeight: normalize(17),
  },
  termTxtConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
  },
  arrowLeft: {
    height: normalize(18),
    width: normalize(18),
    marginRight: normalize(5),
  },
  tabContainer: {
    marginTop: normalize(20),
    marginBottom: normalize(10),
    marginHorizontal: normalize(20),
    flexDirection: 'row',
    borderRadius: normalize(50),
    backgroundColor: Colors.themeTabContainer,
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(10),
    alignItems: 'center',
    borderRadius: normalize(50),
  },
  activeTab: {
    backgroundColor: Colors.themeYellow,
  },
  inactiveTab: {
    backgroundColor: Colors.themeTabContainer,
  },
  activeText: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: 14,
  },
  inactiveText: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: 14,
    color: Colors.themeInactiveTxt,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  modalHeaderTxtContainer: {
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTxt: {
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
    fontSize: 26,
    lineHeight: normalize(28),
    marginBottom: normalize(7),
  },
  modalHeaderSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    color: Colors.themeBlack,
    lineHeight: normalize(16),
    textAlign: 'center',
    paddingHorizontal: normalize(5),
  },
  modalMainContainer: {
    // flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubContainer: {
    backgroundColor: Colors.themeWhite,
    width: '90%',
    borderRadius: 20,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  footerORTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    lineHeight: normalize(20),
    textAlign: 'center',
    paddingVertical: normalize(15),
  },
});

export default ProviderUpdateProfile;
