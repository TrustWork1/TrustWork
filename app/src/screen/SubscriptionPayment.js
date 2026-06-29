import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, GifImage, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import CustomErrorComponent from '../components/CustomErrorComponent';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {
  mtnPaymentRequest,
  orangePaymentRequest,
} from '../redux/reducer/AuthReducer';
import errorMessages from '../utils/errorMessages';
import connectionrequest from '../utils/helpers/NetInfo';
import showErrorAlert from '../utils/helpers/Toast';

const phoneRegex = /^[0-9]{9,15}$/;

// Orange payment status categories
const SUCCESS_STATUSES = ['SUCCESS', 'SUCCESSFUL', 'SUCCEEDED'];

const listData = [
  {
    id: 2,
    name: 'MTN Payment',
    category: 'Pay using your MTN Mobile Money wallet',
  },
  {
    id: 3,
    name: 'ORANGE Payment',
    category: 'Pay using your Orange Money wallet',
  },
];

const SubscriptionPayment = props => {
  const {plan} = props.route.params;

  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [showSeen, setShowSeen] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [openPayNow, setOpenPayNow] = useState(null);
  const [isValidateMobile, setIsValidateMobile] = useState(false);
  const [isError, setIsError] = useState(false);
  // Orange Pay pending state
  const [orangePending, setOrangePending] = useState(false);

  // ─── MTN Payment ────────────────────────────────────────────────────────────
  const paymentSubscription = () => {
    setIsError(true);
    if (phoneNo === '') return;
    if (!phoneRegex.test(phoneNo)) {
      setIsValidateMobile(true);
      return;
    }
    setIsError(false);
    setIsValidateMobile(false);

    const obj = {
      subscription_plan_id: plan.id,
      phone_number: phoneNo,
    };

    connectionrequest()
      .then(() => dispatch(mtnPaymentRequest(obj)))
      .catch(() => showErrorAlert('Please connect to the internet'));
  };

  // ─── Orange Payment ──────────────────────────────────────────────────────────
  const orangePayFun = () => {
    setIsError(true);
    if (phoneNo === '') return;
    if (!phoneRegex.test(phoneNo)) {
      setIsValidateMobile(true);
      return;
    }
    setIsError(false);
    setIsValidateMobile(false);

    // Cameroon prefix: prepend 237 if 9-digit number
    const finalPhone = phoneNo.length === 9 ? `237${phoneNo}` : phoneNo;

    const obj = {
      bid_id: String(plan.id),
      subscriberMsisdn: finalPhone,
      description: 'Subscription payment',
      payment_type: 'orange_project',
    };

    connectionrequest()
      .then(() => dispatch(orangePaymentRequest(obj)))
      .catch(() => showErrorAlert('Please connect to the internet'));
  };

  const handleMobileNumberValidation = () => {
    setIsValidateMobile(phoneNo?.length < 9);
  };

  // ─── Status effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    switch (AuthReducer.status) {
      case 'Auth/mtnPaymentSuccess':
        setShowSeen(true);
        break;
      case 'Auth/mtnPaymentFailure':
        break;

      case 'Auth/orangePaymentSuccess': {
        const finalStatus = AuthReducer?.orangePaymentResponse?.finalStatus;
        if (finalStatus && SUCCESS_STATUSES.includes(finalStatus)) {
          // Polling resolved as success
          setOrangePending(false);
          setShowSeen(true);
        } else if (finalStatus === 'PENDING') {
          // Initial response — show pending screen while saga polls
          setOrangePending(true);
        }
        break;
      }
      case 'Auth/orangePaymentFailure': {
        setOrangePending(false);
        break;
      }
    }
  }, [AuthReducer.status]);

  // ─── UI Components ───────────────────────────────────────────────────────────
  const pendingComponent = () => (
    <View style={styles.succesMainComponent}>
      <ActivityIndicator size="large" color={Colors.themeGreen} />
      <View style={styles.modalHeaderTxtContainer}>
        <Text style={styles.modalHeaderTxt}>Processing...</Text>
        <Text style={styles.modalHeaderSubTxt}>
          Please complete the payment on your Orange Money app or by dialing
          *150#. We're verifying your payment.
        </Text>
      </View>
    </View>
  );

  const paymentComponent = () => (
    <View style={styles.paymentContainer}>
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

      <View style={styles.btnMainContainer}>
        <NextBtn
          loading={
            AuthReducer?.status === 'Auth/mtnPaymentRequest' ||
            AuthReducer?.status === 'Auth/orangePaymentRequest'
          }
          height={normalize(50)}
          title={'Pay Now'}
          borderColor={Colors.themeGreen}
          color={Colors.themeWhite}
          backgroundColor={Colors.themeGreen}
          onPress={() => {
            if (openPayNow === 'MTN Payment') {
              paymentSubscription();
            } else if (openPayNow === 'ORANGE Payment') {
              orangePayFun();
            }
          }}
        />
      </View>
    </View>
  );
  const renderServices = item => (
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
                AuthReducer?.roleType === 'provider'
                  ? NavigationService.navigate('ProviderBottomTabNav')
                  : NavigationService.navigate('UserBottomTabNav');
              });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Subscription Payment'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View>
            <FlatList
              data={listData}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(10)}} />
              )}
              // ListHeaderComponent={() => listHeaderComponent()}
              renderItem={({item}) => renderServices(item)}
              contentContainerStyle={styles.listConatiner}
            />
          </View>
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

      {/* Orange Pay — payment in progress */}
      <Modal
        propagateSwipe
        visible={orangePending}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackButtonPress={() => {}}>
        <View style={styles.modalMainContainer}>
          <View style={styles.modalSubContainer}>{pendingComponent()}</View>
        </View>
      </Modal>
    </View>
  );
};

export default SubscriptionPayment;

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
});
