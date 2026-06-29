import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  Image,
  ImageBackground,
  Linking,
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
  PayCodeRequest,
  SubscriptionRequest,
} from '../../redux/reducer/AuthReducer';
import Images from '../../themes/Images';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import * as RNIap from 'react-native-iap';
import css from '../../themes/css';
import Modal from 'react-native-modal';
import TextIn from '../../components/TextIn';
import {cmsRequest} from '../../redux/reducer/ProfileReducer';

let status = '';
// YOUR_APP_SPECIFIC_SHARED_SECRET  c8600eea07e04f0f8042d2e79b1c4a2e
const UserMembershipPlan = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  let purchaseUpdateSubscription = null;
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState();
  const [payCode, setPayCode] = useState('');
  const [planList, setPlanList] = useState([]);
  const [buyPlan, setBuyPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [codeModal, setCodeModal] = useState(false);
  const [viewAgreementModal, setViewAgreementModal] = useState(false);
  // Add state for Privacy Policy modal
  const [viewPrivacyPolicyModal, setViewPrivacyPolicyModal] = useState(false);

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
  const EULA_TEXT = `
This End-User License Agreement is a legal agreement between you and "TRUSTWORK Limited Liability Company" regarding your use of the "TrustWork" mobile application (“App”).

1. License Grant
We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal and non-commercial use only.
\n
2. Subscriptions & In-App Purchases

2.1 Subscriptions
- Payment will be charged to your App Store or Play Store account.
- Subscription renews automatically unless canceled 24 hours before expiry.
- Renewal charges will apply within 24 hours before the end of the period.
- Prices and features may vary.
\n
2.2 In-App Purchases
All one-time purchases are handled securely by the App Store or Play Store.
\n
2.3 Refunds
Refunds follow App Store or Play Store policies.
\n
3. User Responsibilities
You agree NOT to:
- Copy, modify, reverse engineer the App.
- Use the App for unlawful activity.
- Share or sell your access.
- Bypass payment or subscription systems.
\n
4. Ownership & Intellectual Property
The App and all content are owned by "TRUSTWORK Limited Liability Company".
\n
5. Privacy Policy
Your use is governed by our Privacy Policy:
https://trustwork.live/privacy-policy/
\n
6. Termination
We may suspend/terminate your access if you violate terms or engage in fraud.
\n
7. Disclaimer of Warranties
The App is provided “as is” without guarantees.
\n
8. Limitation of Liability
We are not liable for indirect, incidental, or consequential damages.
\n
9. Changes to the EULA
We may update the EULA anytime. Continued use means acceptance.
`;

  // Privacy Policy Text (can be fetched or hardcoded)
  const PRIVACY_POLICY_TEXT = `
Your privacy is important to us. This Privacy Policy explains how "TRUSTWORK Limited Liability Company" collects, uses, discloses, and safeguards your information when you use our "TrustWork" mobile application.

1. Information We Collect
We may collect information about you in a variety of ways. The information we may collect via the App includes:

- Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the App or when you choose to participate in various activities related to the App.

- Derivative Data: Information our servers automatically collect when you access the App, such as your native actions that are integral to the App, as well as other interactions with the App and other users via server log files.

- Financial Data: Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the App. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processors (Apple Store, Google Play Store).

2. Use of Your Information
Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:
- Create and manage your account.
- Process your payments and refunds.
- Email you regarding your account or order.
- Enable user-to-user communications.
- Fulfill and manage purchases, orders, payments, and other transactions related to the App.

3. Disclosure of Your Information
We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
- By Law or to Protect Rights
- Third-Party Service Providers
- Business Transfers

4. Security of Your Information
We use administrative, technical, and physical security measures to help protect your personal information.

5. Policy for Children
We do not knowingly solicit information from or market to children under the age of 13.

6. Contact Us
If you have questions or comments about this Privacy Policy, please contact us at:
TRUSTWORK Limited Liability Company
[Your Contact Email/Address]

For the full, detailed Privacy Policy, please visit:
https://trustwork.live/privacy-policy/
`;

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
    try {
      let response = await RNIap.finishTransaction({
        purchase: data,
        isConsumable: false,
        developerPayloadAndroid: '',
      });
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
      connectionrequest()
        .then(() => {
          dispatch(cmsRequest());
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  }, [isFocused]);

  const getPlanDescription = planTitle => {
    const name = planTitle?.toLowerCase() || '';

    if (name.includes('week')) {
      return 'Access trusted and vetted service providers for the entire week, along with free escrow services that ensure secure and reliable project execution. This plan renews automatically each week unless cancelled.';
    }

    if (name.includes('month')) {
      return 'Access trusted and verified service providers for a full month, supported by free escrow services that strengthen security and trust throughout your projects. This plan renews automatically every month unless cancelled.';
    }

    if (name.includes('year')) {
      return 'Access trusted and vetted service providers for the entire year, backed by free escrow services that provide maximum security, trust, and peace of mind for all your long-term projects. This plan renews automatically each year unless cancelled.';
    }

    return '';
  };

  const codeSubmit = () => {
    dispatch(PayCodeRequest({code: payCode}));
  };

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

  // Re-fetch plans when app returns from background
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground — re-fetch subscriptions and membership list
        if (connected) {
          handleGetSubscriptions();
        }
        getMembershipList();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [connected]);

  const getPlanDuration = title => {
    if (!title) return '';
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('week')) {
      return '1 Week';
    }
    if (lowerTitle.includes('month')) {
      return '1 Month';
    }
    if (lowerTitle.includes('year')) {
      return '1 Year';
    }
    return ''; // Fallback
  };

  const formatPlanTitle = title => {
    if (!title) return '';
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('week')) {
      return 'TrustWork Weekly';
    }
    if (lowerTitle.includes('month')) {
      return 'TrustWork Monthly';
    }
    if (lowerTitle.includes('year')) {
      return 'TrustWork Yearly';
    }

    // Fallback for other cases, though the above should cover it
    return title.replace('Membership_', 'TrustWork ');
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/MembershipListRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/MembershipSuccess':
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

      case 'Auth/PayCodeRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/PayCodeSuccess':
        status = AuthReducer.status;
        setCodeModal(false);

        setTimeout(() => {
          AuthReducer?.roleType === 'provider'
            ? NavigationService.navigate('ProviderBottomTabNav')
            : NavigationService.navigate('UserBottomTabNav');
        }, 500);

        break;
      case 'Auth/PayCodeFailure':
        status = AuthReducer.status;
        break;
    }
  }
  const OpenCodeModal = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.themeWhite,
          padding: normalize(10),
          borderRadius: normalize(15),
        }}>
        <Text style={styles.headerTxtModal}>
          {'Have a Code? Enter it Below'}
        </Text>
        <View style={[css.m4]}>
          <TextIn
            show={payCode?.length > 0 ? true : false}
            value={payCode}
            isVisible={false}
            onChangeText={val => {
              setPayCode(val);
            }}
            height={normalize(50)}
            width={normalize(200)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            borderWidth={1}
            maxLength={16}
            keyboardType={'number-pad'}
            marginBottom={normalize(10)}
            outlineTxtwidth={normalize(50)}
            label={'Payment Code'}
            placeholder={'Enter Payment Code'}
            //placeholderIcon={Icons.Email}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            //Eyeshow={true}
            paddingLeft={normalize(10)}
            paddingRight={normalize(10)}
          />

          <View style={[css.mt3]}>
            <NextBtn
              loading={AuthReducer?.status == 'Auth/PayCodeRequest'}
              height={normalize(40)}
              title={'Verify Code'}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
              onPress={() => {
                codeSubmit();
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const ViewAgreementComponent = () => {
    return (
      <View
        style={[
          styles.modalViewContainer,
          {
            maxHeight: '80%', // ✅ makes ScrollView scrollable
            padding: 16,
          },
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.FustatMedium,
              marginBottom: 10,
              color: Colors.themeBlack,
            }}>
            END-USER LICENSE AGREEMENT (EULA)
          </Text>

          <Text
            style={{
              fontSize: normalize(14),
              fontFamily: Fonts.FustatMedium,
              marginBottom: 20,
              color: '#555',
            }}>
            Last Updated: 07-11-2025
          </Text>
          <Text style={styles.modalText}>{EULA_TEXT}</Text>
        </ScrollView>
      </View>
    );
  };

  // New component for Privacy Policy Modal
  const ViewPrivacyPolicyComponent = () => {
    const privacyPolicyUrl = 'https://trustwork.live/privacy-policy/';
    return (
      <View
        style={[
          styles.modalViewContainer,
          {
            maxHeight: '80%', // makes ScrollView scrollable
            padding: 16,
          },
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.FustatMedium,
              marginBottom: 10,
              color: Colors.themeBlack,
            }}>
            PRIVACY POLICY
          </Text>

          <Text
            style={{
              fontSize: normalize(14),
              fontFamily: Fonts.FustatMedium,
              marginBottom: 20,
              color: '#555',
            }}>
            Last Updated: 07-11-2025
          </Text>
          <Text style={styles.modalText}>{PRIVACY_POLICY_TEXT}</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.canOpenURL(privacyPolicyUrl).then(supported => {
                if (supported) {
                  Linking.openURL(privacyPolicyUrl);
                } else {
                  console.log(
                    "Don't know how to open URI: " + privacyPolicyUrl,
                  );
                }
              });
            }}>
            <Text
              style={[
                styles.modalText,
                {color: Colors.themeGreen, textDecorationLine: 'underline'},
              ]}>
              {privacyPolicyUrl}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

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
                onPress={() =>
                  Alert.alert(
                    'Confirm Logout !!',
                    'Are you sure you want to logout ?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {text: 'OK', onPress: () => dispatch(logoutRequest())},
                    ],
                    {cancelable: false},
                  )
                }>
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
                  {/* Your existing plan rendering logic already shows:
                    1. Title (item.title / item.name)
                    2. Price (item.localizedPrice / formattedPrice)
                    3. Length/Description (via getPlanDescription)
                    This setup meets the Title, Price, and Length requirements.
                  */}
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

                          <View style={[{width: '90%'}]}>
                            <View
                              style={{
                                marginRight: normalize(8),
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap', // Allow wrapping
                              }}>
                              <Text style={styles.featureText}>
                                {formatPlanTitle(
                                  Platform.OS == 'ios'
                                    ? item?.title
                                    : item?.name,
                                )}
                              </Text>
                              <Text
                                style={[
                                  styles.featureText,
                                  {marginLeft: 8, color: Colors.themeGreen},
                                ]}>
                                {Platform.OS === 'ios'
                                  ? item?.localizedPrice
                                  : item?.subscriptionOfferDetails?.[0]
                                      ?.pricingPhases?.pricingPhaseList?.[0]
                                      ?.formattedPrice || ''}
                              </Text>
                              {/* ADDED DURATION */}
                              <Text style={styles.planDuration}>
                                {`(${getPlanDuration(
                                  Platform.OS == 'ios'
                                    ? item?.title
                                    : item?.name,
                                )})`}
                              </Text>
                            </View>
                            <Text style={styles.planDescription}>
                              {getPlanDescription(
                                Platform.OS == 'ios'
                                  ? item?.title
                                  : item?.name,
                              )}
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

                  {/* Container for legal links */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setViewAgreementModal(true);
                      }}>
                      <Text style={styles.linkText}>
                        Terms of Use (EULA)
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.linkSeparator}>|</Text>

                    <TouchableOpacity
                      onPress={() => {
                        setViewPrivacyPolicyModal(true);
                      }}>
                      <Text style={styles.linkText}>Privacy Policy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
      {/* <Modal
        propagateSwipe
        visible={codeModal}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackdropPress={() => setCodeModal(false)}>
        {OpenCodeModal()}
      </Modal> */}

      <Modal
        isVisible={viewAgreementModal}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={styles.modalContainer}
        onBackButtonPress={() => setViewAgreementModal(false)}
        // onSwipeComplete={() => setViewAgreementModal(false)}
        // swipeDirection={['down']} // You can use 'up', 'down', 'left', or 'right'
        onBackdropPress={() => setViewAgreementModal(false)}>
        {ViewAgreementComponent()}
      </Modal>

      {/* New Modal for Privacy Policy */}
      <Modal
        isVisible={viewPrivacyPolicyModal}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={styles.modalContainer}
        onBackButtonPress={() => setViewPrivacyPolicyModal(false)}
        onBackdropPress={() => setViewPrivacyPolicyModal(false)}>
        {ViewPrivacyPolicyComponent()}
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
    // alignItems: 'center',
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
    marginTop: normalize(2),
  },
  selectedCheckmark: {
    backgroundColor: '#388E3C', // Darker green for selected
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.FustatSemiBold,
  },
  planDuration: {
    fontSize: 14,
    color: '#555', // A slightly muted color
    fontFamily: Fonts.FustatMedium,
    marginLeft: 8,
  },
  planDescription: {
    fontSize: 12,
    color: '#555',
    fontFamily: Fonts.FustatMedium,
    marginTop: 4,
  },
  selectedFeatureText: {
    color: '#388E3C', // Darker color for selected text
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  headerTxtModal: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(17),
    textAlign: 'center',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
  },
  modalViewContainer: {
    width: '90%',
    // height: normalize(450), // Removed fixed height to allow maxHeight
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: normalize(40), // Removed margin
    backgroundColor: Colors.themeWhite,
    padding: normalize(15),
    borderRadius: normalize(10),
  },
  modalText: {
    fontSize: normalize(13),
    fontFamily: Fonts.FustatMedium,
    color: '#333',
    lineHeight: normalize(20),
  },
  // New styles for legal links
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(20),
    flexWrap: 'wrap', // Allow wrapping on small screens
  },
  linkText: {
    color: Colors.themeGreen,
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    color: Colors.themeGray,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    marginHorizontal: normalize(10),
  },
});

export default UserMembershipPlan;
