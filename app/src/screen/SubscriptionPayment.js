import React, {useState} from 'react';
import {
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

import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import CustomErrorComponent from '../components/CustomErrorComponent';
import Header from '../components/Header';
import NextBtn from '../components/NextBtn';
import TextIn from '../components/TextIn';
import NavigationService from '../navigators/NavigationService';
import {mtnPaymentRequest} from '../redux/reducer/AuthReducer';
import errorMessages from '../utils/errorMessages';
import connectionrequest from '../utils/helpers/NetInfo';
import showErrorAlert from '../utils/helpers/Toast';

let status = '';

let listData = [
  // {
  //   id: 1,
  //   name: 'Bank Transfer',
  //   category: 'Lorem ipsum dolor sit amet consectetur',
  // },
  {
    id: 2,
    name: 'MTN Payment',
    category: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: 3,
    name: 'ORANGE Payment',
    category: 'Lorem ipsum dolor sit amet consectetur',
  },
  // {
  //   id: 4,
  //   name: 'Cryptocurrency Payment',
  //   category: 'Lorem ipsum dolor sit amet consectetur',
  // },
];

const SubscriptionPayment = props => {
  const {plan} = props.route.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

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

  const paymentSubscription = () => {
    setIsError(true);
    if (phoneNo === '') {
      setErrorMessage(errorMessages.ENTER_MOBILE_NUMBER);
    } else {
      setIsError(false);

      let obj = {
        subscription_plan_id: plan.id,
        phone_number: phoneNo,
      };

      connectionrequest()
        .then(() => {
          dispatch(mtnPaymentRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/mtnPaymentRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/mtnPaymentSuccess':
        status = AuthReducer.status;
        setShowSeen(true);
        break;
      case 'Auth/mtnPaymentFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const listHeaderComponent = () => {
    return (
      <View
        style={{
          backgroundColor: Colors.themeWhite,
          paddingHorizontal: normalize(15),
          paddingVertical: normalize(15),
          justifyContent: 'center',
          borderRadius: normalize(8),
          marginVertical: normalize(15),
        }}>
        <Text
          style={{
            fontFamily: Fonts.FustatSemiBold,
            fontSize: normalize(14),
            color: Colors.themeBlack,
            lineHeight: normalize(22),
          }}>
          {'Credit Card/Debit Card'}
        </Text>

        <TextIn
          show={cardNo?.length > 0 ? true : false}
          value={cardNo}
          isVisible={false}
          onChangeText={val => setCardNo(val?.trimStart())}
          height={normalize(50)}
          width={normalize(280)}
          fonts={Fonts.FustatMedium}
          borderColor={Colors.themeBoxBorder}
          borderWidth={1}
          maxLength={60}
          marginTop={normalize(15)}
          marginBottom={normalize(10)}
          // marginLeft={normalize(10)}
          outlineTxtwidth={normalize(50)}
          label={'Card Number'}
          placeholder={'Enter Card Number'}
          //placeholderIcon={Icons.Email}
          placeholderTextColor={Colors.themePlaceholder}
          borderRadius={normalize(6)}
          fontSize={14}
          //Eyeshow={true}
          paddingLeft={normalize(10)}
          paddingRight={normalize(10)}
        />

        <TextIn
          show={name?.length > 0 ? true : false}
          value={name}
          isVisible={false}
          onChangeText={val => setName(val?.trimStart())}
          height={normalize(50)}
          width={normalize(280)}
          fonts={Fonts.FustatMedium}
          borderColor={Colors.themeBoxBorder}
          borderWidth={1}
          maxLength={60}
          marginTop={normalize(15)}
          marginBottom={normalize(10)}
          // marginLeft={normalize(10)}
          outlineTxtwidth={normalize(50)}
          label={'Card Holder Name'}
          placeholder={'Enter Card Holder Name'}
          //placeholderIcon={Icons.Email}
          placeholderTextColor={Colors.themePlaceholder}
          borderRadius={normalize(6)}
          fontSize={14}
          //Eyeshow={true}
          paddingLeft={normalize(10)}
          paddingRight={normalize(10)}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TextIn
            show={expiry?.length > 0 ? true : false}
            value={expiry}
            isVisible={false}
            onChangeText={val => setExpiry(val?.trimStart())}
            height={normalize(50)}
            width={normalize(130)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            borderWidth={1}
            maxLength={60}
            marginTop={normalize(15)}
            marginBottom={normalize(10)}
            // marginLeft={normalize(10)}
            outlineTxtwidth={normalize(50)}
            label={'Expire Date'}
            placeholder={'Enter Expire Date'}
            //placeholderIcon={Icons.Email}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            //Eyeshow={true}
            paddingLeft={normalize(10)}
            paddingRight={normalize(10)}
          />
          <TextIn
            show={cvv?.length > 0 ? true : false}
            value={cvv}
            isVisible={false}
            onChangeText={val => setCvv(val?.trimStart())}
            height={normalize(50)}
            width={normalize(130)}
            fonts={Fonts.FustatMedium}
            borderColor={Colors.themeBoxBorder}
            borderWidth={1}
            maxLength={60}
            marginTop={normalize(15)}
            marginBottom={normalize(10)}
            // marginLeft={normalize(10)}
            outlineTxtwidth={normalize(50)}
            label={'CVV'}
            placeholder={'Enter CVV'}
            //placeholderIcon={Icons.Email}
            placeholderTextColor={Colors.themePlaceholder}
            borderRadius={normalize(6)}
            fontSize={14}
            //Eyeshow={true}
            paddingLeft={normalize(10)}
            paddingRight={normalize(10)}
          />
        </View>
        <View style={styles.btnMainContainer}>
          <NextBtn
            //   loading={AuthReducer?.status == 'Auth/signinRequest'}
            height={normalize(50)}
            title={'Pay Now'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => paymentSubscription()}
          />
        </View>
      </View>
    );
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
          loading={AuthReducer?.status == 'Auth/mtnPaymentRequest'}
          height={normalize(50)}
          title={'Pay Now'}
          borderColor={Colors.themeGreen}
          color={Colors.themeWhite}
          backgroundColor={Colors.themeGreen}
          onPress={() =>
            openPayNow === 'MTN Payment' ? paymentSubscription() : null
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
              renderItem={({item, index}) => renderServices(item, index)}
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
