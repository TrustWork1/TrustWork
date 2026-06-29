import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
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
import {isValidEmail} from '../utils/helpers/Validation';
import constants from '../utils/helpers/constants';
import normalize from '../utils/helpers/normalize';
import CountryCode from '../components/General/CountryCode';
import Dropdown from '../components/Dropdown';
import HTMLTextComponent from '../components/HTMLTextComponent';
import {cmsRequest} from '../redux/reducer/ProfileReducer';

let status = '';
const SMS_WALLET_BALANCE_ERROR =
  'Unable to send OTP SMS because the SMS wallet balance is too low. Please contact support.';

const legalHtmlTags = {
  p: {
    marginTop: 0,
    marginBottom: normalize(12),
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(13),
    lineHeight: normalize(21),
    color: Colors.themeBlack,
  },
  div: {
    marginTop: 0,
    marginBottom: normalize(8),
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(13),
    lineHeight: normalize(21),
    color: Colors.themeBlack,
  },
  strong: {
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(15),
    lineHeight: normalize(22),
    color: Colors.themeBlack,
  },
  a: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(13),
    lineHeight: normalize(21),
    color: Colors.themeGreen,
    textDecorationLine: 'underline',
  },
  li: {
    marginBottom: normalize(6),
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(13),
    lineHeight: normalize(21),
    color: Colors.themeBlack,
  },
  ol: {
    marginTop: normalize(4),
    marginBottom: normalize(10),
    paddingLeft: normalize(18),
  },
  ul: {
    marginTop: normalize(4),
    marginBottom: normalize(10),
    paddingLeft: normalize(18),
  },
};

