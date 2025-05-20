import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getAvailablePurchases,
  initConnection,
  requestSubscription,
  useIAP,
  validateReceiptIos,
} from 'react-native-iap';
import {useDispatch, useSelector} from 'react-redux';
import NextBtn from '../../components/NextBtn';
import NavigationService from '../../navigators/NavigationService';
import {
  logoutRequest,
  MembershipListRequest,
  SubscriptionRequest,
} from '../../redux/reducer/AuthReducer';
import Images from '../../themes/Images';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import * as RNIap from 'react-native-iap';

let status = '';
// YOUR_APP_SPECIFIC_SHARED_SECRET  c8600eea07e04f0f8042d2e79b1c4a2e
const UserMembershipPlan = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  let purchaseUpdateSubscription = null;
  const DataList = [
    {
      id: 1,
      title: 'MemberShip_Weekly',
      localizedPrice: '₹6,900.00',
    },
    {
      id: 2,
      title: 'MemberShip_Monthly',
      localizedPrice: '₹4,999.00',
    },
    {
      id: 3,
      title: 'MemberShip_Yearly',
      localizedPrice: '₹49,999.00',
    },
  ];

  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState();
  const [planList, setPlanList] = useState([]);
  const [buyPlan, setBuyPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [isloading, setIsloading] = useState(false);
  //////////////////////// In-app start ///////////////////////////////
  const {
    getProducts,
    products,
    connected,
    subscriptions, //returns subscriptions for this app.
    getSubscriptions, //Gets available subsctiptions for this app.
    currentPurchase, //current purchase for the tranasction
    finishTransaction,
    purchaseHistory, //return the purchase history of the user on the device (sandbox user in dev)
    getPurchaseHistory, //gets users purchase history
  } = useIAP();

  const subscriptionSkus = AuthReducer?.isDiscountApplied
    ? [
        'membership.weekly_discount',
        'membership.monthly_discount',
        'membership.yearly_discount',
      ]
    : ['membership.weekly', 'membership.monthly', 'membership.yearly'];

  const handleGetSubscriptions = async () => {
    // let connection = await initConnection();

    try {
      const subscription = await getSubscriptions({skus: subscriptionSkus});
      console.log(subscription);
      if (!subscription) {
        console.log('Subscription not found or inactive.');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleGetPurchaseHistory = async () => {
    await initConnection();
    try {
      await getPurchaseHistory();
    } catch (error) {
      console.log('Error dfdfdfdfdf', error);
      // errorLog({message: 'handleGetPurchaseHistory', error});
    }
  };

  useEffect(() => {
    handleGetPurchaseHistory();
  }, []);

  useEffect(() => {
    const checkCurrentPurchase = async purchase => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (Platform.OS === 'ios') {
              const isTestEnvironment = __DEV__;

              //send receipt body to apple server to validete
              const appleReceiptResponse = await validateReceiptIos(
                {
                  'receipt-data': receipt,
                  password: 'c8600eea07e04f0f8042d2e79b1c4a2e',
                },
                isTestEnvironment,
              );

              //if receipt is valid
              if (appleReceiptResponse) {
                const {status} = appleReceiptResponse;
                if (status) {
                  // props?.navigation.navigate("HomeScreen");
                }
              }

              return;
            }
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction, buyPlan]);

  useEffect(() => {
    if (connected) {
      handleGetSubscriptions();
    }
  }, [connected]);

  const sortDataByPrice = data => {
    console.log(data);
    if (Platform.OS == 'ios') {
      const sortedData = data.sort((a, b) => {
        parseFloat(a.price) - parseFloat(b.price);
      });
      console.log(sortedData);
      if (sortedData?.length > 0) {
        console.log(sortedData);
        setPlanList(sortedData);
      }
    } else {
      const sortedData = data.sort((a, b) => {
        const priceA = parseFloat(
          a.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice.replace(
            /[₹,]/g,
            '',
          ),
        );
        const priceB = parseFloat(
          b.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice.replace(
            /[₹,]/g,
            '',
          ),
        );
        return priceA - priceB;
      });
      console.log(sortedData);
      if (sortedData?.length > 0) {
        console.log(sortedData);
        setPlanList(sortedData);
      }
    }
  };

  useMemo(() => {
    console.log('subscriptions--->', subscriptions);
    sortDataByPrice(subscriptions);
  }, [subscriptions]);

  const getSubscriptionPlan = () => {
    // const priceString = '₹ 9,900.00';
    // const formattedPrice = priceString.replace(/[^\d]/g, '').slice(0, -2);

    // Get the selected subscription plan
    if (selectedPlan?.title == undefined) {
      showErrorAlert('Please select a subscription plan');
    } else {
      if (Platform.OS == 'ios') {
        handleBuySubscription(
          selectedPlan?.productId,
          selectedPlan?.localizedPrice,
          selectedPlan?.title,
        );
      } else {
        console.log('android checkinggg', selectedPlan);

        handleBuySubscriptionAndroid(
          selectedPlan?.productId,
          selectedPlan?.subscriptionOfferDetails[0].pricingPhases
            ?.pricingPhaseList[0].formattedPrice,
          selectedPlan?.subscriptionOfferDetails[0].offerToken,
          selectedPlan?.name,
        );
      }
    }
  };

  async function acknowledgeSubscription(data) {
    console.log('134 /////////////', data);
    try {
      let response = await RNIap.finishTransaction({
        purchase: data,
        isConsumable: false,
        developerPayloadAndroid: '',
      });
      console.log('res: 137', response);
    } catch (err) {
      console.log('err 139', err);
      // CustomToast(err.message);
    }
  }

  const handleBuySubscriptionAndroid = async (
    productId,
    amount,
    token,
    planName,
  ) => {
    setIsloading(true);
    const sub = [{sku: productId, offerToken: token}];
    let subscriptionOffers = [{sku: productId, offerToken: token}];

    try {
      await RNIap.requestSubscription({subscriptionOffers});

      purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(purchase => {
        // setisVisible(false);
        console.log('158 PURCHASE DONE SUCCESSFULLY >>>>>>>: ', purchase);
        const numericString = amount.replace(/[₹,]/g, '');
        const amountNumber = parseFloat(numericString);
        console.log(
          'subscriptionReceipt--->',
          JSON.parse(purchase?.transactionReceipt),
        );

        dispatch(
          SubscriptionRequest({
            isSubscribed: true,
            subscriptionPlan: planName,
            subscriptionReceipt: JSON.parse(purchase?.transactionReceipt),
            subscription_price: amountNumber,
            subscriptionType: 'Google',
          }),
        );

        setIsloading(false);
        acknowledgeSubscription(purchase);
      });
    } catch (error) {
      setIsloading(false);
      console.log('Error', error);
    }
  };

  const handleBuySubscription = async (productId, amount, planName) => {
    setIsloading(true);
    const purchases = await getAvailablePurchases();
    const isAlreadySubscribed = purchases.some(
      purchase => purchase.productId === productId,
    );
    if (isAlreadySubscribed) {
      setIsloading(false);
      Alert.alert('User already has an active subscription plan');
      // Handle existing subscription (e.g., show a message or proceed with logic)
    } else {
      try {
        let receipt = await requestSubscription({
          sku: productId,
        });
        console.log('Purchase successful', receipt);
        const priceString = amount;
        const formattedPrice = priceString.replace(/[^\d]/g, '').slice(0, -2);
        dispatch(
          SubscriptionRequest({
            isSubscribed: true,
            subscriptionPlan: planName,
            subscriptionReceipt: receipt,
            // subscriptionReceipt:  receipt?.transactionReceipt,
            subscription_price: formattedPrice,
            subscriptionType: 'Apple',
            // subscription_price:''
          }),
        );
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.log('Error', error);
        // if (error instanceof PurchaseError) {
        //   CustomToast(error?.code);
        //   // errorLog({ message: `[${error.code}]: ${error.message}`, error });
        // } else {
        //   CustomToast(error?.code);
        // }
      }
    }
  };

  //////////////////////// In-app end ///////////////////////////////

  useEffect(() => {
    if (isFocused) {
      getMembershipList();
    }
  }, [isFocused]);

  const getMembershipList = () => {
    connectionrequest()
      .then(() => {
        // let obj = {
        //   is_payment_verified: true,
        // };
        dispatch(MembershipListRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/MembershipListRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/MembershipListSuccess':
        status = AuthReducer.status;
        // setPlanList(AuthReducer?.MembershipListResponse?.data);
        break;
      case 'Auth/MembershipListFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/SubscriptionRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/SubscriptionSuccess':
        status = AuthReducer.status;
        AuthReducer?.roleType === 'provider'
          ? NavigationService.navigate('ProviderBottomTabNav')
          : NavigationService.navigate('UserBottomTabNav');
        break;
      case 'Auth/SubscriptionFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View style={{flex: 1}}>
      <Loader visible={isloading} />
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
            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: normalize(5),
              }}>
              <TouchableOpacity
                style={{
                  height: normalize(33),
                  width: normalize(33),
                  marginRight: normalize(15),
                }}
                onPress={() => dispatch(logoutRequest())}>
                <Image style={styles.logoutIcon} source={Icons.logout} />
              </TouchableOpacity>
            </View>

            <View style={styles.headerContainer}>
              <View style={styles.headerTxtContainer}>
                <View style={styles.headerTxtBtnCont}>
                  <Text style={styles.headerTxt}>Membership Plan</Text>
                </View>
                <Text style={styles.headerSubTxt}>
                  {'Create an account to get in to our platform'}
                </Text>
              </View>
            </View>
          </SafeAreaView>

          <View style={{flex: 4}}>
            <SafeAreaView style={styles.bottomContiner}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  //paddingBottom: windowHeight / 4,
                  paddingBottom:
                    Platform.OS === 'ios' ? normalize(20) : normalize(75),
                }}>
                <View
                  style={{
                    marginTop: normalize(30),
                    flex: 1,
                    borderWidth: 2,
                    borderColor: Colors.themeBoxBorder,
                    borderRadius: 20,
                    margin: 10,
                    marginHorizontal: normalize(20),
                    paddingVertical: normalize(15),
                    backgroundColor: Colors.themeDocBackground,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                      borderBottomColor: Colors.themeBoxBorder,
                      paddingHorizontal: normalize(15),
                      paddingBottom: normalize(15),
                    }}>
                    <Image
                      source={Icons.Plan_Crown}
                      resizeMode="contain"
                      style={{
                        height: normalize(61),
                        width: normalize(42),
                      }}
                    />
                    {selectedFeatureIndex == undefined ? (
                      <View style={{marginLeft: normalize(15)}}>
                        <Text
                          style={{
                            fontFamily: Fonts.FustatMedium,
                            fontSize: normalize(15),
                            // lineHeight: normalize(26),
                            color: Colors.themeBlack,
                          }}>
                          Plan Name
                        </Text>
                      </View>
                    ) : (
                      <View style={{marginLeft: normalize(15), width: '80%'}}>
                        <Text
                          style={{
                            fontFamily: Fonts.FustatMedium,
                            fontSize: normalize(15),
                            // lineHeight: normalize(26),
                            color: Colors.themeBlack,
                          }}>
                          {Platform.OS == 'ios'
                            ? selectedPlan?.title
                            : selectedPlan?.name == 'weekly'
                            ? 'Membership_weekly'
                            : selectedPlan?.name}
                          {/* {selectedPlan?.title} */}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.FustatSemiBold,
                            fontSize: normalize(22),
                            // lineHeight: normalize(32),
                            color: Colors.themeBlack,
                          }}>
                          {Platform.OS == 'ios'
                            ? selectedPlan?.localizedPrice
                            : selectedPlan?.subscriptionOfferDetails[0]
                                .pricingPhases?.pricingPhaseList[0]
                                .formattedPrice}
                          {/* /
                          <Text
                            style={{
                              fontFamily: Fonts.FustatMedium,
                              fontSize: 16,
                              // lineHeight: normalize(22),
                            }}>
                            {selectedPlan?.plan_duration}
                          </Text> */}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{}}>
                    {planList?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedFeatureIndex(index);
                            setSelectedPlan(item);
                          }}
                          style={[
                            styles.featureItem,

                            // selectedFeatureIndex === index &&
                            //   styles.selectedFeatureItem,
                          ]}>
                          <View
                            style={[
                              styles.checkmark,
                              {
                                borderColor:
                                  selectedFeatureIndex === index
                                    ? Colors.themeGreen
                                    : Colors.themeGray,
                              },
                              // selectedFeatureIndex === index &&
                              //   styles.selectedCheckmark,
                            ]}>
                            {selectedFeatureIndex === index && (
                              <Image
                                source={Icons.Radio_Tick}
                                resizeMode="contain"
                                style={{
                                  height: normalize(12),
                                  width: normalize(12),
                                  // bottom: normalize(2),
                                }}
                              />
                            )}
                          </View>
                          <View style={{marginRight: normalize(8)}}>
                            <Text style={styles.featureText}>
                              {Platform.OS == 'ios'
                                ? item?.title
                                : item?.name == 'weekly'
                                ? 'Membership_weekly'
                                : item?.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.btnMainContainer}>
                  <NextBtn
                    // loading={AuthReducer?.status == 'Auth/signUpRequest'}
                    height={normalize(50)}
                    title={'PAY NOW'}
                    borderColor={Colors.themeGreen}
                    color={Colors.themeWhite}
                    backgroundColor={Colors.themeGreen}
                    onPress={() => {
                      getSubscriptionPlan();
                      // Platform.OS == 'ios'
                      //   ? getSubscriptionPlan()
                      //   : NavigationService.navigate('SubscriptionPayment', {
                      //       plan: selectedPlan,
                      //     });
                    }}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
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
  logoutBtn: {
    position: 'absolute',
    right: 0,
    padding: normalize(10),
  },
  headerTxtBtnCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoutIcon: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
    tintColor: Colors.themeWhite,
  },
  headerTxtContainer: {
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
    width: '100%',
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeWhite,
    fontSize: 26,
    lineHeight: normalize(36),
    flex: 1,
    textAlign: 'center',
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
  container: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    padding: 5,
    borderRadius: 5,
  },
  selectedFeatureItem: {
    backgroundColor: '#e0f7e4',
  },
  checkmark: {
    height: normalize(14),
    width: normalize(14),
    borderRadius: normalize(10),
    marginRight: 8,
    borderWidth: 1,
  },
  selectedCheckmark: {
    backgroundColor: '#388E3C', // Darker green for selected
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFeatureText: {
    color: '#388E3C', // Darker color for selected text
  },
});

export default UserMembershipPlan;
