import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, GifImage, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

import BottomSheet from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {
  CardField,
  StripeProvider,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import CustomErrorComponent from '../components/CustomErrorComponent';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {
  CreatePaymentRequest,
  StripePaymentFailRequest,
  StripePaymentRequest,
} from '../redux/reducer/AuthReducer';
import {
  addBankAccountRequest,
  BankTransferRequest,
} from '../redux/reducer/ProfileReducer';
import {bidStatusRequest} from '../redux/reducer/ProjectReducer';
import css, {width} from '../themes/css';
import errorMessages from '../utils/errorMessages';
import Loader from '../utils/helpers/Loader';
import connectionrequest from '../utils/helpers/NetInfo';
import showErrorAlert from '../utils/helpers/Toast';

let status = '';
let status1 = '';
let status2 = '';

let listData = [
  // {
  //   id: 1,
  //   name: 'Bank Transfer',
  //   category: 'Lorem ipsum dolor sit amet consectetur',
  // },
  {
    id: 1,
    name: 'MTN Payment',
    category: 'Lorem ipsum dolor sit amet consectetur',
  },
];

const Payment = props => {
  const bidId = props?.route?.params?.bidId;
  const bidAmount = props?.route?.params?.amount;
  const {confirmPayment, loading} = useConfirmPayment();

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProjectReducer = useSelector(state => state.ProjectReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '40%']);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [IsProceed, setIsProceed] = useState(false);
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [showSeen, setShowSeen] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [openPayNow, setOpenPayNow] = useState(null);
  const [isValidateMobile, setIsValidateMobile] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bankId, setBankId] = useState('');
  const [bName, setBname] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [ifsc, setIFSC] = useState('');

  const phoneRegex = /^[0-9]{10,15}$/;

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const bidStatusChange = (status, id) => {
    let obj = {
      data: {action: status, phone_number: phoneNo},
      bid_id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(bidStatusRequest(obj));
        // console.log(obj);
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  // useEffect(() => {
  //   CreatePaymentIntent();
  // }, []);
  const CreatePaymentIntent = () => {
    let obj = {
      // amount: bidAmount,
      bid_id: bidId,
    };
    dispatch(CreatePaymentRequest(obj));
  };

  const addBankAccountFun = () => {
    let obj = {
      bank_account_number: AccountNo,
      routing_number: ifsc,
      bank_name: bName,
    };

    connectionrequest()
      .then(() => {
        dispatch(addBankAccountRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/CreatePaymentRequest':
        status = AuthReducer.status;
        setIsLoading(true);
        break;
      case 'Auth/CreatePaymentSuccess':
        status = AuthReducer.status;
        setIsLoading(false);
        console.log(
          'clientSecret-->',
          AuthReducer?.CreatePaymentResponse?.data,
        );

        setIsProceed(true);
        break;
      case 'Auth/CreatePaymentFailure':
        status = AuthReducer.status;
        break;

      ////////////////////////// Stripe payment ////////////////
      case 'Auth/StripePaymentRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/StripePaymentSuccess':
        status = AuthReducer.status;
        setIsLoading(false);
        setIsProceed(false);
        setTimeout(() => {
          setShowSeen(true);
        }, 1000);
        break;
      case 'Auth/StripePaymentFailure':
        status = AuthReducer.status;
        setIsLoading(false);
        setIsProceed(false);
        break;
    }
  }

  if (status1 == '' || ProjectReducer.status != status1) {
    switch (ProjectReducer.status) {
      case 'Project/bidStatusRequest':
        status1 = ProjectReducer.status;
        break;
      case 'Project/bidStatusSuccess':
        status1 = ProjectReducer.status;
        setShowSeen(true);

        break;
      case 'Project/bidStatusFailure':
        status1 = ProjectReducer.status;
        break;
    }
  }

  if (status2 == '' || ProfileReducer.status != status2) {
    switch (ProfileReducer.status) {
      case 'Profile/addBankAccountRequest':
        status2 = ProfileReducer.status;

        break;
      case 'Profile/addBankAccountSuccess':
        status2 = ProfileReducer.status;
        dispatch(BankTransferRequest({bid_id: bidId}));
        break;
      case 'Profile/addBankAccountFailure':
        status2 = ProfileReducer.status;
        break;

      case 'Profile/BankTransferRequest':
        status2 = ProfileReducer.status;
        break;
      case 'Profile/BankTransferSuccess':
        status2 = ProfileReducer.status;
        break;
      case 'Profile/BankTransferFailure':
        status2 = ProfileReducer.status;
        break;
    }
  }

  const handlePayPress = async () => {
    try {
      const {paymentIntent, error} = await confirmPayment(
        AuthReducer?.CreatePaymentResponse?.data?.client_secret,
        {
          paymentMethodType: 'Card',
        },
      );
      console.log('enter payment', paymentIntent);
      if (error) {
        console.error('Payment confirmation error:', error);
        setIsProceed(false);
        setIsLoading(false);

        dispatch(StripePaymentFailRequest({bid_id: bidId}));
        Alert.alert('Fail!', `Payment is Unsuccessful`, [
          {
            text: 'OK',
            onPress: () =>
              console.log(
                'sucess response--->',
                AuthReducer?.CreatePaymentResponse?.data?.client_secret,
              ),
          },
        ]);

        // Handle error
      } else if (paymentIntent) {
        console.log('Success:', paymentIntent);
        let obj = {
          session_id: paymentIntent?.id,
          bid_id: bidId,
        };
        dispatch(StripePaymentRequest(obj));
      }
    } catch (e) {
      console.error('Error:', e);
    } finally {
    }
  };

  const handleMobileNumberValidation = () => {
    if (phoneNo?.length < 9) {
      setIsValidateMobile(true);
    } else {
      setIsValidateMobile(false);
    }
  };

  const paymentComponent = () => (
    <View style={styles.paymentContainer}>
      {openPayNow === 'MTN Payment' && (
        <View>
          <TextIn
            show={phoneNo?.length > 0}
            value={phoneNo}
            isVisible={false}
            onChangeText={val => {
              setPhoneNo(val?.replace(/[^0-9]/g, ''));
              handleMobileNumberValidation();
              setIsValidateMobile(false);
            }}
            height={normalize(50)}
            width={normalize(280)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            borderWidth={1}
            maxLength={12}
            marginTop={normalize(15)}
            marginBottom={normalize(10)}
            keyboardType={'numeric'}
            label={`${openPayNow} Registered Phone Number`}
            placeholder={'Enter Registered Phone Number'}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            paddingLeft={normalize(10)}
            paddingRight={normalize(10)}
          />
          {isError && phoneNo === '' && (
            <View style={{width: '100%', left: normalize(-20)}}>
              <CustomErrorComponent label={errorMessages.ENTER_MOBILE_NUMBER} />
            </View>
          )}
          {isError && isValidateMobile && phoneNo?.length > 1 && (
            <View style={{width: '100%', left: normalize(-20)}}>
              <CustomErrorComponent
                label={errorMessages.NUMBER_IN_CORRECT_FORMAT}
              />
            </View>
          )}
        </View>
      )}

      <View style={styles.btnMainContainer}>
        <NextBtn
          loading={ProjectReducer?.status == 'Project/bidStatusRequest'}
          height={normalize(50)}
          title={'Pay Now'}
          borderColor={Colors.themeGreen}
          color={Colors.themeWhite}
          backgroundColor={Colors.themeGreen}
          onPress={() =>
            openPayNow === 'MTN Payment'
              ? !phoneRegex.test(phoneNo)
                ? showErrorAlert('Invalid phone number')
                : bidStatusChange('accept', bidId)
              : null
          }
        />
      </View>
    </View>
  );

  const renderServices = (item, index) => (
    <View style={styles.renderConatiner}>
      <TouchableOpacity
        onPress={() => {
          setOpenPayNow(openPayNow === item.name ? null : item.name);
        }}
        style={styles.renderSubConatiner}>
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={styles.nameTxt}>{item.name}</Text>
          <Text style={styles.categoryTxt}>{item.category}</Text>
        </View>
        <Image
          source={Icons.RightArrow}
          style={styles.featuredStarImg}
          resizeMode="contain"
          transform={[
            {
              rotate: openPayNow === item.name ? '90deg' : '0deg',
            },
          ]}
        />
      </TouchableOpacity>
      {openPayNow === item.name && paymentComponent()}
    </View>
  );

  const successComponent = () => {
    return (
      <View style={styles.succesMainComponent}>
        <Image
          source={GifImage.Done}
          style={{width: normalize(100), height: normalize(100)}}
        />
        <View style={styles.modalHeaderTxtContainer}>
          <Text style={styles.modalHeaderTxt}>Success!</Text>
          <Text style={styles.modalHeaderSubTxt}>{'Payment Successful!'}</Text>
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
                if (openPayNow == 'Card') {
                  NavigationService.navigate('Project');
                } else {
                  NavigationService.goBack();
                }
                // NavigationService.navigate('Project');
              });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <StripeProvider publishableKey="pk_test_51Q1uGJ06D9ayl3BS7fwiypJd2zkTFHJte5Itulh67991fpNzKtQchHA2bqwGhIgxhzhw6qvl3Zn81lCPpEw2JOS600ErjSExQF">
        {/* <StripeProvider publishableKey="pk_live_51Q1uGJ06D9ayl3BSgKDYwyJACUxw0zabwV36cp3Itr7DbWnkZYEpQ4jH4IkVVWiKj89icIpbhogQeuHdiX1ElZsC00kbwomUZc"> */}
        <View style={styles.mainContainer}>
          <Loader visible={AuthReducer.status == 'Auth/CreatePaymentRequest'} />
          <Header backIcon={Icons.BackIcon} headerTitle={'Payment'} />
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
              {!IsProceed ? (
                <View>
                  <FlatList
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => (
                      <View style={{height: normalize(10)}} />
                    )}
                    // ListHeaderComponent={() => listHeaderComponent()}
                    renderItem={({item, index}) => renderServices(item, index)}
                    contentContainerStyle={styles.listConatiner}
                  />
                  <View style={[styles.listConatiner, {bottom: normalize(30)}]}>
                    <View style={styles.renderConatiner}>
                      <TouchableOpacity
                        onPress={() => {
                          setOpenPayNow('Card');
                          CreatePaymentIntent();
                        }}
                        style={styles.renderSubConatiner}>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.nameTxt}>{'Card Payment'}</Text>
                          <Text style={styles.categoryTxt}>
                            {'Transaction for purchased services'}
                          </Text>
                        </View>
                        <Image
                          source={Icons.RightArrow}
                          style={styles.featuredStarImg}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={[css.f1, css.bgwhite]}>
                  <Text></Text>
                </View>
              )}
            </View>
          </SafeAreaView>
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

        {Platform.OS == 'android' && IsProceed ? (
          //////////////// in debug mode it will not work ////////////////
          <>
            <BottomSheet
              ref={bottomSheetRef}
              animateOnMount={false}
              enableContentPanningGesture={false}
              enableHandlePanningGesture={false}
              index={1}
              snapPoints={snapPoints}>
              <View
                style={[
                  styles.CardAddmodalOuter,
                  {height: isKeyboardVisible ? normalize(250) : normalize(270)},
                ]}>
                <KeyboardAvoidingView>
                  <ScrollView>
                    <CardField
                      postalCodeEnabled={false}
                      placeholder={{
                        number: '4242 4242 4242 4242',
                      }}
                      cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                        placeholderColor: Colors.themeGray,
                      }}
                      style={{
                        width: '100%',
                        height: 200,
                        // marginVertical: 30,
                      }}
                    />
                  </ScrollView>
                </KeyboardAvoidingView>
                <View style={[css.mb4]}>
                  <NextBtn
                    loading={isLoading}
                    title={'Proceed to pay'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      handlePayPress();
                      setIsLoading(true);
                      // setIsProceed(false),
                    }}
                  />
                </View>
              </View>
            </BottomSheet>
          </>
        ) : (
          <Modal
            isVisible={IsProceed}
            transparent={true}
            animationType={'fade'}
            avoidKeyboard={false}
            style={[css.m0, css.jcfe]}>
            <View
              style={[
                css.p3,
                {
                  backgroundColor: Colors.themeWhite,
                },
                // {marginTop: Platform.OS == 'ios' ? normalize(30) : 0},
              ]}>
              <View style={[css.f1]}>
                <TouchableOpacity
                  style={[css.aic, {top: normalize(-350)}]}
                  onPress={() => setIsProceed(!IsProceed)}>
                  {/* <Image source={icons.close} style={[css.closeIcon]} /> */}
                </TouchableOpacity>
              </View>

              <View
                style={[styles.CardAddmodalOuter, {height: normalize(350)}]}>
                <KeyboardAwareScrollView
                  enableOnAndroid={true}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: normalize(50),
                  }}>
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      backgroundColor: '#FFFFFF',
                      textColor: '#000000',
                    }}
                    style={{
                      width: '100%',
                      height: 70,
                      marginVertical: 30,
                    }}
                  />
                </KeyboardAwareScrollView>
              </View>
              <View style={[css.mb4]}>
                <NextBtn
                  loading={isLoading}
                  title={'Proceed to pay'}
                  borderColor={Colors.themeGreen}
                  color={Colors.themeWhite}
                  backgroundColor={Colors.themeGreen}
                  onPress={() => {
                    handlePayPress();
                    setIsLoading(true);
                    // setIsLoading(true);
                  }}
                />
              </View>
            </View>
          </Modal>
        )}
      </StripeProvider>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },

  renderConatiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    // paddingTop: normalize(12),
    // paddingHorizontal: normalize(10),
    // paddingVertical: normalize(15),
  },

  btnMainContainer: {
    width: '100%',
    marginTop: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: normalize(18),
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
  paymentContainer: {
    paddingHorizontal: normalize(10),
    paddingBottom: normalize(15),
    borderTopWidth: 1,
    borderColor: Colors.themeBoxBorder,
  },
  renderSubConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
  },
  nameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  categoryTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(22),
  },
  succesMainComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  listConatiner: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(10),
    paddingBottom: normalize(30),
  },
  featuredStarImg: {
    width: normalize(24),
    height: normalize(24),
  },
  CardAddmodalOuter: {
    backgroundColor: 'white',
    width: width,
    position: 'absolute',
    bottom: 0,
    color: 'black',
    borderTopLeftRadius: normalize(15),
    borderTopRightRadius: normalize(15),
    padding: normalize(25),
  },
});