const LegalModalShell = ({title, subtitle, children, onClose}) => {
  return (
    <View style={styles.legalModalContainer}>
      <View style={styles.legalModalHeader}>
        <View style={styles.legalHeaderTextContainer}>
          <Text style={styles.legalModalTitle}>{title}</Text>
          <Text style={styles.legalModalSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.legalCloseBtn}>
          <Image
            source={Icons.Cross}
            resizeMode="contain"
            style={styles.legalCloseIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.legalDivider} />

      <ScrollView
        bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        style={styles.modalScrollView}
        contentContainerStyle={styles.modalScrollContent}>
        {children}
      </ScrollView>

      <View style={styles.legalFooter}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onClose}
          style={styles.legalPrimaryBtn}>
          <Text style={styles.legalPrimaryBtnTxt}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SignUp = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [selectedTab, setSelectedTab] = useState('client');
  const [showSeen, setShowSeen] = useState(false);
  const [TandCModal, setTandCModal] = useState(false);
  const [rulesMoadal, setRulesMoadal] = useState(false);
  const [smsWalletErrorModal, setSmsWalletErrorModal] = useState(false);
  const [smsWalletErrorMessage, setSmsWalletErrorMessage] = useState('');

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
  const [isCheckedRules, setIsCheckedRules] = useState(false);
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
    connectionrequest()
      .then(() => {
        dispatch(cmsRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
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
    const trimmedEmail = email.trim();

    if (!name.trim()) {
      showErrorAlert(errorMessages.ENTER_FULL_NAME);
      return;
    }

    if (!trimmedEmail) {
      showErrorAlert(errorMessages.ENTER_EMAIL);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
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
    if (!isCheckedRules) {
      showErrorAlert(errorMessages.ACCEPT_RULES);
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

      // if (!companyName) {
      //   showErrorAlert(errorMessages.ENTER_COMPANY_NAME);
      //   return;
      // }

      // if (!licenseNo) {
      //   showErrorAlert(errorMessages.ENTER_LICENSE_NUMBER);
      //   return;
      // }
    }

    let obj = {
      full_name: name,
      phone_extension: code,
      phone: phoneNo || '',
      email: trimmedEmail,
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
        email: email.trim(),
        otp: String(one + two + three + four),
        // otp: parseInt(value),
      };
      connectionrequest()
        .then(() => {
          dispatch(verificationOtpRequest(obj));
        })
        .catch(() => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  const RulesComponent = () => {
    const rulesContent = ProfileReducer?.cmsResponse?.data?.[6]?.content;

    return (
      <LegalModalShell
        title="Smart Contract Rules"
        subtitle="Review the terms that keep TRUST WORK projects clear and secure."
        onClose={closeRulesModal}>
        {rulesContent ? (
          <HTMLTextComponent
            htmlContent={rulesContent}
            containerStyle={styles.legalHtmlContainer}
            tagsStyles={legalHtmlTags}
          />
        ) : (
          <Text style={styles.rulesEmptyTxt}>
            Smart Contract Rules are not available right now.
          </Text>
        )}
      </LegalModalShell>
    );
  };

  const TermsConditionComponent = () => {
    const termsContent = ProfileReducer?.cmsResponse?.data?.[1]?.content;

    return (
      <LegalModalShell
        title="Acceptance"
        subtitle="Read the terms, conditions, and privacy policy before continuing."
        onClose={() => setTandCModal(false)}>
        {termsContent ? (
          <HTMLTextComponent
            htmlContent={termsContent}
            containerStyle={styles.legalHtmlContainer}
            tagsStyles={legalHtmlTags}
          />
        ) : (
          <Text style={styles.rulesEmptyTxt}>
            Terms and conditions are not available right now.
          </Text>
        )}
      </LegalModalShell>
    );
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
        if (AuthReducer?.error?.message === SMS_WALLET_BALANCE_ERROR) {
          setSmsWalletErrorMessage(AuthReducer.error.message);
          setSmsWalletErrorModal(true);
        }
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
        inputRef1.current.focus();
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

    let obj = {
      email: email.trim(),
    };
    connectionrequest()
      .then(() => {
        dispatch(ResendOtpRequest(obj));
      })
      .catch(() => {
        showErrorAlert('Please connect to the internet');
      });
  }

  const enterOTPComponent = () => {
    return (
      <View style={styles.modalSubContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{
            top: normalize(8),
            bottom: normalize(8),
            left: normalize(8),
            right: normalize(8),
          }}
          onPress={closeOTPModal}
          style={styles.otpModalCloseBtn}>
          <Image
            source={Icons.Cross}
            resizeMode="contain"
            style={styles.otpModalCloseIcon}
          />
        </TouchableOpacity>

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

  const closeOTPModal = () => {
    setShowSeen(false);
    setOne('');
    setTwo('');
    setThree('');
    setFour('');
  };

  const closeRulesModal = () => {
    setRulesMoadal(false);
  };

  const closeSmsWalletErrorModal = () => {
    setSmsWalletErrorModal(false);
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
                    style={{
                      width: normalize(280),
                      marginLeft: normalize(20),
                      marginTop: normalize(10),
                      marginBottom: 0,
                    }}>
                    <Text
                      style={{
                        color: Colors.themeBlack,
                        fontFamily: Fonts.FustatMedium,
                        textAlign: 'left',
                        paddingBottom: normalize(2),
                        fontSize: 14,
                        lineHeight: normalize(22),
                      }}>
                      Phone Number
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: normalize(8),
                      }}>
                      <Dropdown
                        show={code?.length > 0 ? true : false}
                        isPhone={true}
                        data={CountryCode}
                        height={normalize(50)}
                        width={normalize(85)}
                        borderColor={Colors.themeBoxBorder}
                        borderWidth={1}
                        fonts={Fonts.VerdanaProMedium}
                        borderRadius={normalize(6)}
                        fontSize={14}
                        marginTop={0}
                        paddingLeft={normalize(8)}
                        valueColor={Colors.themeBlack}
                        value={code}
                        isSerachBar={true}
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
                        width={normalize(187)}
                        fonts={Fonts.FustatMedium}
                        borderColor={Colors.themeBoxBorder}
                        borderWidth={1}
                        maxLength={10}
                        keyboardType={'number-pad'}
                        marginTop={0}
                        outlineTxtwidth={normalize(50)}
                        placeholder={'Enter Phone Number'}
                        placeholderTextColor={Colors.themePlaceholder}
                        borderRadius={normalize(6)}
                        fontSize={14}
                        paddingLeft={normalize(10)}
                        paddingRight={normalize(10)}
                      />
                    </View>
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
                        label={'Company/Organization Name (Optional)'}
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
                        label={'Taxpayers Number (Optional)'}
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                      <Image
                        source={
                          isChecked ? Icons.CheckBoxFill : Icons.CheckboxUnFill
                        }
                        resizeMode="contain"
                        style={styles.checkBox}
                      />
                    </TouchableOpacity>
                    <Text style={styles.commonText}>
                      {
                        'Accept terms & conditions and privacy policy \nof TRUST WORK.'
                      }
                      <TouchableOpacity
                        onPress={() => {
                          setTandCModal(true);
                        }}>
                        <Text style={styles.greenTxt}>view</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                </View>

                <View style={styles.termTxtConatiner}>
                  <View style={styles.termRow}>
                    <TouchableOpacity
                      onPress={() => setIsCheckedRules(!isCheckedRules)}>
                      <Image
                        source={
                          isCheckedRules
                            ? Icons.CheckBoxFill
                            : Icons.CheckboxUnFill
                        }
                        resizeMode="contain"
                        style={styles.checkBox}
                      />
                    </TouchableOpacity>
                    <Text style={styles.termText}>
                      Accept Trustwork Smart Contract Rules.
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setRulesMoadal(true);
                      }}
                      style={styles.termViewBtn}>
                      <Text style={styles.termViewTxt}>view</Text>
                    </TouchableOpacity>
                  </View>
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
        isVisible={showSeen}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setShowSeen(false)}>
        {enterOTPComponent()}
      </Modal>

      <Modal
        isVisible={TandCModal}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setTandCModal(!TandCModal)}
        onBackdropPress={() => setTandCModal(!TandCModal)}>
        {TermsConditionComponent()}
      </Modal>

      <Modal
        isVisible={rulesMoadal}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={closeRulesModal}
        onBackdropPress={closeRulesModal}>
        {RulesComponent()}
      </Modal>

      <Modal
        isVisible={smsWalletErrorModal}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        style={styles.bottomErrorModalContainer}
        onBackButtonPress={closeSmsWalletErrorModal}
        onBackdropPress={closeSmsWalletErrorModal}>
        <View style={styles.errorModalContent}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={closeSmsWalletErrorModal}
            style={styles.errorModalCloseBtn}>
            <Image
              source={Icons.Cross}
              resizeMode="contain"
              style={styles.errorModalCloseIcon}
            />
          </TouchableOpacity>

          <Text style={styles.errorModalTitle}>Unable to Send OTP</Text>
          <Text style={styles.errorModalMessage}>{smsWalletErrorMessage}</Text>
        </View>
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
  legalModalContainer: {
    width: '92%',
    maxHeight: Sizes.height * 0.82,
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(18),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: normalize(8),
    },
    shadowOpacity: 0.14,
    shadowRadius: normalize(16),
    elevation: 8,
  },
  legalModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: normalize(18),
    paddingBottom: normalize(14),
    paddingLeft: normalize(18),
    paddingRight: normalize(12),
    backgroundColor: Colors.themeWhite,
  },
  legalHeaderTextContainer: {
    flex: 1,
    paddingRight: normalize(10),
  },
  legalModalTitle: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(21),
    lineHeight: normalize(27),
  },
  legalModalSubtitle: {
    color: Colors.themeInactiveTxt,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(13),
    lineHeight: normalize(19),
    marginTop: normalize(5),
  },
  legalCloseBtn: {
    height: normalize(34),
    width: normalize(34),
    borderRadius: normalize(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.themeDocBackground,
  },
  legalCloseIcon: {
    height: normalize(13),
    width: normalize(13),
    tintColor: Colors.themeGreen,
  },
  legalDivider: {
    height: 1,
    backgroundColor: Colors.themeBoxBorder,
  },
  modalScrollView: {
    width: '100%',
    maxHeight: Sizes.height * 0.58,
  },
  modalScrollContent: {
    alignItems: 'center',
    paddingTop: normalize(16),
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(8),
  },
  legalHtmlContainer: {
    width: '100%',
  },
  rulesEmptyTxt: {
    color: Colors.themeInactiveTxt,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    lineHeight: normalize(21),
    textAlign: 'center',
    paddingVertical: normalize(28),
    paddingHorizontal: normalize(14),
  },
  legalFooter: {
    paddingTop: normalize(12),
    paddingBottom: Platform.OS === 'ios' ? normalize(18) : normalize(14),
    paddingHorizontal: normalize(18),
    borderTopWidth: 1,
    borderTopColor: Colors.themeBoxBorder,
    backgroundColor: Colors.themeWhite,
  },
  legalPrimaryBtn: {
    height: normalize(46),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.themeGreen,
  },
  legalPrimaryBtnTxt: {
    color: Colors.themeWhite,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(15),
    lineHeight: normalize(20),
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
  greenTxt: {
    color: Colors.themeGreen,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    lineHeight: normalize(17),
    top: Platform.OS == 'ios' ? normalize(12) : normalize(6),
    left: normalize(5),
  },
  termTxtConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
  },
  termRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termText: {
    flex: 1,
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatMedium,
    fontSize: 13,
    lineHeight: normalize(17),
  },
  termViewBtn: {
    paddingVertical: normalize(4),
    paddingLeft: normalize(8),
  },
  termViewTxt: {
    color: Colors.themeGreen,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    lineHeight: normalize(17),
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
    paddingTop: normalize(18),
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
  otpModalCloseBtn: {
    height: normalize(36),
    width: normalize(36),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: normalize(8),
    top: normalize(8),
    zIndex: 1,
  },
  otpModalCloseIcon: {
    height: normalize(16),
    width: normalize(16),
    tintColor: Colors.themeGreen,
  },
  bottomErrorModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  errorModalContent: {
    width: '100%',
    backgroundColor: Colors.themeWhite,
    borderTopLeftRadius: normalize(22),
    borderTopRightRadius: normalize(22),
    paddingTop: normalize(22),
    paddingBottom: Platform.OS === 'ios' ? normalize(30) : normalize(24),
    paddingHorizontal: normalize(20),
  },
  errorModalCloseBtn: {
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.themeDocBackground,
  },
  errorModalCloseIcon: {
    height: normalize(12),
    width: normalize(12),
  },
  errorModalTitle: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(20),
    lineHeight: normalize(26),
    marginTop: normalize(6),
    textAlign: 'center',
  },
  errorModalMessage: {
    color: Colors.themeInactiveTxt,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    lineHeight: normalize(20),
    marginTop: normalize(10),
    textAlign: 'center',
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
