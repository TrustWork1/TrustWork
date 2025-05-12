import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import Dropdown from '../../components/Dropdown';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {SendBidRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

const timelineUnits = [
  {
    id: 1,
    title: 'Hrs',
  },
  {
    id: 2,
    title: 'Days',
  },
  {
    id: 3,
    title: 'Weeks',
  },
  {
    id: 4,
    title: 'Months',
  },
  {
    id: 5,
    title: 'Years',
  },
];

let status = '';

const SendBid = props => {
  const {item} = props?.route?.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [bidDetails, setBidDetails] = useState('');
  const [quotation, setQuotation] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [units, setUnits] = useState('');

  const sendBidFun = () => {
    if (bidDetails?.trim() == '') {
      showErrorAlert('Please enter bid details');
    } else if (quotation?.trim() == '') {
      showErrorAlert('Please enter quotation details');
    } else if (budget == 0) {
      showErrorAlert('Please enter project total cost');
    } else if (!budget.match(/^[0-9]+$/)) {
      showErrorAlert('please use only numerical value for budget');
    } else if (timeline?.trim() == '') {
      showErrorAlert('Please enter project timeline');
    } else if (units == '') {
      showErrorAlert('Please select Project Category Units');
    } else {
      let obj = {
        bid_details: bidDetails,
        quotation_details: quotation,
        project_total_cost: budget,
        time_line: timeline,
        project: item?.id,
        time_line_hour: units,
        can_send_bid: true,
      };

      connectionrequest()
        .then(() => {
          dispatch(SendBidRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/SendBidRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/SendBidSuccess':
        status = ProjectReducer.status;
        NavigationService?.navigate('ProviderBids');
        break;
      case 'Project/SendBidFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Send Bid'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            // style={{marginBottom: 150}}
            enableOnAndroid={true}
            scrollEnabled={true}
            // extraScrollHeight={100}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps={'handled'}
            scrollToOverflowEnabled={true}
            enableAutomaticScroll={true}
            contentContainerStyle={{
              //paddingBottom: windowHeight / 4,
              paddingBottom:
                Platform.OS === 'ios' ? normalize(20) : normalize(75),
            }}>
            <View
              style={{
                paddingHorizontal: normalize(10),
                marginTop: normalize(15),
              }}>
              <TextIn
                show={bidDetails?.length > 0 ? true : false}
                value={bidDetails}
                isVisible={false}
                onChangeText={val => setBidDetails(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                //marginTop={normalize(25)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Bid Details'}
                placeholder={'Enter Bid Details'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <TextIn
                show={quotation?.length > 0 ? true : false}
                value={quotation}
                isVisible={false}
                onChangeText={val => setQuotation(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Quotation Details'}
                placeholder={'Enter Quotation Details'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <TextIn
                show={budget?.length > 0 ? true : false}
                value={`${budget}`}
                isVisible={false}
                onChangeText={val => setBudget(val?.trimStart())}
                // onChangeText={val => {
                //   val = val.split('$').join('');
                //   setBudget(`${val}`);
                // }}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                keyboardType={'number-pad'}
                label={'Project Total Cost'}
                placeholder={'Enter Total Cost'}
                // placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />
              <TextIn
                show={timeline?.length > 0 ? true : false}
                value={timeline}
                isVisible={false}
                onChangeText={val => setTimeline(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                keyboardType={'number-pad'}
                label={'Timeline'}
                placeholder={'Enter Timeline'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <Dropdown
                show={units?.length > 0 ? true : false}
                data={timelineUnits}
                height={normalize(50)}
                width={normalize(280)}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                fonts={Fonts.VerdanaProMedium}
                borderRadius={normalize(6)}
                fontSize={14}
                marginTop={normalize(15)}
                paddingLeft={normalize(12)}
                valueColor={Colors.themeBlack}
                paddingHorizontal={normalize(5)}
                label={'Project Timeline Units'}
                placeholder={'Select Units'}
                value={units}
                // modalHeight
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                placeholderTextColor={Colors.themePlaceholder}
                onChange={(selecetedItem, index) => {
                  setUnits(selecetedItem?.title);
                }}
              />
            </View>
            <View style={styles.btnMainContainer}>
              <NextBtn
                loading={ProjectReducer.status == 'Project/SendBidRequest'}
                height={normalize(50)}
                title={'SUBMIT Bid'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => sendBidFun()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SendBid;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  searchMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: normalize(7),
    flexDirection: 'row',
  },
  searchContainer: {
    width: '100%',
    height: normalize(50),
    backgroundColor: Colors.themeSearchBackground,
    borderColor: Colors.themeSearchBorder,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
  },
  searchInputContainer: {
    width: '80%',
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
    paddingHorizontal: normalize(10),
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    borderLeftWidth: 1,
    borderColor: Colors.themeSearchBorder,
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    lineHeight: normalize(22),
    fontSize: normalize(16),
    color: Colors.themeWhite,
    paddingTop: normalize(10),
    paddingBottom: normalize(5),
  },
  featuredContainer: {
    width: normalize(110),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },

  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    paddingLeft: normalize(3),
    // lineHeight: normalize(22),
  },
  featuredImg: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(56 / 2),
  },

  featuredImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  featuredStarImg: {
    width: normalize(13),
    height: normalize(13),
    marginRight: normalize(3),
    tintColor: Colors.themeStarColor,
  },
  featuredStarRatingTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredStarRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(24),
    width: normalize(60),
    backgroundColor: Colors.themeStarRatingBackground,
    borderRadius: normalize(30),
    marginTop: normalize(10),
  },

  recentContainer: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(18),
  },
});
