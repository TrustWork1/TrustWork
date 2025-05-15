import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Dropdown from '../../components/Dropdown';
import CountryCode from '../../components/General/CountryCode';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import {
  addBankAccountRequest,
  bankAccountRequest,
  deleteBankAccountRequest,
  makePrimaryRequest,
  updateBankAccountRequest,
} from '../../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import css from '../../themes/css';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import normalize from '../../utils/helpers/normalize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

let status = '';

const accountType = [
  {
    id: 1,
    title: 'Current',
  },
  {
    id: 2,
    title: 'Savings',
  },
];

const PaymentMethods = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [bankList, setBankList] = useState([]);
  const [isOpen, setIsopen] = useState(false);
  const [bankId, setBankId] = useState('');
  const [bName, setBname] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [ifsc, setIFSC] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    if (isFocused) {
      getBankList();
    }
  }, [isFocused]);

  const getBankList = () => {
    connectionrequest()
      .then(() => {
        dispatch(bankAccountRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onSaveBank = () => {
    if (!AccountNo || !ifsc || !bName) {
      showErrorAlert(
        !AccountNo
          ? 'Enter Account Number'
          : !ifsc
          ? 'Enter IFSC Number'
          : 'Enter Bank Name',
      );
      return;
    }

    let obj = {
      bank_account_number: AccountNo,
      ifsc_code: ifsc,
      bank_name: bName,
      account_type: account,
      country: countryCode,
    };

    // let obj = {
    //   bank_name: 'Cannara ',
    //   country: 'US',
    //   ifsc_code: 'CANA012040120',
    //   // "account_holder_name": "John Doe",
    //   bank_account_number: '000123456789',
    //   routing_number: '110000000',
    //   account_type: 'checking',
    // };

    connectionrequest()
      .then(() => {
        dispatch(addBankAccountRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onUpdateBank = () => {
    if (!AccountNo || !ifsc || !bName) {
      showErrorAlert(
        !AccountNo
          ? 'Enter Account Number'
          : !ifsc
          ? 'Enter IFSC Number'
          : 'Enter Bank Name',
      );
      return;
    }

    let obj = {
      data: {
        bank_account_number: AccountNo,
        routing_number: ifsc,
        bank_name: bName,
        account_type: account,
        country: countryCode,
      },
      id: bankId,
    };

    connectionrequest()
      .then(() => {
        dispatch(updateBankAccountRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onPrimary = (item, index) => {
    let obj = {
      id: item?.id,
    };

    let temp = JSON.parse(JSON.stringify(bankList));
    temp[index].is_primary = true;
    setBankList(temp);

    setBankList(temp);

    connectionrequest()
      .then(() => {
        dispatch(makePrimaryRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onUnPrimary = (item, index) => {
    let obj = {
      id: item?.id,
    };

    let temp = JSON.parse(JSON.stringify(bankList));
    temp[index].is_primary = false;
    setBankList(temp);

    setBankList(temp);

    connectionrequest()
      .then(() => {
        dispatch(makePrimaryRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onConfirmDelete = id => {
    Alert.alert(
      'Confirm Delete !!',
      'Are you sure you want to delete ?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteBank(id)},
      ],
      {cancelable: false},
    );
  };

  const deleteBank = id => {
    let obj = {
      id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(deleteBankAccountRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const addBankComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <Text style={[styles.addbankHead]}>
            {bankId ? 'Update Bank Account' : 'Add Bank Account'}
          </Text>
          <Text style={[styles.greyTxt, css.fs11, css.asc]}>
            Manage your bank account
          </Text>
          <KeyboardAwareScrollView
            enableResetScrollToCoords={false}
            bounces={false}
            enableOnAndroid={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
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
                marginTop={normalize(10)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Account Number'}
                placeholder={'Enter Bank Account Number'}
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
                marginTop={normalize(10)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'IFSC Code/ Routing Number'}
                placeholder={'Enter IFSC Number'}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <Dropdown
                show={country?.length > 0 ? true : false}
                data={CountryCode}
                height={normalize(50)}
                width={normalize(260)}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                fonts={Fonts.VerdanaProMedium}
                borderRadius={normalize(6)}
                fontSize={14}
                marginTop={normalize(10)}
                paddingLeft={normalize(12)}
                valueColor={Colors.themeBlack}
                paddingHorizontal={normalize(5)}
                label={'Select Country'}
                placeholder={'Select Country'}
                value={country}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                placeholderTextColor={Colors.themePlaceholder}
                onChange={(selecetedItem, index) => {
                  console.log(selecetedItem);
                  setCountry(selecetedItem?.title);
                  setCountryCode(selecetedItem?.code);
                }}
              />

              <Dropdown
                show={account?.length > 0 ? true : false}
                data={accountType}
                height={normalize(50)}
                width={normalize(260)}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                fonts={Fonts.VerdanaProMedium}
                borderRadius={normalize(6)}
                fontSize={14}
                marginTop={normalize(10)}
                paddingLeft={normalize(12)}
                valueColor={Colors.themeBlack}
                paddingHorizontal={normalize(5)}
                label={'Select Account Type'}
                placeholder={'Select Account Type'}
                value={account}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                placeholderTextColor={Colors.themePlaceholder}
                onChange={(selecetedItem, index) => {
                  setAccount(selecetedItem?.title);
                }}
              />

              <View style={[css.mt3, css.px1]}>
                <NextBtn
                  loading={
                    bankId
                      ? ProfileReducer?.status ==
                        'Profile/updateBankAccountRequest'
                      : ProfileReducer?.status ==
                        'Profile/addBankAccountRequest'
                  }
                  height={normalize(40)}
                  title={bankId ? 'Update Bank' : 'Add Bank'}
                  borderColor={Colors.themeGreen}
                  color={Colors.themeWhite}
                  backgroundColor={Colors.themeGreen}
                  onPress={() => {
                    bankId ? onUpdateBank() : onSaveBank();
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <TouchableOpacity
          style={{
            left: Sizes.width / 4,
            marginVertical: normalize(10),
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

  const listHeaderComponent = () => {
    return (
      <View
        style={{
          paddingTop: normalize(20),
          paddingHorizontal: normalize(10),
          paddingVertical: normalize(15),
        }}>
        <Text
          style={{
            fontFamily: Fonts.FustatSemiBold,
            fontSize: normalize(15),
            color: Colors.themeBlack,
            lineHeight: normalize(22),
          }}>
          {'My Bank Details'}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.FustatMedium,
            fontSize: normalize(12),
            color: Colors.themeInactiveTxt,
            lineHeight: normalize(16),
            marginTop: normalize(5),
          }}>
          Manage your bank accounts
        </Text>
      </View>
    );
  };

  const bankListRender = (item, index) => {
    return (
      <View style={[styles.whiteContainer, {flexDirection: 'column'}]}>
        <View style={[css.row]}>
          <View>
            <Image source={Icons.Bank_1} style={[styles.bankLogo]} />
          </View>
          <View style={[css.ml2, css.f1]}>
            <Text style={[styles.darkTxt]}>{item?.bank_name}</Text>
            <Text style={[styles.greyTxt, css.fs10]}>
              {item?.bank_account_number}
            </Text>
            <Text style={[styles.greyTxt, css.fs10]}>
              {item?.routing_number}
            </Text>
          </View>
          <View style={[css.row, css.jcfe]}>
            {/* <TouchableOpacity
              onPress={() => {
                console.log(item);
                setIsopen(!isOpen);
                setBankId(item?.id);
                setBname(item?.bank_name);
                setAccountNo(item?.bank_account_number);
                setIFSC(item?.routing_number);
                setCountryCode();
              }}>
              <Image
                source={Icons.editIcon}
                style={[styles.iconStyle, css.mr3]}
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => onConfirmDelete(item?.id)}>
              <Image source={Icons.deleteIcon} style={[styles.iconStyle]} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            item?.is_primary ? onUnPrimary(item, index) : onPrimary(item, index)
          }
          style={[
            styles.btnContainer,
            {
              borderColor: item?.is_primary
                ? Colors.themeGreen
                : Colors.themeBlack,
            },
          ]}>
          <Text
            style={[
              css.fs10,
              {
                color: item?.is_primary ? Colors.themeGreen : Colors.themeBlack,
              },
            ]}>
            {item?.is_primary ? 'Primary Account' : 'Make Primary'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: normalize(20),
        }}>
        <Text
          style={{
            fontFamily: Fonts.FustatMedium,
            fontSize: normalize(12),
            color: Colors.themeInactiveTxt,
            lineHeight: normalize(16),
            marginTop: normalize(5),
          }}>
          No Bank Account Added
        </Text>
      </View>
    );
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/bankAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/bankAccountSuccess':
        status = ProfileReducer.status;
        setBankList(ProfileReducer?.bankAccountResponse?.data);
        break;
      case 'Profile/bankAccountFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;

      case 'Profile/addBankAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/addBankAccountSuccess':
        status = ProfileReducer.status;
        setIsopen(false);
        setBankId('');
        setBname('');
        setAccountNo('');
        setIFSC('');
        getBankList();
        break;
      case 'Profile/addBankAccountFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;

      case 'Profile/updateBankAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/updateBankAccountSuccess':
        status = ProfileReducer.status;
        setIsopen(false);
        setBankId('');
        setBname('');
        setAccountNo('');
        setIFSC('');
        getBankList();
        break;
      case 'Profile/updateBankAccountFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;

      case 'Profile/makePrimaryRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/makePrimarySuccess':
        status = ProfileReducer.status;
        getBankList();
        break;
      case 'Profile/makePrimaryFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;

      case 'Profile/deleteBankAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/deleteBankAccountSuccess':
        status = ProfileReducer.status;
        getBankList();
        break;
      case 'Profile/deleteBankAccountFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Loader
        visible={
          ProfileReducer.status == 'Profile/deleteBankAccountRequest' ||
          ProfileReducer.status == 'Profile/makePrimaryRequest'
        }
      />
      <Header backIcon={Icons.BackIcon} headerTitle={'Payment Methods'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: normalize(10),
            }}>
            <FlatList
              data={bankList}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              ListEmptyComponent={() => listEmptyComponent()}
              ListHeaderComponent={() => listHeaderComponent()}
              renderItem={({item, index}) => bankListRender(item, index)}
            />
          </View>
        </View>
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
      </SafeAreaView>
      <Modal
        visible={isOpen}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setIsopen(!isOpen)}
        onBackdropPress={() => setIsopen(!isOpen)}>
        {addBankComponent()}
      </Modal>
    </View>
  );
};

export default PaymentMethods;

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
  greyTxt: {
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    marginTop: normalize(2),
  },
  whiteContainer: {
    padding: normalize(8),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
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
  addContainer: {
    backgroundColor: Colors.themeGreen,
    padding: normalize(10),
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: normalize(20),
  },
  whiteTxt: {
    fontSize: normalize(11),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeWhite,
  },
  addbankHead: {
    fontSize: normalize(18),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  modalMainContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(40),
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
  addServiceMainContainer: {
    position: 'absolute',
    // bottom: Platform.OS === 'ios' ? normalize(30) : normalize(50),
    bottom: normalize(25),
    right: normalize(18),
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
});
