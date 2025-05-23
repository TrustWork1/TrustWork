import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  addMtnAccountRequest,
  bankAccountRequest,
  deleteBankAccountRequest,
  deleteMtnRequest,
  makePrimaryMtnRequest,
  makePrimaryRequest,
  mtnListRequest,
  updateBankAccountRequest,
} from '../../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import css from '../../themes/css';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import normalize from '../../utils/helpers/normalize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import errorMessages from '../../utils/errorMessages';
import {ProfileRequest} from '../../redux/reducer/AuthReducer';

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
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [bankList, setBankList] = useState([]);
  const [mtnList, setmtnList] = useState([]);
  const [isOpen, setIsopen] = useState(false);
  const [isMtnAdd, setIsMtnAdd] = useState(false);
  const [bankId, setBankId] = useState('');
  const [bName, setBname] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [ifsc, setIFSC] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [account, setAccount] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [code, setCode] = useState('+1');
  const [payType, setPayType] = useState('mtn');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getBankList();
      // getMtnList();
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
  const getMtnList = () => {
    connectionrequest()
      .then(() => {
        dispatch(mtnListRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const onSaveBank = () => {
    if (payType == 'stripe') {
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
    } else if (payType == 'mtn') {
      if (!phoneNo) {
        showErrorAlert('Enter Mtn number');
        return;
      }
    }

    let obj = {
      payment_type: payType,
      bank_account_number: payType == 'stripe' ? AccountNo : phoneNo,
      ifsc_code: ifsc,
      bank_name: bName,
      // account_type: account,
      country: countryCode,
      phone_extension: code,
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

  const saveMtnNumber = () => {
    let obj = {
      account_number: phoneNo,
      phone_extension: code,
    };
    dispatch(addMtnAccountRequest(obj));
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

  const deleteMtnAccount = id => {
    let obj = {
      id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(deleteMtnRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const addBankComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            enableResetScrollToCoords={false}
            keyboardOpeningTime={0}
            extraScrollHeight={0}
            bounces={false}
            enableOnAndroid={true}
            scrollEnabled={true}
            enableAutomaticScroll={false}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
            <Text style={[styles.addbankHead]}>{'Add Your Account'}</Text>
            {/* <Text style={[styles.greyTxt, css.fs11, css.asc]}>
              Manage your bank account
            </Text> */}

            <View style={[css.row, css.jcsb, css.mt2]}>
              <TouchableOpacity
                onPress={() => {
                  setPayType('stripe');
                }}
                style={[
                  styles.selectAccount,
                  {
                    borderBottomColor:
                      payType == 'stripe'
                        ? Colors.themeGreen
                        : Colors.themeWhite,
                  },
                ]}>
                <Text style={[styles.txtStyle]}>Bank Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPayType('mtn');
                }}
                style={[
                  styles.selectAccount,
                  {
                    borderBottomColor:
                      payType == 'mtn' ? Colors.themeGreen : Colors.themeWhite,
                  },
                ]}>
                <Text style={[styles.txtStyle]}>Mtn Account</Text>
              </TouchableOpacity>
            </View>

            {payType == 'stripe' ? (
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

                {/* <Dropdown
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
              /> */}
              </View>
            ) : (
              <View>
                <View
                  style={[css.rowBetween, css.asc, {width: normalize(265)}]}>
                  <Dropdown
                    show={code?.length > 0 ? true : false}
                    isPhone={true}
                    data={CountryCode}
                    height={normalize(45)}
                    width={normalize(70)}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    fonts={Fonts.VerdanaProMedium}
                    borderRadius={normalize(6)}
                    fontSize={14}
                    marginTop={
                      Platform.OS == 'ios' ? normalize(20) : normalize(15)
                    }
                    paddingLeft={normalize(10)}
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
                    height={normalize(45)}
                    width={normalize(190)}
                    fonts={Fonts.FustatMedium}
                    borderColor={Colors.themeBoxBorder}
                    borderWidth={1}
                    maxLength={10}
                    keyboardType={'number-pad'}
                    marginTop={normalize(8)}
                    marginBottom={normalize(10)}
                    marginLeft={normalize(-70)}
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
              </View>
            )}
            <View style={[css.mt3, css.px1]}>
              <NextBtn
                loading={
                  ProfileReducer.status == 'Profile/addBankAccountRequest'
                }
                height={normalize(40)}
                title={'Add Account'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  onSaveBank();
                }}
              />
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
  const addMtnComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <Text style={[styles.addbankHead]}>{'Add MTN Account'}</Text>

          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            scrollEnabled={true}
            keyboardOpeningTime={0}
            extraScrollHeight={0}
            enableOnAndroid={true}
            enableAutomaticScroll={false}
            keyboardShouldPersistTaps={'handled'}>
            <View>
              <View style={[css.rowBetween, css.asc, {width: normalize(265)}]}>
                <Dropdown
                  show={code?.length > 0 ? true : false}
                  isPhone={true}
                  data={CountryCode}
                  height={normalize(45)}
                  width={normalize(70)}
                  borderColor={Colors.themeBoxBorder}
                  borderWidth={1}
                  fonts={Fonts.VerdanaProMedium}
                  borderRadius={normalize(6)}
                  fontSize={14}
                  marginTop={
                    Platform.OS == 'ios' ? normalize(20) : normalize(15)
                  }
                  paddingLeft={normalize(10)}
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
                  height={normalize(45)}
                  width={normalize(190)}
                  fonts={Fonts.FustatMedium}
                  borderColor={Colors.themeBoxBorder}
                  borderWidth={1}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  marginTop={normalize(8)}
                  marginBottom={normalize(10)}
                  marginLeft={normalize(-70)}
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

              <View style={[css.mt3, css.px1]}>
                <NextBtn
                  // loading={}
                  height={normalize(40)}
                  title={'Add MTN'}
                  borderColor={Colors.themeGreen}
                  color={Colors.themeWhite}
                  backgroundColor={Colors.themeGreen}
                  onPress={() => {
                    saveMtnNumber();
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
          onPress={() => setIsMtnAdd(!isMtnAdd)}>
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
      <View style={[styles.headerContainer]}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.FustatSemiBold,
              fontSize: normalize(15),
              color: Colors.themeBlack,
              lineHeight: normalize(22),
            }}>
            {'My Payment Account'}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.FustatMedium,
              fontSize: normalize(12),
              color: Colors.themeInactiveTxt,
              lineHeight: normalize(16),
              marginTop: normalize(5),
            }}>
            Manage your payment accounts
          </Text>
        </View>
        <View style={styles.addServiceMainContainer}>
          <TouchableOpacity
            onPress={() => setIsopen(true)}
            style={styles.addServiceContainer}>
            <Text style={[styles.buttonTxt]}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const mtnHeaderComponent = () => {
    return (
      <View style={[styles.headerContainer]}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.FustatSemiBold,
              fontSize: normalize(15),
              color: Colors.themeBlack,
              lineHeight: normalize(22),
            }}>
            {'My MTN Account'}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.FustatMedium,
              fontSize: normalize(12),
              color: Colors.themeInactiveTxt,
              lineHeight: normalize(16),
              marginTop: normalize(5),
            }}>
            Manage your MTN accounts
          </Text>
        </View>
        <View style={styles.addServiceMainContainer}>
          <TouchableOpacity
            onPress={() => setIsMtnAdd(true)}
            style={styles.addServiceContainer}>
            <Text style={[styles.buttonTxt]}>+ Add MTN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const bankListRender = (item, index) => {
    return (
      <View style={[styles.whiteContainer, {flexDirection: 'column'}]}>
        <View style={[css.row]}>
          {item?.payment_type == 'stripe' && (
            <View>
              <Image source={Icons.Bank_1} style={[styles.bankLogo]} />
            </View>
          )}
          {item?.payment_type == 'stripe' ? (
            <View style={[css.ml2, css.f1]}>
              <Text style={[styles.darkTxt]}>{item?.bank_name}</Text>
              <Text style={[styles.greyTxt, css.fs10]}>
                {`*******${item?.bank_account_number}`}
              </Text>
              <Text style={[styles.greyTxt, css.fs10]}>
                {item?.routing_number}
              </Text>
            </View>
          ) : (
            <View style={[css.ml2, css.f1]}>
              <Text>{item?.bank_account_number}</Text>
            </View>
          )}

          <View style={[css.row, css.jcfe]}>
            <TouchableOpacity onPress={() => onConfirmDelete(item?.id)}>
              <Image source={Icons.deleteIcon} style={[styles.iconStyle]} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => !item?.is_primary && onPrimary(item, index)}
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
  const mtnListRender = (item, index) => {
    return (
      <View style={[styles.whiteContainer, {flexDirection: 'column'}]}>
        <View style={[css.row]}>
          <View style={[css.ml2, css.f1]}>
            <Text>{item?.account_number}</Text>
          </View>
          <View style={[css.row, css.jcfe]}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Confirm Delete !!',
                  'Are you sure you want to delete ?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => deleteMtnAccount(item?.id)},
                  ],
                  {cancelable: false},
                );
              }}>
              <Image source={Icons.deleteIcon} style={[styles.iconStyle]} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            !item?.is_primary &&
              dispatch(makePrimaryMtnRequest({id: item?.id}));
          }}
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

      case 'Profile/mtnListRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/mtnListSuccess':
        status = ProfileReducer.status;
        setmtnList(ProfileReducer?.mtnListResponse?.data);
        break;
      case 'Profile/mtnListFailure':
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
        dispatch(ProfileRequest());
        break;
      case 'Profile/addBankAccountFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;

      //////////////// Add mtn account ////////
      case 'Profile/addMtnAccountRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/addMtnAccountSuccess':
        status = ProfileReducer.status;
        setIsMtnAdd(false);
        setPhoneNo('');
        setCode('+1');
        getMtnList();
        dispatch(ProfileRequest());
        break;
      case 'Profile/addMtnAccountFailure':
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

      case 'Profile/makePrimaryMtnRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/makePrimaryMtnSuccess':
        status = ProfileReducer.status;
        getMtnList();
        break;
      case 'Profile/makePrimaryMtnFailure':
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

      case 'Profile/deleteMtnRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/deleteMtnSuccess':
        status = ProfileReducer.status;
        getMtnList();
        break;
      case 'Profile/deleteMtnFailure':
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
          <View style={[css.f1]}>
            <FlatList
              data={bankList}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={[css.f1]}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              ListEmptyComponent={() => listEmptyComponent()}
              ListHeaderComponent={() => listHeaderComponent()}
              renderItem={({item, index}) => bankListRender(item, index)}
            />
          </View>

          {/* ////////////////// For Mtn Account /////////////// */}

          {/* <View style={[css.f1]}>
            <FlatList
              data={mtnList}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              contentContainerStyle={[css.fg1]}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.FustatMedium,
                        fontSize: normalize(12),
                        color: Colors.themeInactiveTxt,
                        lineHeight: normalize(16),
                        marginTop: normalize(5),
                      }}>
                      No MTN Account Added
                    </Text>
                  </View>
                );
              }}
              ListHeaderComponent={() => mtnHeaderComponent()}
              renderItem={({item, index}) => mtnListRender(item, index)}
            />
          </View> */}
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
      {/* <Modal
        visible={isMtnAdd}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => setIsMtnAdd(!isMtnAdd)}
        onBackdropPress={() => setIsMtnAdd(!isMtnAdd)}>
        {addMtnComponent()}
      </Modal> */}
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
    marginHorizontal: normalize(15),
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
  buttonTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(12),
    lineHeight: normalize(20),
    color: Colors.themeWhite,
    textTransform: 'uppercase',
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
    maxHeight: normalize(600),
    borderRadius: 20,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  headerContainer: {
    paddingTop: normalize(30),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addServiceMainContainer: {},
  addServiceContainer: {
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors?.themeGreen,
  },
  selectAccount: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderBottomWidth: 3,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtStyle: {
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
  },
});
