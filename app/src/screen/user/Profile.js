import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import ProfileDataCard from '../../components/Micro/ProfileDataCard';
import NextBtn from '../../components/NextBtn';
import NavigationService from '../../navigators/NavigationService';
import {
  deleteUserRequest,
  logoutRequest,
  ProfileRequest,
  UpdateCoverPicRequest,
} from '../../redux/reducer/AuthReducer';
import {SwitchAccountRequest} from '../../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons, Images} from '../../themes/Themes';
import css from '../../themes/css';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

let status = '';

const Profile = props => {
  const [imgPicker, setImgPicker] = useState(false);
  const [selectedImg, setSelectedImage] = useState('');
  const [selectedImgObj, setSelectedImgObj] = useState([]);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const onConfirmLogout = () => {
    Alert.alert(
      'Confirm Logout !!',
      'Are you sure you want to logout ?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => onLogout()},
      ],
      {cancelable: false},
    );
  };

  const confirmDeleteUser = () => {
    Alert.alert(
      'Confirm Delete !!',
      'Are you sure you want to delete account?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let obj = {
              id: AuthReducer?.ProfileResponse?.data?.id,
              userType: AuthReducer?.ProfileResponse?.data?.user_type,
            };
            dispatch(deleteUserRequest(obj));
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    if (isFocused) {
      connectionrequest()
        .then(() => {
          dispatch(ProfileRequest());
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  }, [isFocused]);

  const onLogout = () => {
    let obj = {};
    connectionrequest()
      .then(() => {
        dispatch(logoutRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
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
        const obj = new FormData();
        obj.append('cover_image', imageObj);
        dispatch(UpdateCoverPicRequest(obj));
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
        const obj = new FormData();
        obj.append('cover_image', imageObj);
        dispatch(UpdateCoverPicRequest(obj));
      })
      .catch(err => console.log(err));
  }

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/UpdateCoverPicRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/UpdateCoverPicSuccess':
        status = AuthReducer.status;
        connectionrequest()
          .then(() => {
            dispatch(ProfileRequest());
          })
          .catch(err => {
            showErrorAlert('Please connect to the internet');
          });
        break;
      case 'Auth/UpdateCoverPicFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          AuthReducer?.status == 'Auth/UpdateCoverPicRequest' ||
          AuthReducer?.status == 'Auth/ProfileRequest'
        }
      /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'My Profile'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(10)}}
          style={styles.container}>
          <View style={[css.px3]}>
            <View style={[styles.profileOuter, css.mt3]}>
              <ImageBackground
                source={
                  AuthReducer?.ProfileResponse?.data?.cover_image
                    ? {
                        uri: `${constants.IMAGE_URL}${AuthReducer?.ProfileResponse?.data?.cover_image}`,
                      }
                    : Images.backImg
                }
                resizeMode="stretch"
                // source={Images.backImg}
                style={styles.backImgStyle}>
                <TouchableOpacity
                  onPress={() => setImgPicker(true)}
                  style={[styles.editContainer, css.mt2, css.px2, css.ase]}>
                  <Image source={Icons.editPencil} style={[styles.editIcon]} />
                  <Text
                    style={[
                      css.ml1,
                      {
                        color: Colors.themeBlack,
                        fontFamily: Fonts.FustatBold,
                      },
                    ]}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
              <View style={[{backgroundColor: Colors.themeWhite}]}>
                <Image
                  source={
                    AuthReducer?.ProfileResponse?.data?.profile_picture
                      ? {
                          uri: `${constants.IMAGE_URL}${AuthReducer?.ProfileResponse?.data?.profile_picture}`,
                        }
                      : Icons.UserPro
                  }
                  resizeMode="stretch"
                  style={styles.profileImgStyle}
                />
                <TouchableOpacity
                  onPress={() => NavigationService.navigate('EditProfile')}
                  style={[styles.editImgStyle]}>
                  <Image source={Icons.editPencil} style={[styles.editIcon]} />
                </TouchableOpacity>
                <View style={[css.p3, css.aic, css.mt2]}>
                  <Text style={[styles.nameTxtStyle]}>
                    {AuthReducer?.ProfileResponse?.data?.full_name}
                  </Text>
                  {AuthReducer?.ProfileResponse?.data?.email && (
                    <View style={[css.row, css.aic]}>
                      <Image
                        source={Icons.emailbox}
                        style={[styles.emailBoxstyle]}
                      />
                      <Text style={[styles.lightTxtStyle, css.ml1]}>
                        {AuthReducer?.ProfileResponse?.data?.email}
                      </Text>
                    </View>
                  )}
                  {AuthReducer?.ProfileResponse?.data?.phone && (
                    <View style={[css.row, css.aic]}>
                      <Image
                        source={Icons.phoneBox}
                        style={[styles.emailBoxstyle]}
                      />
                      <Text style={[styles.lightTxtStyle, css.ml1]}>
                        {AuthReducer?.ProfileResponse?.data?.phone_extension
                          ? AuthReducer?.ProfileResponse?.data?.phone_extension
                          : ''}
                        {AuthReducer?.ProfileResponse?.data?.phone}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View>
              <ProfileDataCard
                logo={Icons.about}
                title={'About Us'}
                onPress={() => NavigationService.navigate('AboutUs')}
              />

              <ProfileDataCard
                logo={Icons.settings}
                title={'Account Settings'}
                onPress={() => NavigationService.navigate('AccountSetting')}
              />

              {/* <ProfileDataCard
                logo={Images.inactivePayment}
                title={'Withdraw Money'}
                onPress={() => {
                  NavigationService?.navigate('WithdrawMoney');
                }}
              /> */}
              {/* <ProfileDataCard
                logo={Icons.wallet}
                title={'Payment History'}
                onPress={() => {
                  NavigationService?.navigate('PaymentHistory');
                }}
              /> */}
              <ProfileDataCard
                logo={Icons.ShareNew}
                title={'Tell your friends'}
                onPress={() =>
                  NavigationService.navigate('Referal', {
                    code: AuthReducer?.ProfileResponse?.data?.user_referal_code,
                  })
                }
              />
              <ProfileDataCard
                logo={Icons.help}
                title={'Help & Support'}
                onPress={() => NavigationService.navigate('HelpSupport')}
              />
              <ProfileDataCard
                logo={Icons.switch}
                title={'Switch To Service Provider Account'}
                onPress={() => {
                  dispatch(SwitchAccountRequest());
                }}
              />
              <ProfileDataCard
                logo={Icons.logout}
                title={'Logout'}
                onPress={() => onConfirmLogout()}
              />
              <TouchableOpacity
                style={[styles.deleteContainer]}
                onPress={() => {
                  confirmDeleteUser();
                }}>
                <View style={[css.row, css.aic]}>
                  <View style={[styles.iconContainer]}>
                    <Image
                      source={Icons.deleteIcon}
                      style={[styles.logoStyle]}
                    />
                  </View>
                  <Text style={[styles.titleStyle]}>{'Delete Account'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  profileOuter: {
    overflow: 'hidden',
    borderRadius: normalize(10),
  },
  backImgStyle: {
    height: normalize(100),
  },
  editIcon: {
    height: normalize(10),
    width: normalize(10),
    resizeMode: 'contain',
  },
  editContainer: {
    flexDirection: 'row',
    padding: normalize(5),
    backgroundColor: Colors.themeYellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(6),
    marginRight: normalize(10),
  },
  profileImgStyle: {
    height: normalize(65),
    width: normalize(65),
    borderRadius: normalize(40),

    borderWidth: normalize(3),
    alignSelf: 'center',
    top: normalize(-35),
    borderColor: Colors.themeWhite,
    position: 'absolute',
  },
  editImgStyle: {
    backgroundColor: Colors.themeYellow,
    top: normalize(15),
    width: normalize(22),
    height: normalize(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(20),
    alignSelf: 'center',
  },
  lightTxtStyle: {
    fontSize: normalize(11),
    fontFamily: Fonts.FustatRegular,
    color: Colors.themeInactiveTxt,
    marginTop: normalize(2),
  },
  emailBoxstyle: {
    height: normalize(13),
    width: normalize(13),
    resizeMode: 'contain',
  },
  nameTxtStyle: {
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
  },
  deleteContainer: {
    padding: normalize(5),
    backgroundColor: Colors.themeWhite,
    marginTop: normalize(10),
    borderRadius: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    paddingHorizontal: normalize(11),
    paddingVertical: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(10),
    backgroundColor: '#f2d1b6',
    height: normalize(30),
  },
  logoStyle: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
    tintColor: Colors.themeRed,
  },
  titleStyle: {
    color: Colors.themeRed,
    fontSize: normalize(12),
    fontFamily: Fonts.FustatSemiBold,
    marginLeft: normalize(10),
  },
});
