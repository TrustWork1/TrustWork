import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {
  ResendOtpRequest,
  signUpRequest,
  verificationOtpRequest,
} from '../redux/reducer/AuthReducer';
import Images from '../themes/Images';
import {Colors, Fonts, Icons, Sizes} from '../themes/Themes';
import errorMessages from '../utils/errorMessages';
import connectionrequest from '../utils/helpers/NetInfo';
import showErrorAlert from '../utils/helpers/Toast';
import constants from '../utils/helpers/constants';
import normalize from '../utils/helpers/normalize';
import css from '../themes/css';
import CountryCode from '../components/General/CountryCode';
import Dropdown from '../components/Dropdown';

let status = '';

const SignUp = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  var validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var mobileValidate = /^\d*[1-9]\d*$/;

  const [selectedTab, setSelectedTab] = useState('client');
  const [showSeen, setShowSeen] = useState(false);

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  const [timerCount, setTimerCount] = useState(300);
  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');
  const [four, setFour] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('+1');
  const [phoneNo, setPhoneNo] = useState('');
  const [profession, setProfession] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [referalCode, setReferalCode] = useState('');

  useEffect(() => {
    if (isFocused) {
      getAddress();
    }
  }, [isFocused]);

  useEffect(() => {
    inputRef1?.current?.focus();
  }, []);

  useEffect(() => {
    if (showSeen) {
      let interval = setInterval(() => {
        setTimerCount(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSeen]);

  const otp = () => {
    let interval = setInterval(() => {
      setTimerCount(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const getAddress = () => {
    AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS)
      .then(res => {
        // setAddress(JSON.parse(res)?.address);
        setLatitude(JSON.parse(res)?.latitude);
        setLongitude(JSON.parse(res)?.longitude);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onSignUp = () => {
    const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!name.trim()) {
      showErrorAlert(errorMessages.ENTER_FULL_NAME);
      return;
    }

    // Ensure at least one of email or phone number is provided
    if (!email && !phoneNo) {
      showErrorAlert(errorMessages.ENTER_EMAIL_OR_MOBILE);
      return;
    }

    // Validate email if provided
    if (email && !validate.test(email)) {
      showErrorAlert(errorMessages.EMAIL_IN_CORRECT_FORMAT);
      return;
    }

    // Validate phone number if provided
    if (phoneNo && phoneNo.length < 9) {
      showErrorAlert(errorMessages.NUMBER_IN_CORRECT_FORMAT);
      return;
    }

    if (!password) {
      showErrorAlert(errorMessages.ENTER_PASSWORD);
      return;
    }

    if (password.length <= 7) {
      showErrorAlert(errorMessages.PASSWORD_ALERT_MSG);
      return;
    }

    if (!confirmPassword) {
      showErrorAlert(errorMessages.ENTER_CONFIRM_PASSWORD);
      return;
    }

    if (password !== confirmPassword) {
      showErrorAlert(errorMessages.CONFIRM_PASSWORD);
      return;
    }

    if (!isChecked) {
      showErrorAlert(errorMessages.ACCEPT_TERM_CONDITION);
      return;
    }

    if (!selectedTab) {
      showErrorAlert(errorMessages.SELECT_USER_TYPE);
      return;
    }

    // Additional provider-specific validation
    if (selectedTab === 'provider') {
      if (!profession) {
        showErrorAlert(errorMessages.ENTER_PROFESSION);
        return;
      }

      if (!companyName) {
        showErrorAlert(errorMessages.ENTER_COMPANY_NAME);
        return;
      }

      if (!licenseNo) {
        showErrorAlert(errorMessages.ENTER_LICENSE_NUMBER);
        return;
      }
    }

    let obj = {
      full_name: name,
      phone_extension: code,
      phone: phoneNo || '',
      email: email || '',
      password: password,
      user_type: selectedTab,
      latitude: latitude,
      longitude: longitude,
      referred_by_code: referalCode,
    };

    // Add provider details if applicable
    if (selectedTab === 'provider') {
      obj.profession = profession;
      obj.associated_organization = companyName;
      obj.organization_registration_id = licenseNo;
    }

    connectionrequest()
      .then(() => {
        dispatch(signUpRequest(obj));
      })
      .catch(() => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const verifyOTP = () => {
    if (email?.trim() == '') {
      let obj = {
        phone: phoneNo,
        otp: String(one + two + three + four),
        // otp: parseInt(value),
      };
      connectionrequest()
        .then(() => {
          dispatch(verificationOtpRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    } else {
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
          email: email,
          otp: String(one + two + three + four),
          // otp: parseInt(value),
        };
        connectionrequest()
          .then(() => {
            dispatch(verificationOtpRequest(obj));
          })
          .catch(err => {
            showErrorAlert('Please connect to the internet');
          });
      }
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/signUpRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/signUpSuccess':
        status = AuthReducer.status;
        setShowSeen(true);
        // NavigationService.navigate('SignIn');
        break;
      case 'Auth/signUpFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/verificationOtpRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/verificationOtpSuccess':
        status = AuthReducer.status;
        setShowSeen(false);

        NavigationService.navigate('SignIn');

        break;
      case 'Auth/verificationOtpFailure':
        status = AuthReducer.status;
        setOne('');
        setTwo('');
        setThree('');
        setFour('');
        // inputRef1.current.focus();
        break;
    }
  }

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

    if (email?.trim() == '') {
      let obj = {
        phone: phoneNo,
      };
      connectionrequest()
        .then(() => {
          dispatch(ResendOtpRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    } else if (phoneNo?.trim() == '') {
      let obj = {
        email: email,
      };
      connectionrequest()
        .then(() => {
          dispatch(ResendOtpRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  }

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

  const clearPrevious = () => {
    setName('');
    setEmail('');
    setPhoneNo('');
    setProfession('');
    setCompanyName('');
    setLicenseNo('');
    setPassword('');
    setConfirmPassword('');
  };

  const ToggleTab = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'client' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => {
            setSelectedTab('client');
            clearPrevious();
          }}>
          <Text
            style={
              selectedTab === 'client' ? styles.activeText : styles.inactiveText
            }>
            As A Client
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'provider' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => {
            setSelectedTab('provider');
            clearPrevious();
          }}>
          <Text
            style={
              selectedTab === 'provider'
                ? styles.activeText
                : styles.inactiveText
            }>
            As A Service Provider
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* <Loader visible={AuthReducer?.status == 'Auth/signUpRequest'} /> */}
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
                <Text style={styles.headerTxt}>Sign Up</Text>
                <Text style={styles.headerSubTxt}>
                  {/* {'Create an account to get in to our platform'} */}
                  {'Please enter your information to create your profile.'}
                </Text>
              </View>
            </View>
          </SafeAreaView>

          <View style={{flex: 4}}>
            <SafeAreaView style={styles.bottomContiner}>
              <ToggleTab />
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
                    marginTop: normalize(10),
                  }}>
                  <TextIn
                    show={name?.length > 0 ? true : false}
                    value={name}
                    isVisible={false}
                    onChangeText={val =>
                      setName(
                        val
                          ?.trimStart()
                          .replace(/\b\w/g, char => char.toUpperCase()),
                      )
                    }
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={60}
                    marginTop={normalize(10)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    label={'Full Name'}
                    placeholder={'Enter Full Name'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />

                  <TextIn
                    show={email?.length > 0 ? true : false}
                    value={email}
                    isVisible={false}
                    onChangeText={val => {
                      setEmail(val?.trimStart()?.toLowerCase());
                    }}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={60}
                    marginTop={normalize(10)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
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
                  />

                  <View
                    style={[css.rowBetween, css.asc, {width: normalize(280)}]}>
                    <Dropdown
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
                      marginTop={
                        Platform.OS == 'ios' ? normalize(20) : normalize(15)
                      }
                      paddingLeft={normalize(12)}
                      valueColor={Colors.themeBlack}
                      paddingHorizontal={normalize(5)}
                      // label={'Project Category'}
                      // placeholder={'Select Category'}
                      value={code}
                      isSerachBar={true}
                      // disabled={item?.bid_count > 0 || false}
                      // modalHeight
                      marginBottom={normalize(10)}
                      marginLeft={normalize(10)}
                      outlineTxtwidth={normalize(50)}
                      placeholderTextColor={Colors.themePlaceholder}
                      onChange={(selecetedItem, index) => {
                        setCode(selecetedItem?.dial_code);
                      }}
                    />

                    <TextIn
                      show={phoneNo?.length > 0 ? true : false}
                      value={phoneNo}
                      isVisible={false}
                      onChangeText={val => {
                        setPhoneNo(val?.replace(/[^0-9]/g, ''));
                      }}
                      height={normalize(50)}
                      width={normalize(200)}
                      fonts={Fonts.FustatMedium}
                      borderColor={Colors.themeBoxBorder}
                      borderWidth={1}
                      maxLength={10}
                      keyboardType={'number-pad'}
                      marginTop={normalize(10)}
                      marginBottom={normalize(10)}
                      marginLeft={normalize(-80)}
                      outlineTxtwidth={normalize(50)}
                      label={'Phone Number'}
                      placeholder={'Enter Phone Number'}
                      //placeholderIcon={Icons.Email}
                      placeholderTextColor={Colors.themePlaceholder}
                      borderRadius={normalize(6)}
                      fontSize={14}
                      //Eyeshow={true}
                      paddingLeft={normalize(10)}
                      paddingRight={normalize(10)}
                    />
                  </View>

                  {selectedTab === 'provider' && (
                    <>
                      <TextIn
                        show={profession?.length > 0 ? true : false}
                        value={profession}
                        isVisible={false}
                        onChangeText={val =>
                          setProfession(
                            val
                              ?.trimStart()
                              .replace(/\b\w/g, char => char.toUpperCase()),
                          )
                        }
                        height={normalize(50)}
                        width={normalize(280)}
                        fonts={Fonts.FustatMedium}
                        borderColor={Colors.themeBoxBorder}
                        borderWidth={1}
                        maxLength={50}
                        marginTop={normalize(10)}
                        marginBottom={normalize(10)}
                        marginLeft={normalize(20)}
                        outlineTxtwidth={normalize(50)}
                        label={'Profession'}
                        placeholder={'Enter Profession'}
                        //placeholderIcon={Icons.Email}
                        placeholderTextColor={Colors.themePlaceholder}
                        borderRadius={normalize(6)}
                        fontSize={14}
                        //Eyeshow={true}
                        paddingLeft={normalize(10)}
                        paddingRight={normalize(10)}
                      />

                      <TextIn
                        show={companyName?.length > 0 ? true : false}
                        value={companyName}
                        isVisible={false}
                        onChangeText={val =>
                          setCompanyName(
                            val
                              ?.trimStart()
                              .replace(/\b\w/g, char => char.toUpperCase()),
                          )
                        }
                        height={normalize(50)}
                        width={normalize(280)}
                        fonts={Fonts.FustatMedium}
                        borderColor={Colors.themeBoxBorder}
                        borderWidth={1}
                        maxLength={50}
                        marginTop={normalize(10)}
                        marginBottom={normalize(10)}
                        marginLeft={normalize(20)}
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

                      <TextIn
                        show={licenseNo?.length > 0 ? true : false}
                        value={licenseNo}
                        isVisible={false}
                        onChangeText={val => setLicenseNo(val?.trimStart())}
                        height={normalize(50)}
                        width={normalize(280)}
                        fonts={Fonts.FustatMedium}
                        borderColor={Colors.themeBoxBorder}
                        borderWidth={1}
                        maxLength={50}
                        marginTop={normalize(10)}
                        marginBottom={normalize(10)}
                        marginLeft={normalize(20)}
                        outlineTxtwidth={normalize(50)}
                        label={'Taxpayers Number'}
                        placeholder={'Enter Taxpayers Number'}
                        //placeholderIcon={Icons.Email}
                        placeholderTextColor={Colors.themePlaceholder}
                        borderRadius={normalize(6)}
                        fontSize={14}
                        //Eyeshow={true}
                        paddingLeft={normalize(10)}
                        paddingRight={normalize(10)}
                      />
                    </>
                  )}
                  <TextIn
                    show={password?.length > 0 ? true : false}
                    value={password}
                    isVisible={true}
                    onChangeText={val => {
                      setPassword(val?.replace(/\s/g, ''));
                    }}
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    outlineTxtwidth={normalize(80)}
                    borderWidth={1}
                    marginTop={normalize(10)}
                    marginBottom={normalize(15)}
                    marginLeft={normalize(20)}
                    maxLength={30}
                    label={'Password'}
                    placeholder={'Create Password'}
                    //placeholderIcon={Icons.Key}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />

                  <TextIn
                    show={confirmPassword?.length > 0 ? true : false}
                    value={confirmPassword}
                    isVisible={true}
                    onChangeText={val =>
                      setConfirmPassword(val?.replace(/\s/g, ''))
                    }
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    outlineTxtwidth={normalize(80)}
                    borderWidth={1}
                    marginTop={normalize(10)}
                    marginBottom={normalize(15)}
                    marginLeft={normalize(20)}
                    maxLength={30}
                    label={'Confirm Password'}
                    placeholder={'Confirm Password'}
                    //placeholderIcon={Icons.Key}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />

                  <TextIn
                    show={referalCode?.length > 0 ? true : false}
                    value={referalCode}
                    isVisible={false}
                    onChangeText={val =>
                      setReferalCode(
                        val?.trim().replace(/\s+/g, '').toUpperCase(),
                      )
                    }
                    height={normalize(50)}
                    width={normalize(280)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={10}
                    marginTop={normalize(10)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(20)}
                    outlineTxtwidth={normalize(50)}
                    label={'Referal Code (Optional)'}
                    placeholder={'Enter Referal Code'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />
                </View>

                <View style={styles.termTxtConatiner}>
                  <TouchableOpacity
                    onPress={() => setIsChecked(!isChecked)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        isChecked ? Icons.CheckBoxFill : Icons.CheckboxUnFill
                      }
                      resizeMode="contain"
                      style={styles.checkBox}
                    />
                    <Text
                      //   onPress={() => {
                      //     Linking.openURL(
                      //       `${constants.WEB_BASE_URL}/terms-condition/`,
                      //     ).catch(err => {
                      //       console.log(err);
                      //     });
                      //   }}
                      style={styles.commonText}>
                      {
                        'Accept terms & conditions and privacy policy \nof TRUST WORK.'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnMainContainer}>
                  <NextBtn
                    loading={AuthReducer?.status == 'Auth/signUpRequest'}
                    height={normalize(50)}
                    title={'SIGN UP'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      onSignUp();
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => NavigationService.navigate('SignIn')}
                    style={styles.bottomTxtContainer}>
                    <Image
                      source={Icons.ArrowLeft}
                      resizeMode="contain"
                      style={styles.arrowLeft}
                    />
                    <Text style={styles.bottomTxt}>
                      Have an account?{' '}
                      <Text style={{fontWeight: 'bold'}}>Log In</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
      <Modal
        propagateSwipe
        visible={showSeen}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setShowSeen(false)}>
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
    // marginTop: normalize(15),
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

export default SignUp;
