import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {ProfileRequest} from '../redux/reducer/AuthReducer';
import {WithdrawPointsRequest} from '../redux/reducer/ProfileReducer';
import css from '../themes/css';
import {Colors, Fonts, GifImage, Icons, Sizes} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';
let status = '';

const WithdrawMoney = () => {
  const [isbankAdded, setIsBankAdded] = useState(false);
  const [showSeen, setShowSeen] = useState(false);
  const [isOpen, setIsopen] = useState(false);
  const [bankId, setBankId] = useState('');
  const [bName, setBname] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [ifsc, setIFSC] = useState('');

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const addBankComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <Text style={[styles.addbankHead]}>
            {isbankAdded ? 'Add Bank Account' : 'Edit Bank Account'}
          </Text>
          <Text style={[styles.greyTxt, css.fs11, css.asc]}>
            Manage your bank account
          </Text>
          <View>
            <TextIn
              show={bName?.length > 0 ? true : false}
              value={bName}
              isVisible={false}
              onChangeText={val => {
                const sanitizedVal = val?.replace(/[^a-zA-Z\s]/g, '');
                setBname(sanitizedVal?.trimStart());
              }}
              height={normalize(50)}
              width={normalize(260)}
              fonts={Fonts.FustatMedium}
              borderColor={Colors.themeBoxBorder}
              borderWidth={1}
              maxLength={60}
              marginTop={normalize(15)}
              marginBottom={normalize(10)}
              marginLeft={normalize(10)}
              outlineTxtwidth={normalize(50)}
              label={'Bank Name'}
              placeholder={'Enter Bank Name'}
              //placeholderIcon={Icons.Email}
              placeholderTextColor={Colors.themePlaceholder}
              borderRadius={normalize(6)}
              fontSize={14}
              //Eyeshow={true}
              paddingLeft={normalize(10)}
              paddingRight={normalize(10)}
            />
            <TextIn
              show={AccountNo?.length > 0 ? true : false}
              value={AccountNo}
              isVisible={false}
              onChangeText={val => {
                const sanitizedVal = val?.replace(/[^0-9]/g, '');
                setAccountNo(sanitizedVal.trimStart());
              }}
              height={normalize(50)}
              width={normalize(260)}
              fonts={Fonts.FustatMedium}
              borderColor={Colors.themeBoxBorder}
              borderWidth={1}
              maxLength={60}
              marginTop={normalize(15)}
              marginBottom={normalize(10)}
              marginLeft={normalize(10)}
              outlineTxtwidth={normalize(50)}
              label={'Account Number'}
              placeholder={'Enter Bank Account Number'}
              keyboardType="number-pad"
              //placeholderIcon={Icons.Email}
              placeholderTextColor={Colors.themePlaceholder}
              borderRadius={normalize(6)}
              fontSize={14}
              //Eyeshow={true}
              paddingLeft={normalize(10)}
              paddingRight={normalize(10)}
            />
            <TextIn
              show={ifsc?.length > 0 ? true : false}
              value={ifsc}
              isVisible={false}
              onChangeText={val => {
                const sanitizedVal = val
                  ?.replace(/[^a-zA-Z0-9]/g, '')
                  .toUpperCase();
                setIFSC(sanitizedVal.trimStart());
              }}
              height={normalize(50)}
              width={normalize(260)}
              fonts={Fonts.FustatMedium}
              borderColor={Colors.themeBoxBorder}
              borderWidth={1}
              maxLength={60}
              marginTop={normalize(15)}
              marginBottom={normalize(10)}
              marginLeft={normalize(10)}
              outlineTxtwidth={normalize(50)}
              label={'IFSC Number'}
              placeholder={'Enter IFSC Number'}
              // keyboardType="number-pad"
              //placeholderIcon={Icons.Email}
              placeholderTextColor={Colors.themePlaceholder}
              borderRadius={normalize(6)}
              fontSize={14}
              //Eyeshow={true}
              paddingLeft={normalize(10)}
              paddingRight={normalize(10)}
            />
            <View style={[css.mt3, css.px1]}>
              <NextBtn
                // loading={}
                height={normalize(40)}
                title={isbankAdded ? 'Add Bank' : 'Edit Bank'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  //  onSaveBank();
                }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            left: Sizes.width / 4,
            marginVertical: normalize(15),
            paddingBottom: normalize(10),
          }}
          onPress={() => setIsopen(!isOpen)}>
          <View
            style={{
              borderRadius: normalize(10),
              paddingHorizontal: normalize(42),
              paddingVertical: normalize(11),
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors?.themeGreen,
              top: normalize(2),
              right: normalize(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.FustatMedium,
                fontSize: normalize(14),
                lineHeight: normalize(22),
                color: Colors.themeWhite,
                textTransform: 'uppercase',
              }}>
              Close
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const successComponent = () => {
    return (
      <View style={styles.succesMainComponent}>
        <Image
          source={GifImage.Done}
          style={{width: normalize(100), height: normalize(100)}}
        />
        <View style={styles.modalHeaderTxtContainer}>
          <Text style={styles.modalHeaderTxt}>Success!</Text>
          <Text style={styles.modalHeaderSubTxt}>{'Withdraw Successful!'}</Text>
        </View>
        <View
          style={[
            styles.btnMainContainer,
            {paddingHorizontal: normalize(10), marginTop: normalize(20)},
          ]}>
          <NextBtn
            height={normalize(50)}
            title={'OK'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => {
              setShowSeen(false);
              setTimeout(() => {
                NavigationService.goBack();

                // NavigationService.navigate('Project');
              });
            }}
          />
        </View>
      </View>
    );
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/WithdrawPointsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/WithdrawPointsSuccess':
        status = ProfileReducer.status;
        setShowSeen(true);
        dispatch(ProfileRequest());
        break;
      case 'Profile/WithdrawPointsFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Withdraw Money'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={[css.m4, css.f1]}>
          <View style={[styles.whiteBox]}>
            <Text style={[styles.greyTxt]}>Available Balance</Text>
            <Text style={[styles.priceTxt]}>
              {AuthReducer?.ProfileResponse?.data?.total_referal_amount}
            </Text>
          </View>
          <View style={[css.mt3, css.fg1]}>
            <View>
              {/* <Text style={[styles.darkTxt, css.fs16]}>Withdraw Money To</Text> */}
              {/* <Text style={[styles.darkTxt]}>
                {'Minimum withdrawal amount is $100.'}
              </Text> */}
            </View>
            {/* {isbankAdded ? (
              <View style={styles.addServiceMainContainer}>
                <TouchableOpacity
                  onPress={() => setIsopen(true)}
                  style={styles.addServiceContainer}>
                  <Text
                    style={{
                      fontFamily: Fonts.FustatMedium,
                      fontSize: normalize(14),
                      lineHeight: normalize(22),
                      color: Colors.themeWhite,
                      textTransform: 'uppercase',
                    }}>
                    + Add Bank
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[css.fg1, css.jcsb]}>
                <View
                  style={[styles.whiteContainer, {flexDirection: 'column'}]}>
                  <View style={[css.row]}>
                    <View>
                      <Image source={Icons.Bank_1} style={[styles.bankLogo]} />
                    </View>
                    <View style={[css.ml2, css.f1]}>
                      <Text style={[styles.darkTxt]}>{'Test Bank'}</Text>
                      <Text style={[styles.greyTxt, css.fs10]}>
                        {'4242 4242 4242 4242'}
                      </Text>
                      <Text style={[styles.greyTxt, css.fs10]}>
                        {`0000000000`}
                      </Text>
                    </View>
                    <View style={[css.row, css.jcfe]}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsopen(!isOpen);
                          // setBankId(item?.id);
                          // setBname(item?.bank_name);
                          // setAccountNo(item?.bank_account_number);
                          // setIFSC(item?.ifsc_code);
                        }}>
                        <Image
                          source={Icons.editIcon}
                          style={[styles.iconStyle, css.mr3]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={[]}>
                  <NextBtn
                    // loading={}
                    title={'Confirm Withdraw'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      //  onSaveBank();
                    }}
                  />
                </View>
              </View>
            )} */}
            <View style={[css.mt2]}>
              <NextBtn
                loading={
                  ProfileReducer.status == 'Profile/WithdrawPointsRequest'
                }
                title={'Confirm Withdraw'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  if (
                    AuthReducer?.ProfileResponse?.data?.total_referal_amount ==
                    0
                  ) {
                    showErrorAlert(
                      'sorry!, you dont have any balance to withdraw',
                    );
                  } else {
                    dispatch(WithdrawPointsRequest({}));
                  }
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Modal
        propagateSwipe
        visible={isOpen}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setIsopen(!isOpen)}
        onBackdropPress={() => setIsopen(!isOpen)}>
        {addBankComponent()}
      </Modal>
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
        <View style={styles.modalMainContainer}>
          <View style={styles.modalSubContainer}>{successComponent()}</View>
        </View>
      </Modal>
    </View>
  );
};

