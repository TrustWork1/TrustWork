import AsyncStorage from '@react-native-async-storage/async-storage';
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
import CustomErrorComponent from '../components/CustomErrorComponent';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {
  forgotPasswordRequest,
  resetPasswordRequest,
  signinRequest,
  verificationRequest,
} from '../redux/reducer/AuthReducer';
import Images from '../themes/Images';
import {Colors, Fonts, GifImage, Icons, Sizes} from '../themes/Themes';
import errorMessages from '../utils/errorMessages';
import constants from '../utils/helpers/constants';
import connectionrequest from '../utils/helpers/NetInfo';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';

let status = '';

const SignIn = props => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  var validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const [timerCount, setTimerCount] = useState(300);
  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');
  const [four, setFour] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDigitActivated, setIsDigitActivated] = useState(false);
  const [isValidateEmail, setIsValidateEmail] = useState(false);
  const [token, setToken] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showSeen, setShowSeen] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPass, setIsConfirmPass] = useState(false);
  const [userType, setUserType] = useState('');

  // useEffect(() => {
  //   getUserType();
  // }, []);

  // const getUserType = async () => {
  //   try {
  //     const userType = await AsyncStorage.getItem('userType');
  //     if (userType !== null) {
  //       setUserType(userType);
  //       console.log('User type retrieved:', userType);
  //     } else {
  //       console.log('No user type found');
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving user type:', error);
  //   }
  // };

  useEffect(() => {
    _setToken();
    AsyncStorage.getItem(constants.TRUSTWORKREMBERTKN)
      .then(data => {
        if (data && data != '') {
          const jsonRes = JSON.parse(data);
          setEmail(jsonRes?.email ?? '');
          setPassword(jsonRes?.password ?? '');
          setIsChecked(true);
        }
      })
      .catch(error => {
        // console.log(error);
      });
  }, []);

  const _setToken = async () => {
    const userToken = await AsyncStorage.getItem('fcmToken');
    setToken(userToken);
  };

  useEffect(() => {
    inputRef1?.current?.focus();
  }, []);

  useEffect(() => {
    if (showSeen == 'otp') {
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

  const onSignIn = () => {
    const phoneRegex = /^\d{9,15}$/; // Improved phone regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email regex
    let inputType = ''; // Determine the type of input (email or phone)

    if (phoneRegex.test(email)) {
      inputType = 'phone';
    } else if (emailRegex.test(email)) {
      inputType = 'email';
    } else {
      // If the input doesn't match either pattern
      if (email.includes('@')) {
        showErrorAlert('Please enter a valid email address');
      } else {
        showErrorAlert('Please enter a valid phone number');
      }
      return;
    }
    // Prepare data object based on input type
    const obj = {
      savePassword: isChecked,
      creds: {
        [inputType]: email, // Dynamically add either `email` or `phone`
        password,
        deviceToken: token,
        deviceType: Platform.OS,
      },
    };

    connectionrequest()
      .then(() => {
        dispatch(signinRequest(obj));
        console.log(obj);
      })
      .catch(() => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onForgotPassword = () => {
    setIsError(true);
    const phoneRegex = /^\d{9,15}$/; // Improved phone regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email regex
    let inputType = '';

    if (phoneRegex.test(email)) {
      inputType = 'phone';
    } else if (emailRegex.test(email)) {
      inputType = 'email';
    } else {
      if (email.includes('@')) {
        showErrorAlert('Please enter a valid email address');
      } else {
        showErrorAlert('Please enter a valid phone number');
      }
      return;
    }

    setIsError(false);
    let obj = {
      [inputType]: email,
    };
    connectionrequest()
      .then(() => {
        console.log(obj);
        dispatch(forgotPasswordRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  function resendOTP() {
    setOne('');
    setTwo('');
    setThree('');
    setFour('');

    const phoneRegex = /^\d{9,15}$/; // Improved phone regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email regex
    let inputType = '';

    if (phoneRegex.test(email)) {
      inputType = 'phone';
    } else if (emailRegex.test(email)) {
      inputType = 'email';
    } else {
      if (email.includes('@')) {
        showErrorAlert('Please enter a valid email address');
      } else {
        showErrorAlert('Please enter a valid phone number');
      }
      return;
    }

    let obj = {
      [inputType]: email,
    };

    connectionrequest()
      .then(() => {
        dispatch(forgotPasswordRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  }

  const verifyOTP = () => {
    setIsError(true);
    const phoneRegex = /^\d{9,15}$/; // Improved phone regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email regex
    let inputType = ''; // Determine the type of input (email or phone)
    if (!one) {
      showErrorAlert('Please fillup your first OTP');
    } else if (!two) {
      showErrorAlert('Please fillup your second OTP');
    } else if (!three) {
      showErrorAlert('Please fillup your third OTP');
    } else if (!four) {
      showErrorAlert('Please fillup your fourth OTP');
    } else {
      if (phoneRegex.test(email)) {
        inputType = 'phone';
      } else if (emailRegex.test(email)) {
        inputType = 'email';
      } else {
        // If the input doesn't match either pattern
        if (email.includes('@')) {
          setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage('Please enter a valid phone number');
        }
        return;
      }

      setIsError(false);
      let obj = {
        [inputType]: email,
        otp: String(one + two + three + four),
        // otp: parseInt(value),
      };
      connectionrequest()
        .then(() => {
          dispatch(verificationRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  const onChangePassword = () => {
    setIsError(true);
    if (password == '') {
      setErrorMessage(errorMessages.ENTER_PASSWORD);
    } else if (password.length <= 7) {
      setErrorMessage(errorMessages.PASSWORD_ALERT_MSG);
    } else if (confirmPassword == '') {
      setErrorMessage(errorMessages.ENTER_CONFIRM_PASSWORD);
    } else if (password !== confirmPassword) {
      setErrorMessage(errorMessages.CONFIRM_PASSWORD);
    } else {
      setIsError(false);

      const phoneRegex = /^\d{9,15}$/; // Improved phone regex
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email regex
      let inputType = ''; // Determine the type of input (email or phone)

      if (phoneRegex.test(email)) {
        inputType = 'phone';
      } else if (emailRegex.test(email)) {
        inputType = 'email';
      } else {
        // If the input doesn't match either pattern
        if (email.includes('@')) {
          setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage('Please enter a valid phone number');
        }
        return;
      }

      let obj = {
        [inputType]: email,
        new_password: password,
        confirm_password: confirmPassword,
      };
      connectionrequest()
        .then(() => {
          dispatch(resetPasswordRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      // case 'Auth/signinRequest':
      //   status = AuthReducer.status;
      //   break;
      // case 'Auth/signinSuccess':
      //   status = AuthReducer.status;

      //   break;
      // case 'Auth/signinFailure':
      //   status = AuthReducer.status;
      //   break;

      case 'Auth/forgotPasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/forgotPasswordSuccess':
        status = AuthReducer.status;
        setOne('');
        setTwo('');
        setThree('');
        setFour('');
        // inputRef1.current.focus();
        setShowSeen('otp');
        break;
      case 'Auth/forgotPasswordFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/verificationRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/verificationSuccess':
        status = AuthReducer.status;
        setPassword('');
        setConfirmPassword('');
        setShowSeen('changePassword');
        break;
      case 'Auth/verificationFailure':
        status = AuthReducer.status;
        setOne('');
        setTwo('');
        setThree('');
        setFour('');
        // inputRef1.current.focus();
        break;

      case 'Auth/resetPasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/resetPasswordSuccess':
        status = AuthReducer.status;
        setPassword('');
        setShowSeen('success');
        break;
      case 'Auth/resetPasswordFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const forgotPassComponent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: normalize(10),
        }}>
        <View style={styles.modalHeaderTxtContainer}>
          <Text style={styles.modalHeaderTxt}>Forgot Password</Text>
          <Text style={styles.modalHeaderSubTxt}>
            Please enter your email address or phone number below, and we'll
            send you an OTP to reset your password.
          </Text>
        </View>

        <View style={{marginTop: normalize(10)}}>
          <TextIn
            show={email?.length > 0 ? true : false}
            value={email}
            isVisible={false}
            onChangeText={val => {
              setEmail(val?.trimStart()?.toLowerCase());
              setIsValidateEmail(true);
            }}
            height={normalize(50)}
            width={normalize(250)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            borderWidth={1}
            maxLength={60}
            marginTop={normalize(10)}
            marginBottom={normalize(10)}
            outlineTxtwidth={normalize(50)}
            label={'Email Address/Phone Number'}
            placeholder={'Enter Email Address/Phone Number'}
            //placeholderIcon={Icons.Email}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            //Eyeshow={true}
            paddingLeft={normalize(5)}
            paddingRight={normalize(5)}
          />

          {/* {isError && email == '' && (
            <View style={{width: '100%'}}>
              <CustomErrorComponent label={errorMessages.ENTER_EMAIL} />
            </View>
          )}
          {email?.length !== 0 && isValidateEmail && !validate.test(email) && (
            <View style={{width: '100%'}}>
              <CustomErrorComponent
                label={errorMessages.EMAIL_IN_CORRECT_FORMAT}
              />
            </View>
          )} */}
        </View>
        <View
          style={[
            styles.btnMainContainer,
            {paddingHorizontal: normalize(10), marginTop: normalize(20)},
          ]}>
          <NextBtn
            loading={AuthReducer?.status == 'Auth/forgotPasswordRequest'}
            height={normalize(50)}
            title={'Send OTP'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => onForgotPassword()}
          />
          <TouchableOpacity
            onPress={() => setShowSeen('')}
            style={{marginTop: normalize(15)}}>
            <Text style={styles.bottomTxt}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const enterOTPComponent = () => {
    return (
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
                  one?.length > 0 ? Colors.themeGreen : Colors.themePlaceholder,
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
                  two?.length > 0 ? Colors.themeGreen : Colors.themePlaceholder,
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
                  color: three?.length > 0 ? Colors.themeGreen : 'transparent',
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

          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: normalize(15),
            }}>
            {isError && !one && !two && !three && !four && (
              <View style={{width: '100%'}}>
                <CustomErrorComponent label={errorMessages.ENTER_OTP} />
              </View>
            )}
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
            loading={AuthReducer?.status == 'Auth/verificationRequest'}
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
          // disabled={convertTime(timerCount) !== '00:00' ? true : false}
          onPress={() => {
            resendOTP();
            // sendtime(setTimerCount(300));
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
    );
  };

  const changePassComponent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: normalize(10),
        }}>
        <View style={styles.modalHeaderTxtContainer}>
          <Text style={styles.modalHeaderTxt}>Change Password</Text>
          <Text style={styles.modalHeaderSubTxt}>
            Please enter your new password and confirm it below.
          </Text>
        </View>

        <View style={{marginTop: normalize(10)}}>
          <TextIn
            show={password?.length > 0 ? true : false}
            value={password}
            isVisible={true}
            onChangeText={val => {
              setPassword(val?.replace(/\s/g, ''));
              setIsDigitActivated(true);
            }}
            height={normalize(50)}
            width={normalize(250)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            outlineTxtwidth={normalize(80)}
            borderWidth={1}
            marginTop={normalize(10)}
            marginBottom={normalize(15)}
            maxLength={30}
            label={'New Password'}
            placeholder={'Create New Password'}
            //placeholderIcon={Icons.Key}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            Eyeshow={true}
            paddingLeft={normalize(5)}
            paddingRight={normalize(5)}
          />

          {isError && password == '' && (
            <View
              style={{
                width: '100%',
                marginLeft: normalize(-23),
              }}>
              <CustomErrorComponent label={errorMessages.ENTER_PASSWORD} />
            </View>
          )}
          {password?.length !== 0 &&
            isDigitActivated &&
            password?.length <= 7 && (
              <View style={{width: '100%', marginLeft: normalize(-23)}}>
                <CustomErrorComponent
                  label={errorMessages.PASSWORD_ALERT_MSG}
                />
              </View>
            )}

          <TextIn
            show={confirmPassword?.length > 0 ? true : false}
            value={confirmPassword}
            isVisible={true}
            onChangeText={val => {
              setConfirmPassword(val?.replace(/\s/g, '')),
                setIsConfirmPass(true);
            }}
            height={normalize(50)}
            width={normalize(250)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            outlineTxtwidth={normalize(80)}
            borderWidth={1}
            marginTop={normalize(10)}
            marginBottom={normalize(15)}
            maxLength={30}
            label={'Confirm Password'}
            placeholder={'Confirm New Password'}
            //placeholderIcon={Icons.Key}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            Eyeshow={true}
            paddingLeft={normalize(5)}
            paddingRight={normalize(5)}
          />
          {isError && confirmPassword == '' && (
            <View style={{width: '100%', marginLeft: normalize(-23)}}>
              <CustomErrorComponent
                label={errorMessages.ENTER_CONFIRM_PASSWORD}
              />
            </View>
          )}
          {confirmPassword?.length !== 0 &&
            isConfirmPass &&
            password !== confirmPassword && (
              <View style={{width: '100%', marginLeft: normalize(-23)}}>
                <CustomErrorComponent label={errorMessages.CONFIRM_PASSWORD} />
              </View>
            )}
        </View>
        <View
          style={[
            styles.btnMainContainer,
            {paddingHorizontal: normalize(10), marginTop: normalize(20)},
          ]}>
          <NextBtn
            loading={AuthReducer?.status == 'Auth/resetPasswordRequest'}
            height={normalize(50)}
            title={'SUBMIT'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => onChangePassword()}
          />
        </View>
      </View>
    );
  };

  const successComponent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: normalize(10),
        }}>
        <Image
          source={GifImage.Done}
          resizeMode="contain"
          style={{width: normalize(100), height: normalize(100)}}
        />
        <View style={styles.modalHeaderTxtContainer}>
          <Text style={styles.modalHeaderTxt}>Success!</Text>
          <Text style={styles.modalHeaderSubTxt}>
            {'Your Password has been changed!'}
          </Text>
        </View>
        <View
          style={[
            styles.btnMainContainer,
            {paddingHorizontal: normalize(10), marginTop: normalize(20)},
          ]}>
          <NextBtn
            height={normalize(50)}
            title={'BACK TO LOGIN'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => {
              setShowSeen('');
            }}
          />
        </View>
      </View>
    );
  };

  const renderModalContent = () => {
    switch (showSeen) {
      case 'forgotPassword':
        return forgotPassComponent();
      case 'otp':
        return enterOTPComponent();
      case 'changePassword':
        return changePassComponent();
      case 'success':
        return successComponent();
      default:
        return null;
    }
  };

  const renderCloseModal = () => {
    switch (showSeen) {
      case 'forgotPassword':
        return setShowSeen('');
      case 'otp':
        return setShowSeen('forgotPassword');
      case 'changePassword':
        return setShowSeen('otp');
      case 'success':
        return setShowSeen('');
      default:
        return null;
    }
  };

  const forgotPasswordComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        {showSeen !== 'success' && (
          <TouchableOpacity
            style={{left: Sizes.width / 2.5, marginBottom: normalize(15)}}
            onPress={() => renderCloseModal()}>
            <Image
              source={Icons.Cross}
              resizeMode="contain"
              style={styles.modalCrossIcon}
            />
          </TouchableOpacity>
        )}
        <View style={styles.modalSubContainer}>{renderModalContent()}</View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* <Loader visible={AuthReducer?.status == 'Auth/signinRequest'} /> */}
      <ImageBackground source={Images.Background} style={styles.splashBg}>
        <View
          style={{
            height: StatusBar.currentHeight,
          }}
        />

        <View
          style={{
            flex: 1,
          }}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTxtContainer}>
                <Text style={styles.headerTxt}>Log In</Text>
                {/* <Text style={styles.headerSubTxt}>
                  {'Sign in to your account to get in to \nour platform.'}
                </Text> */}
                <Text style={styles.headerSubTxt}>
                  {' Please enter your credentials to access your account'}
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
                {/* <KeyboardAvoidingView
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                behavior="padding"
                enabled
                keyboardVerticalOffset={normalize(150)}>
                <ScrollView> */}

                <View
                  style={{
                    marginTop: normalize(20),
                  }}>
                  <TextIn
                    show={email?.length > 0 ? true : false}
                    value={email}
                    isVisible={false}
                    onChangeText={val => {
                      setEmail(val?.trimStart());
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
                    label={'Email Address/Phone Number'}
                    placeholder={'Enter Email Address/Phone Number'}
                    // label={'Email Address'}
                    // placeholder={'Enter Email Address'}
                    //placeholderIcon={Icons.Email}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    //Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />
                  {/* 
                  {isError && email == '' && (
                    <View style={{width: '100%'}}>
                      <CustomErrorComponent label={errorMessages.ENTER_EMAIL} />
                    </View>
                  )}
                  {email?.length !== 0 &&
                    isValidateEmail &&
                    !validate.test(email) && (
                      <View style={{width: '100%'}}>
                        <CustomErrorComponent
                          label={errorMessages.EMAIL_IN_CORRECT_FORMAT}
                        />
                      </View>
                    )} */}

                  <TextIn
                    show={password?.length > 0 ? true : false}
                    value={password}
                    isVisible={true}
                    onChangeText={val => {
                      setPassword(val?.trimStart());
                      setIsDigitActivated(true);
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
                    placeholder={'Enter Password'}
                    //placeholderIcon={Icons.Key}
                    placeholderTextColor={Colors.themePlaceholder}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    Eyeshow={true}
                    paddingLeft={normalize(10)}
                    paddingRight={normalize(10)}
                  />
                  {/* {isError && password == '' && (
                    <View style={{width: '100%'}}>
                      <CustomErrorComponent
                        label={errorMessages.ENTER_PASSWORD}
                      />
                    </View>
                  )}
                  {password?.length !== 0 &&
                    isDigitActivated &&
                    password?.length <= 7 && (
                      <View style={{width: '100%'}}>
                        <CustomErrorComponent
                          label={errorMessages.WRONG_PASSWORD}
                        />
                      </View>
                    )} */}
                </View>

                <View style={styles.termConatiner}>
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
                    <Text style={styles.commonText}>Remember Me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowSeen('forgotPassword')}>
                    <Text
                      style={[styles.commonText, {color: Colors.themeGreen}]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnMainContainer}>
                  <NextBtn
                    loading={AuthReducer?.status == 'Auth/signinRequest'}
                    height={normalize(50)}
                    title={'Login'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      // email == 'provider@gmail.com'
                      //   ? NavigationService.navigate('ProviderBottomTabNav')
                      //   : email == 'user@gmail.com'
                      //   ? NavigationService.navigate('UserBottomTabNav')
                      //   : showErrorAlert('Please enter correct email');

                      onSignIn();
                      // userType == 'Client'
                      //   ? NavigationService.navigate('UserBottomTabNav')
                      //   : NavigationService.navigate('ProviderBottomTabNav');
                      // props?.route?.params?.userType == 'vendor'
                      //   ? NavigationService.navigate('SignUp')
                      //   : onSignIn();
                    }}
                  />

                  {/* <NextBtn
                    //   loading={AuthReducer?.status == 'Auth/signinRequest'}
                    height={normalize(50)}
                    title={'LOGIN Provider'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      NavigationService.navigate('ProviderBottomTabNav');
                      // onSignIn();
                      // userType == 'Client'
                      //   ? NavigationService.navigate('UserBottomTabNav')
                      //   : NavigationService.navigate('ProviderBottomTabNav');
                      // props?.route?.params?.userType == 'vendor'
                      //   ? NavigationService.navigate('SignUp')
                      //   : onSignIn();
                    }}
                  /> */}

                  <TouchableOpacity
                    onPress={() => NavigationService.navigate('SignUp')}
                    style={styles.bottomTxtContainer}>
                    <Text style={styles.bottomTxt}>
                      Don’t have an account?{' '}
                      <Text style={{fontWeight: 'bold'}}>Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* </ScrollView>
              </KeyboardAvoidingView> */}
              </KeyboardAwareScrollView>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
      <Modal
        propagateSwipe
        visible={showSeen !== ''}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setShowSeen('')}
        onBackdropPress={() => setShowSeen('')}>
        {forgotPasswordComponent()}
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
    fontSize: 14,
    lineHeight: normalize(22),
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
  termConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  modalMainContainer: {
    // flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalCrossIcon: {
    width: normalize(30),
    height: normalize(30),
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
  footerORTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    lineHeight: normalize(20),
    textAlign: 'center',
    paddingVertical: normalize(15),
  },
});

export default SignIn;
