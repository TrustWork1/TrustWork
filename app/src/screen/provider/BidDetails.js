import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Loader from '../../utils/helpers/Loader';
import Header from '../../components/Header';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import moment from 'moment';
import css from '../../themes/css';
import normalize from '../../utils/helpers/normalize';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {bidDetailsRequest} from '../../redux/reducer/ProjectReducer';
import DataWithIcon from '../../components/Micro/DataWithIcon';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';

const BidDetails = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  useEffect(() => {
    connectionrequest()
      .then(() => {

        dispatch(bidDetailsRequest(props?.route?.params?.bid_id));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  }, [isFocused]);
  console.log(props);
  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={ProjectReducer?.status == 'Project/notificationRequest'}
      /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'Bid Details'} />
      <View style={styles.container}>
        <View style={styles.listMainConatiner}>
          <View style={styles.lightContainer}>
            <View style={[css.w100]}>
              <View style={[css.rowBetween]}>
                <Text style={styles.projectTitle}>
                  {ProjectReducer?.bidDetailsResponse?.data?.project_title}
                </Text>
                {ProjectReducer?.bidDetailsResponse?.data?.status ==
                  'Rejected' && (
                  <Text style={[styles.projectTitle, {color: 'red'}, css.pr2]}>
                    {ProjectReducer?.bidDetailsResponse?.data?.status}
                  </Text>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Icons.LocationPin} style={styles.locationIcon} />
                <Text style={[styles.greyTxt, {marginTop: normalize(4)}]}>
                  {
                    ProjectReducer?.bidDetailsResponse?.data?.project
                      ?.project_address
                  }
                </Text>
              </View>
            </View>
          </View>
          <View style={{backgroundColor: Colors.themeWhite}}>
            <View
              style={{
                marginHorizontal: normalize(12),
                paddingVertical: normalize(8),
              }}>
              <View style={styles.commonConatiner}>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.dollar}
                    darkTxt={'Project Budget'}
                    lightTxt={`$${ProjectReducer?.bidDetailsResponse?.data?.project?.project_budget}`}
                  />
                </View>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.status}
                    darkTxt={'Project Category'}
                    lightTxt={
                      ProjectReducer?.bidDetailsResponse?.data?.project
                        ?.project_category?.title
                    }
                  />
                </View>
              </View>
              <View style={styles.commonConatiner}>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.profileCircle}
                    darkTxt={'Client Name'}
                    lightTxt={
                      ProjectReducer?.bidDetailsResponse?.data?.project
                        ?.client_full_name
                    }
                  />
                </View>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.LocationPin}
                    darkTxt={'Client Location'}
                    lightTxt={
                      ProjectReducer?.bidDetailsResponse?.data?.project
                        ?.project_address
                    }
                  />
                </View>
              </View>

              <View style={styles.commonConatiner}>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.bidAmount}
                    darkTxt={'Bid Amount'}
                    lightTxt={`$${
                      ProjectReducer?.bidDetailsResponse?.data
                        ?.project_total_cost || 0
                    }`}
                  />
                </View>
                <View style={{flex: 0.47}}>
                  <DataWithIcon
                    img={Icons.cal}
                    darkTxt={'Bid Date'}
                    lightTxt={moment(
                      ProjectReducer?.bidDetailsResponse?.data?.created_at,
                    ).format('Do MMM, YYYY')}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BidDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
    padding: normalize(10),
  },
  listMainConatiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(14),
    overflow: 'hidden',
    // flex: 1,
  },
  greyTxt: {
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    marginLeft: normalize(4),
  },
  locationIcon: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: 'contain',
  },
  lightContainer: {
    backgroundColor: Colors.themeProjectBackground,
    // width: width,
    padding: normalize(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: normalize(15),
  },
  commonConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
    textTransform: 'capitalize',
  },
  statusTxt: {
    color: Colors.themeWhite,
    fontFamily: Fonts.FustatMedium,
    letterSpacing: normalize(0.5),
    fontSize: normalize(10),
  },
});