export default WithdrawMoney;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.themeBackground,
  },
  whiteBox: {
    backgroundColor: Colors.themeWhite,
    padding: normalize(15),
    marginHorizontal: normalize(20),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(200),
  },
  greyTxt: {
    color: Colors.themeGray,
    fontSize: normalize(12),
    fontFamily: Fonts.FustatRegular,
  },
  whiteContainer: {
    padding: normalize(8),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
    marginTop: normalize(10),
  },
  bankLogo: {
    height: normalize(30),
    width: normalize(30),
    resizeMode: 'contain',
  },
  darkTxt: {
    fontSize: normalize(11),
    fontFamily: Fonts.FustatBold,
    color: Colors.themeBlack,
  },
  btnContainer: {
    width: normalize(120),
    padding: normalize(5),
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    marginTop: normalize(10),
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
  },
  priceTxt: {
    color: Colors.themeBlack,
    fontSize: normalize(25),
    fontFamily: Fonts.FustatBold,
  },
  addServiceMainContainer: {
    marginTop: normalize(10),
    // bottom: Platform.OS === 'ios' ? normalize(30) : normalize(50),
    // bottom: normalize(25),
    // right: normalize(18),
  },
  addServiceContainer: {
    borderRadius: normalize(10),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors?.themeGreen,
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'flex-end',
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
  addbankHead: {
    fontSize: normalize(18),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
    alignSelf: 'center',
  },
  succesMainComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
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
  },
  modalHeaderSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    textAlign: 'center',
    paddingHorizontal: normalize(10),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: normalize(18),
  },
});
