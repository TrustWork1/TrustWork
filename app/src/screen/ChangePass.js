import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomErrorComponent from '../components/CustomErrorComponent';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {changePasswordRequest} from '../redux/reducer/AuthReducer';
import css from '../themes/css';
import {Colors, Fonts, Icons} from '../themes/Themes';
import errorMessages from '../utils/errorMessages';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';
let status = '';

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPass, setIsConfirmPass] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDigitActivated, setIsDigitActivated] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const ChangePassFun = () => {
    if (oldPassword?.trim() == '') {
      showErrorAlert('Please enter your old password');
    } else if (password?.trim() == '') {
      showErrorAlert('Please enter your new password');
    } else if (confirmPassword?.trim() == '') {
      showErrorAlert('Please enter your confirm password');
    } else {
      let obj = {
        current_password: oldPassword,
        new_password: password,
        confirm_password: confirmPassword,
      };
      dispatch(changePasswordRequest(obj));
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/changePasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/changePasswordSuccess':
        status = AuthReducer.status;
        NavigationService.goBack();
        break;
      case 'Auth/changePasswordFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Change password'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(10)}}
          style={styles.container}>
          <View style={[css.px3]}>
            <View style={{marginTop: normalize(10)}}>
              <TextIn
                show={oldPassword?.length > 0 ? true : false}
                value={oldPassword}
                isVisible={true}
                onChangeText={val => {
                  setOldPassword(val?.replace(/\s/g, ''));
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
                maxLength={30}
                label={'Old Password'}
                placeholder={'Old Password'}
                //placeholderIcon={Icons.Key}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                Eyeshow={true}
                paddingLeft={normalize(5)}
                paddingRight={normalize(5)}
              />

              {isError && oldPassword == '' && (
                <View
                  style={{
                    width: '100%',
                    marginLeft: normalize(-23),
                  }}>
                  <CustomErrorComponent label={errorMessages.ENTER_PASSWORD} />
                </View>
              )}
              {oldPassword?.length !== 0 &&
                isDigitActivated &&
                oldPassword?.length <= 7 && (
                  <View style={{width: '100%', marginLeft: normalize(-23)}}>
                    <CustomErrorComponent
                      label={errorMessages.PASSWORD_ALERT_MSG}
                    />
                  </View>
                )}

              <TextIn
                show={password?.length > 0 ? true : false}
                value={password}
                isVisible={true}
                onChangeText={val => {
                  setPassword(val?.replace(/\s/g, ''));
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
                width={normalize(280)}
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
                    <CustomErrorComponent
                      label={errorMessages.CONFIRM_PASSWORD}
                    />
                  </View>
                )}
            </View>
            <View style={[css.mt4]}>
              <NextBtn
                // loading={AuthReducer?.status == 'Auth/signinRequest'}
                height={normalize(45)}
                title={'Submit'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  ChangePassFun();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});
